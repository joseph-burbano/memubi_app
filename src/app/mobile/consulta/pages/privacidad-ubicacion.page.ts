import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
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
 * "Abrir configuración" NO HACE NADA todavía. En el producto real
 * llevaría a los ajustes del sistema; aquí es un prototipo no funcional.
 * Y el texto de la tarjeta dice por qué existe: el acceso a la ubicación
 * y el segundo plano se administran desde el dispositivo, no desde la
 * app. Eso mismo es lo que sostiene que la web no tenga esta pantalla.
 */
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
          <ui-boton variante="secundario" anchoCompleto>
            Abrir configuración
          </ui-boton>
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
        padding: 1.25rem;
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
    `,
  ],
})
export class PrivacidadUbicacionPage {
  private readonly router = inject(Router);

  /** true = MM24 · false = MM24b */
  readonly activas = signal(true);

  readonly aviso = computed(() =>
    this.activas()
      ? 'Si desactivas esta opción, los recordatorios basados en ubicación dejarán de funcionar.'
      : 'Las alertas por lugar están desactivadas. No recibirás recordatorios al pasar cerca de un lugar.',
  );

  /** MM24 -> MM23 · Configuración. Todavía no existe: entra en el commit 3. */
  volver(): void {
    void this.router.navigate(['/configuracion']);
  }
}
