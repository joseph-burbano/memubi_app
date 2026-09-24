import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BarraSuperiorComponent } from '../../ui/barra-superior';

/**
 * Configuración. `MM23`. Índice de los dos apartados de privacidad.
 *
 * Solo existe en móvil. La web no la tiene porque lo que se administra
 * aquí —las alertas por lugar y los permisos de ubicación— vive en el
 * dispositivo, no en el navegador. Ver `core/capabilities.ts`.
 *
 * Las filas son `<button>` y no `<div>` con click: navegan, así que
 * tienen que responder al teclado y anunciarse al lector de pantalla.
 * La flecha `›` va con `aria-hidden`; el texto ya dice a dónde lleva.
 */
@Component({
  selector: 'mob-configuracion',
  standalone: true,
  imports: [BarraSuperiorComponent],
  template: `
    <div class="pantalla">
      <mob-barra-superior titulo="Configuración" (atras)="volver()" />

      <main class="configuracion">
        <p class="configuracion__intro">Ajustes de la aplicación</p>

        <nav class="opciones">
          <button class="opcion" type="button" (click)="ir('/privacidad/ubicacion')">
            <span class="opcion__texto">
              <span class="opcion__titulo">Privacidad y ubicación</span>
              <span class="opcion__ayuda">
                Administra las alertas basadas en ubicación y consulta sus
                permisos.
              </span>
            </span>
            <span class="opcion__flecha" aria-hidden="true">›</span>
          </button>

          <button class="opcion" type="button" (click)="ir('/privacidad/datos')">
            <span class="opcion__texto">
              <span class="opcion__titulo">Privacidad y datos</span>
              <span class="opcion__ayuda">
                Conoce qué información utiliza la aplicación para ofrecer sus
                funciones.
              </span>
            </span>
            <span class="opcion__flecha" aria-hidden="true">›</span>
          </button>
        </nav>
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
      .configuracion {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 1.5rem 1.25rem;
        padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
      }
      .configuracion__intro {
        margin: 0 0 1rem;
        font: 400 var(--ui-caption-size) / var(--ui-caption-line) var(--ui-font);
        letter-spacing: var(--ui-caption-track);
        color: var(--ui-text-secondary);
      }
      .opciones {
        display: flex;
        flex-direction: column;
        /* MM23: 20px entre tarjetas, no 12. */
        gap: 1.25rem;
      }
      .opcion {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        width: 100%;
        padding: 1.25rem;
        background: var(--ui-surface);
        border: 1px solid var(--ui-border);
        border-radius: var(--ui-radius-md);
        text-align: left;
        cursor: pointer;
      }
      .opcion:focus-visible {
        outline: 2px solid var(--ui-brand);
        outline-offset: 2px;
      }
      .opcion__texto {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }
      .opcion__titulo {
        font: 600 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-text-primary);
      }
      .opcion__ayuda {
        font: 400 var(--ui-caption-size) / var(--ui-caption-line) var(--ui-font);
        letter-spacing: var(--ui-caption-track);
        color: var(--ui-text-secondary);
      }
      .opcion__flecha {
        flex: none;
        font: 600 var(--ui-h3-size) / 1 var(--ui-font);
        color: var(--ui-text-secondary);
      }
    `,
  ],
})
export class ConfiguracionPage {
  private readonly router = inject(Router);

  ir(ruta: string): void {
    void this.router.navigate([ruta]);
  }

  /** MM23 -> MM12 */
  volver(): void {
    void this.router.navigate(['/pendientes']);
  }
}
