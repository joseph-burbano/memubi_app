import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { BarraSuperiorComponent } from '../../ui/barra-superior';
import { BotonComponent } from '../../../ui/boton';
import { InterruptorComponent } from '../../../ui/interruptor';

/**
 * Privacidad y ubicación. `MM24` y `MM24b`.
 *
 * DOS MARCOS, UNA PÁGINA. El interruptor cambia de estado y con él el
 * aviso de debajo; todo lo demás es idéntico.
 *
 * DETALLE DEL MOCKUP QUE NO ES CASUAL: con las alertas encendidas el
 * aviso va en `text-secondary`, y apagadas sube a `text-primary`. Cuando
 * la función principal está desactivada, el texto que lo explica deja de
 * ser letra pequeña y pasa a primer plano.
 *
 * El acceso a la ubicación se administra desde el dispositivo. En Android,
 * "Abrir configuración" abre directamente sus ajustes de Ubicación.
 */
interface LocationSettingsPlugin {
  openLocationSettings(): Promise<void>;
}

const locationSettings = registerPlugin<LocationSettingsPlugin>('LocationSettings');

@Component({
  selector: 'mob-privacidad-ubicacion',
  standalone: true,
  imports: [BarraSuperiorComponent, BotonComponent, InterruptorComponent],
  template: `
    <div class="pantalla">
      <mob-barra-superior titulo="Privacidad y ubicación" (atras)="volver()" />

      <main class="privacidad">
        <section class="tarjeta">
          <h2 class="tarjeta__titulo">Alertas por lugar</h2>
          <p class="tarjeta__texto">
            Permite que la aplicación utilice tu ubicación para avisarte cuando
            estés cerca de un pendiente registrado.
          </p>
        </section>

        <section class="tarjeta tarjeta--control">
          <h3 class="tarjeta__titulo">Alertas por lugar</h3>
          <ui-interruptor
            [activo]="activas()"
            etiqueta="Alertas por lugar"
            (cambiar)="activas.set($event)"
          />
        </section>

        <p class="aviso" [class.aviso--destacado]="!activas()">{{ aviso() }}</p>

        <section class="tarjeta">
          <h3 class="tarjeta__titulo">Permisos de ubicación</h3>
          <p class="tarjeta__texto">
            El acceso a la ubicación y su funcionamiento en segundo plano se
            administran desde tu dispositivo.
          </p>
        </section>

        <div class="privacidad__accion">
          <ui-boton variante="secundario" anchoCompleto [deshabilitado]="abriendoAjustes()" (click)="abrirConfiguracion()">
            Abrir configuración
          </ui-boton>
          @if (errorAjustes()) {
            <p class="privacidad__error" role="alert">{{ errorAjustes() }}</p>
          }
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .pantalla {
        display: flex;
        flex-direction: column;
        height: 100dvh;
        /* Transparente para que se vea la textura del fondo. */
        background: transparent;
      }
      .privacidad {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 1.75rem 1.25rem;
        padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
      }
      .tarjeta {
        padding: 0.75rem 1.25rem;
        background: var(--ui-surface);
        border: 1px solid var(--ui-border);
        border-radius: var(--ui-radius-md);
      }
      .tarjeta + .tarjeta {
        margin-top: 0.75rem;
      }
      .tarjeta--control {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        min-height: 5rem;
        box-sizing: border-box;
      }
      .tarjeta__titulo {
        margin: 0;
        font: 600 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-text-primary);
      }
      .tarjeta__texto {
        margin: 0.375rem 0 0;
        font: 400 var(--ui-caption-size) / var(--ui-caption-line) var(--ui-font);
        letter-spacing: var(--ui-caption-track);
        color: var(--ui-text-secondary);
      }
      .aviso {
        /* MM24: 20px sobre el aviso, 28px bajo él. */
        margin: 1.25rem 0 1.75rem;
        font: 400 var(--ui-caption-size) / var(--ui-caption-line) var(--ui-font);
        letter-spacing: var(--ui-caption-track);
        color: var(--ui-text-secondary);
      }
      /* Apagadas, el aviso deja de ser letra pequeña. */
      .aviso--destacado {
        color: var(--ui-text-primary);
      }
      .privacidad__accion {
        margin-top: 1.75rem;
      }
      .privacidad__error {
        margin: 0.75rem 0 0;
        color: var(--ui-text-primary);
        font: 400 var(--ui-caption-size) / var(--ui-caption-line) var(--ui-font);
      }
    `,
  ],
})
export class PrivacidadUbicacionPage {
  private readonly router = inject(Router);

  /** true = MM24 · false = MM24b */
  readonly activas = signal(true);
  readonly abriendoAjustes = signal(false);
  readonly errorAjustes = signal('');

  readonly aviso = computed(() =>
    this.activas()
      ? 'Si desactivas esta opción, los recordatorios basados en ubicación dejarán de funcionar.'
      : 'Las alertas por lugar están desactivadas. No recibirás recordatorios al pasar cerca de un lugar.',
  );

  async abrirConfiguracion(): Promise<void> {
    this.errorAjustes.set('');
    if (!Capacitor.isNativePlatform()) {
      this.errorAjustes.set('Los ajustes de ubicación solo están disponibles en el dispositivo.');
      return;
    }

    this.abriendoAjustes.set(true);
    try {
      await locationSettings.openLocationSettings();
    } catch {
      this.errorAjustes.set('No se pudieron abrir los ajustes de ubicación.');
    } finally {
      this.abriendoAjustes.set(false);
    }
  }

  /** MM24 -> MM23 · Configuración. Todavía no existe: entra en el commit 3. */
  volver(): void {
    void this.router.navigate(['/configuracion']);
  }
}
