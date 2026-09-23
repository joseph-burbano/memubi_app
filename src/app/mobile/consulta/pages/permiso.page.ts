import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BarraSuperiorComponent } from '../../ui/barra-superior';
import { AnillosProximidadComponent } from '../../ui/anillos-proximidad';
import { BotonComponent } from '../../../ui/boton';

/**
 * Permiso de ubicación. `MM01` y `MM02`.
 *
 * DOS MARCOS, UNA PÁGINA, DOS ESTADOS:
 *
 *   MM01  primera vez             "Continuar" · "Ahora no"
 *   MM02  tras decir "Ahora no"   "Permitir alertas por ubicación" ·
 *                                 "Desactivar por el momento"
 *
 * Comparten barra, ilustración y titular; cambian el cuerpo, los botones
 * y el color de los anillos. `MM02` los apaga a gris: el concepto visual
 * cuenta el estado y no solo decora.
 *
 * NO PIDE EL PERMISO DE VERDAD. Es un prototipo no funcional: los
 * botones navegan y nada más. Cuando el producto sea real, aquí entra
 * `Geolocation.requestPermissions()` de Capacitor, y aparte el flujo de
 * `ACCESS_BACKGROUND_LOCATION`, que en Android 10+ se pide por separado.
 *
 * El párrafo del segundo plano está en el mockup y va aunque parezca
 * repetitivo: es la advertencia que evita que alguien acepte el permiso
 * básico y después no reciba ningún aviso.
 */
@Component({
  selector: 'mob-permiso',
  standalone: true,
  imports: [BarraSuperiorComponent, AnillosProximidadComponent, BotonComponent],
  template: `
    <div class="pantalla">
      <mob-barra-superior />

      <main class="permiso">
        <div class="permiso__ilustracion">
          <mob-anillos-proximidad [tamano]="304" [apagado]="rechazado()" />
        </div>

        <h1 class="permiso__titulo">Recordatorios cuando estés cerca</h1>

        <p class="permiso__texto">{{ texto() }}</p>

        <p class="permiso__nota">{{ nota() }}</p>

        <div class="permiso__acciones">
          <ui-boton variante="primario" anchoCompleto (click)="permitir()">
            {{ rechazado() ? 'Permitir alertas por ubicación' : 'Continuar' }}
          </ui-boton>
          <button
            class="permiso__secundario"
            [class.permiso__secundario--apagado]="rechazado()"
            type="button"
            (click)="rechazar()"
          >
            {{ rechazado() ? 'Desactivar por el momento' : 'Ahora no' }}
          </button>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .pantalla {
        display: flex;
        flex-direction: column;
        min-height: 100dvh;
        /* Transparente para que se vea la textura del fondo. */
        background: transparent;
      }
      .permiso {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 0 1.25rem;
        /* 68px de aire bajo "Ahora no": es lo que deja MM01 (el enlace
         * termina en 628 de 696 de área de contenido). Con el pie más
         * alto, empujar con margin-top:auto cae justo donde el mockup,
         * y en pantallas más altas o más bajas sigue comportándose. */
        padding-bottom: calc(4.25rem + env(safe-area-inset-bottom, 0px));
      }
      .permiso__ilustracion {
        display: flex;
        justify-content: center;
        padding: 2.5rem 0 1rem;
      }
      .permiso__titulo {
        margin: 0;
        font: 600 var(--ui-h2-size) / var(--ui-h2-line) var(--ui-font);
        letter-spacing: var(--ui-h2-track);
        color: var(--ui-text-primary);
        text-align: center;
      }
      .permiso__texto {
        margin: 1.5rem 0 0;
        font: 400 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-text-secondary);
      }
      .permiso__nota {
        margin: 1.5rem 0 0;
        font: 400 var(--ui-caption-size) / var(--ui-caption-line) var(--ui-font);
        letter-spacing: var(--ui-caption-track);
        color: var(--ui-text-secondary);
      }
      .permiso__acciones {
        margin-top: auto;
        padding-top: 2rem;
      }
      .permiso__secundario {
        width: 100%;
        min-height: 2.75rem;
        margin-top: 1rem;
        background: none;
        border: none;
        font: 600 var(--ui-button-size) / var(--ui-button-line) var(--ui-font);
        letter-spacing: var(--ui-button-track);
        color: var(--ui-brand);
        cursor: pointer;
      }
      /* En MM02 el secundario pierde el teal: ya no es una alternativa
       * neutra, es la opción que apaga la función principal. */
      .permiso__secundario--apagado {
        color: var(--ui-text-secondary);
      }
    `,
  ],
})
export class PermisoPage {
  /** false = MM01 · true = MM02 */
  private readonly _rechazado = signal(false);
  readonly rechazado = this._rechazado.asReadonly();

  constructor(private readonly router: Router) {}

  readonly texto = computed(() =>
    this.rechazado()
      ? 'Sin acceso a la ubicación no podremos informarte cuando pases cerca de un lugar relacionado con tus pendientes.'
      : 'Para avisarte cuando estés cerca de un lugar relacionado con tus pendientes, la aplicación necesita acceder a tu ubicación.',
  );

  readonly nota = computed(() =>
    this.rechazado()
      ? 'Puedes activarlo más adelante desde Configuración.'
      : 'Para recibir recordatorios aunque no tengas la aplicación abierta, también puede ser necesario permitir el acceso en segundo plano.',
  );

  /** MM01 -> MM03 · MM02 -> MM03 */
  permitir(): void {
    void this.router.navigate(['/pendientes']);
  }

  /**
   * MM01 -> MM02: "Ahora no" no sale de la pantalla, la cambia de estado.
   * MM02 -> MM03: desde MM02 sí continúa, ya sin alertas.
   */
  rechazar(): void {
    if (this.rechazado()) {
      void this.router.navigate(['/pendientes']);
      return;
    }
    this._rechazado.set(true);
  }
}
