import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BarraSuperiorComponent } from '../../ui/barra-superior';

/**
 * Privacidad y datos. `MM25`. Qué información usa la aplicación.
 *
 * Es la única pantalla del bloque que existe igual en web (`MW6`): no
 * depende del dispositivo, es información sobre el producto.
 *
 * LA TARJETA FINAL VA EN TEAL SUAVE, no en gris como las demás. En el
 * mockup es la única con `brand-subtle` y borde `brand-border`, y no es
 * decoración: es la promesa de privacidad, lo que diferencia a MemUbi de
 * una app que registra por dónde pasas. El color la separa del inventario
 * de datos que tiene encima.
 *
 * "Lugares frecuentes" aparece aunque el producto todavía no los
 * administre: administrarlos se descartó en la Entrega 3 por inventar
 * funcionalidad. Aquí solo se declara que esa información existe, que es
 * lo que el mockup dice. No lo conviertas en una pantalla.
 */
@Component({
  selector: 'mob-privacidad-datos',
  standalone: true,
  imports: [BarraSuperiorComponent],
  template: `
    <div class="pantalla">
      <mob-barra-superior titulo="Privacidad y datos" (atras)="volver()" />

      <main class="datos">
        <p class="datos__intro">
          Conoce qué información utiliza la aplicación para ofrecer sus
          funciones.
        </p>

        <dl class="inventario">
          <div class="inventario__fila">
            <dt>Pendientes</dt>
            <dd>
              El contenido necesario para mostrar y administrar tus
              recordatorios.
            </dd>
          </div>
          <div class="inventario__fila">
            <dt>Ubicaciones asociadas</dt>
            <dd>
              Las ubicaciones utilizadas para configurar recordatorios por
              proximidad.
            </dd>
          </div>
          <div class="inventario__fila">
            <dt>Lugares frecuentes</dt>
            <dd>
              Los lugares guardados por el usuario para facilitar la
              configuración de pendientes.
            </dd>
          </div>
        </dl>

        <section class="promesa">
          <h2 class="promesa__titulo">La comparación ocurre en tu teléfono</h2>
          <p class="promesa__texto">
            No guardamos por dónde pasaste, solo si llegaste cerca de un lugar
            tuyo.
          </p>
        </section>
      </main>
    </div>
  `,
  styles: [
    `
      .pantalla {
        display: flex;
        flex-direction: column;
        min-height: 100dvh;
        background: var(--ui-surface-alt);
      }
      .datos {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem 1.25rem;
        padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
      }
      .datos__intro {
        margin: 0 0 1.25rem;
        font: 400 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-text-secondary);
      }
      .inventario {
        margin: 0;
        padding: 1.25rem;
        background: var(--ui-surface);
        border: 1px solid var(--ui-border);
        border-radius: var(--ui-radius-md);
      }
      .inventario__fila + .inventario__fila {
        margin-top: 0.75rem;
        padding-top: 0.75rem;
        border-top: 1px solid var(--ui-border);
      }
      .inventario dt {
        margin: 0;
        font: 600 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-text-primary);
      }
      .inventario dd {
        margin: 0.25rem 0 0;
        font: 400 var(--ui-caption-size) / var(--ui-caption-line) var(--ui-font);
        letter-spacing: var(--ui-caption-track);
        color: var(--ui-text-secondary);
      }
      /* La única tarjeta en teal: es la promesa, no un dato más. */
      .promesa {
        margin-top: 0.75rem;
        padding: 1.25rem;
        background: var(--ui-brand-subtle);
        border: 1.5px solid var(--ui-brand-border);
        border-radius: var(--ui-radius-md);
      }
      .promesa__titulo {
        margin: 0;
        font: 600 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-brand);
      }
      .promesa__texto {
        margin: 0.75rem 0 0;
        font: 400 var(--ui-caption-size) / var(--ui-caption-line) var(--ui-font);
        letter-spacing: var(--ui-caption-track);
        color: var(--ui-text-primary);
      }
    `,
  ],
})
export class PrivacidadDatosPage {
  private readonly router = inject(Router);

  /** MM25 -> MM23 */
  volver(): void {
    void this.router.navigate(['/configuracion']);
  }
}
