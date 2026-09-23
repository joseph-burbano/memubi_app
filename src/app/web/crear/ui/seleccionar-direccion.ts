import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { MapaRadioComponent } from './mapa-radio';
import { BotonComponent } from '../../../ui/boton';
import { Lugar } from '../../../core/models/lugar.model';
import { RadioAviso } from '../../../core/models/radio.model';

/**
 * Pop up de mapa en vista grande. `MW2c`.
 *
 * Es el "elemento en vista grande" que pedía el tutor en la corrección
 * del módulo 5: *"se puede hacer uso de dropdowns y pop ups, en caso de
 * que el usuario necesite desplegar un elemento en vista grande"*. En
 * MemUbi ese elemento es el mapa — vista previa pequeña al lado del
 * formulario, y grande solo para elegir el punto.
 *
 * MIDE 1040x700 EN EL MOCKUP, más alto que muchas ventanas reales. Por
 * eso el cuerpo se desplaza y las acciones quedan fijas abajo: sin eso,
 * en una pantalla de portátil los botones caen fuera y no hay forma de
 * cerrar el pop up.
 */
@Component({
  selector: 'web-seleccionar-direccion',
  standalone: true,
  imports: [MapaRadioComponent, BotonComponent],
  template: `
    <div class="velo" (click)="cerrar.emit()">
      <div
        class="popup"
        role="dialog"
        aria-modal="true"
        aria-label="Selecciona la dirección"
        (click)="$event.stopPropagation()"
      >
        <div class="popup__cabecera">
          <div>
            <h2 class="popup__titulo">Selecciona la dirección</h2>
            <p class="popup__ayuda">
              Busca, o toca un punto del mapa. El círculo muestra el radio de
              aviso.
            </p>
          </div>
          <button
            class="popup__cerrar"
            type="button"
            aria-label="Cerrar"
            (click)="cerrar.emit()"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div class="popup__cuerpo">
          <input
            class="campo ui-body-lg"
            type="search"
            aria-label="Dirección"
            placeholder="Busca una dirección"
            [value]="elegida()"
            (input)="elegida.set($any($event.target).value)"
          />

          <web-mapa-radio
            [radio]="radio"
            [alto]="376"
            [destino]="etiqueta()"
            [candidatos]="candidatos"
            seleccionable
          />
        </div>

        <div class="popup__acciones">
          <ui-boton class="popup__cancelar" variante="secundario" (click)="cerrar.emit()">
            Cancelar
          </ui-boton>
          <ui-boton
            class="popup__usar"
            variante="primario"
            [deshabilitado]="!elegida().trim()"
            (click)="usar.emit(elegida())"
          >
            Usar esta dirección
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
        background: color-mix(in srgb, var(--ui-text-primary) 88%, transparent);
      }
      /* Nunca más alto que la ventana: si el pop up midiera sus 700px
       * fijos, en un portátil los botones quedarían fuera de pantalla y
       * no habría forma de cerrarlo. */
      .popup {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 65rem;
        max-height: 100%;
        background: var(--ui-surface);
        border-radius: 1.25rem;
        overflow: hidden;
      }
      .popup__cabecera {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1.5rem;
        padding: 2.25rem 2.5rem 0;
      }
      .popup__titulo {
        margin: 0;
        font: 600 var(--ui-h2-size) / var(--ui-h2-line) var(--ui-font);
        letter-spacing: var(--ui-h2-track);
        color: var(--ui-text-primary);
      }
      .popup__ayuda {
        margin: 0.25rem 0 0;
        font: 400 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-text-secondary);
      }
      .popup__cerrar {
        flex: none;
        width: 2.75rem;
        height: 2.75rem;
        background: none;
        border: none;
        font: 600 var(--ui-h3-size) / 1 var(--ui-font);
        color: var(--ui-text-secondary);
        cursor: pointer;
      }
      .popup__cerrar:focus-visible {
        outline: 2px solid var(--ui-brand);
        outline-offset: 2px;
        border-radius: var(--ui-radius-sm);
      }
      /* Lo único que se desplaza. Las acciones se quedan a la vista. */
      .popup__cuerpo {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        padding: 1.25rem 2.5rem 2rem;
      }
      .campo {
        min-height: 3.75rem;
        padding: 0 1.5rem;
        background: var(--ui-surface);
        border: 1px solid var(--ui-border);
        border-radius: var(--ui-radius-sm);
        color: var(--ui-text-primary);
      }
      .campo:focus {
        border-color: var(--ui-brand);
        outline: none;
      }
      .popup__acciones {
        display: flex;
        justify-content: space-between;
        gap: 1rem;
        padding: 1.25rem 2.5rem;
        border-top: 1px solid var(--ui-border);
      }
      .popup__cancelar {
        --ui-boton-alto: 3rem;
        --ui-boton-ancho: 10rem;
      }
      .popup__usar {
        --ui-boton-alto: 3rem;
        --ui-boton-ancho: 15rem;
      }
    `,
  ],
})
export class SeleccionarDireccionComponent {
  @Input() radio: RadioAviso = 500;
  @Input() candidatos: readonly Lugar[] = [];
  @Input() set direccion(v: string) {
    this.elegida.set(v ?? '');
  }

  readonly elegida = signal('');

  @Output() cerrar = new EventEmitter<void>();
  @Output() usar = new EventEmitter<string>();

  etiqueta(): string {
    const d = this.elegida().trim();
    return d ? d.split(',')[0].trim() : '';
  }
}
