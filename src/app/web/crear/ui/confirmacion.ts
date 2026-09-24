import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BotonComponent } from '../../../ui/boton';

export interface FilaResumen {
  rotulo: string;
  valor: string;
}

/**
 * Pop up de confirmación. `MW3`, `MW3b`, `MW5c` y `MW5d`.
 *
 * CUATRO MARCOS, UN COMPONENTE. Cambian el título, las filas del resumen
 * —categoría o dirección— y el texto del botón. La estructura es la
 * misma: encabezado, ficha de revisión, promesa en teal y dos acciones.
 *
 * ES UN POP UP Y NO UNA RUTA. En el mockup el formulario sigue detrás,
 * atenuado: el usuario está revisando lo que acaba de escribir, no
 * navegando a otro sitio. Si fuera una ruta, volver perdería el contexto
 * y habría que rehidratar el formulario.
 *
 * La tarjeta en teal suave repite la promesa del aviso. Es la única
 * parte coloreada del pop up: lo demás es la ficha de datos.
 */
@Component({
  selector: 'web-confirmacion',
  standalone: true,
  imports: [BotonComponent],
  template: `
    <div class="velo" (click)="volver.emit()">
      <!-- El clic dentro no debe cerrar: solo el velo. -->
      <div
        class="popup"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="titulo"
        (click)="$event.stopPropagation()"
      >
        <div class="popup__cuerpo">
          <h2 class="popup__titulo">{{ titulo }}</h2>
          <p class="popup__ayuda">{{ ayuda }}</p>

          <dl class="ficha">
            @for (f of filas; track f.rotulo) {
              <div class="ficha__fila">
                <dt class="ui-overline">{{ f.rotulo }}</dt>
                <dd>{{ f.valor }}</dd>
              </div>
            }
          </dl>

          <p class="promesa">{{ promesa }}</p>
        </div>

        <div class="popup__acciones">
          <ui-boton class="popup__volver" variante="secundario" (click)="volver.emit()">
            Volver
          </ui-boton>
          <ui-boton class="popup__guardar" variante="primario" (click)="confirmar.emit()">
            {{ textoConfirmar }}
          </ui-boton>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .velo {
        position: fixed;
        inset: 0;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        /* El mockup cubre con text-primary, no con negro puro: el velo
         * es del sistema de color, no un overlay genérico. */
        background: color-mix(in srgb, var(--ui-text-primary) 88%, transparent);
      }
      /* Nunca más alto que la ventana. Con el pop up a su alto natural,
       * en una pantalla de portátil los botones caían fuera y no había
       * forma de confirmar ni de volver. */
      .popup {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 42.5rem;
        max-height: 100%;
        background: var(--ui-surface);
        border-radius: 1.25rem;
        overflow: hidden;
      }
      /* Lo único que se desplaza: las acciones se quedan a la vista. */
      .popup__cuerpo {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 2.5rem;
      }
      .popup__titulo {
        margin: 0;
        font: 600 var(--ui-h2-size) / var(--ui-h2-line) var(--ui-font);
        letter-spacing: var(--ui-h2-track);
        color: var(--ui-text-primary);
      }
      .popup__ayuda {
        margin: 0.5rem 0 0;
        font: 400 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-text-secondary);
      }

      .ficha {
        margin: 2.25rem 0 0;
      }
      .ficha__fila + .ficha__fila {
        margin-top: 0.875rem;
        padding-top: 0.875rem;
        border-top: 1px solid var(--ui-border);
      }
      .ficha dt {
        margin: 0;
        color: var(--ui-text-secondary);
      }
      .ficha dd {
        margin: 0.375rem 0 0;
        font: 600 var(--ui-h3-size) / var(--ui-h3-line) var(--ui-font);
        letter-spacing: var(--ui-h3-track);
        color: var(--ui-text-primary);
      }

      .promesa {
        margin: 2rem 0 0;
        padding: 1.5rem;
        background: var(--ui-brand-subtle);
        border: 1.5px solid var(--ui-brand-border);
        border-radius: 0.875rem;
        font: 600 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-brand);
      }

      .popup__acciones {
        display: flex;
        justify-content: space-between;
        padding: 1.25rem 2.5rem;
        border-top: 1px solid var(--ui-border);
      }
      .popup__volver {
        --ui-boton-alto: 3rem;
        --ui-boton-ancho: 9.375rem;
      }
      .popup__guardar {
        --ui-boton-alto: 3rem;
        --ui-boton-ancho: 11.875rem;
      }
    `,
  ],
})
export class ConfirmacionComponent {
  @Input({ required: true }) titulo!: string;
  @Input() ayuda = 'Revisa la información antes de guardar.';
  @Input() filas: readonly FilaResumen[] = [];
  @Input() promesa = '';
  @Input() textoConfirmar = 'Guardar';

  @Output() volver = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<void>();
}
