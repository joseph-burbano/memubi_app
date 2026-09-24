import { Component, EventEmitter, Input, Output, booleanAttribute } from '@angular/core';

/**
 * Tarjeta seleccionable con radio. El control que más se repite en `MW2`:
 * tipo de ubicación, categoría, radio de aviso y direcciones candidatas
 * son todos esto, con distinto contenido.
 *
 * Seleccionada: fondo `brand-subtle` y borde de 2px en `brand`.
 * Sin seleccionar: blanca con borde de 1px en `border`.
 * Inactiva: fondo `surface-sunken` y texto `text-disabled` (MW2d, cuando
 * todavía no se ha elegido el tipo de ubicación).
 *
 * Es un `<button role="radio">` y no un `<input>`: el mockup dibuja una
 * tarjeta entera pulsable, no un círculo con etiqueta al lado. El rol
 * hace que el lector de pantalla la anuncie igual que un radio de
 * verdad, y el grupo que la contiene lleva `role="radiogroup"`.
 *
 * El borde de 2px al seleccionar desplazaría el contenido 1px si el
 * borde sin seleccionar fuera de 1px: por eso el no seleccionado lleva
 * un borde de 2px transparente más un `box-shadow` que hace de línea
 * fina. Así nada se mueve al elegir.
 */
@Component({
  selector: 'web-opcion',
  standalone: true,
  host: { '[class.web-opcion--host-ancho]': 'true' },
  template: `
    <button
      class="opcion"
      type="button"
      role="radio"
      [attr.aria-checked]="seleccionada"
      [disabled]="inactiva"
      [class.opcion--seleccionada]="seleccionada"
      [class.opcion--inactiva]="inactiva"
      [class.opcion--compacta]="compacta"
      (click)="elegir.emit()"
    >
      <span class="opcion__radio" aria-hidden="true">
        <span class="opcion__punto"></span>
      </span>
      <span class="opcion__texto">
        <span class="opcion__titulo">{{ titulo }}</span>
        @if (ayuda) {
          <span class="opcion__ayuda">{{ ayuda }}</span>
        }
      </span>
    </button>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .opcion {
        display: flex;
        align-items: flex-start;
        gap: 1.25rem;
        width: 100%;
        padding: 1.125rem 1.5rem;
        background: var(--ui-surface);
        border: 2px solid transparent;
        box-shadow: inset 0 0 0 1px var(--ui-border);
        border-radius: 0.875rem;
        text-align: left;
        cursor: pointer;
      }
      /* Las de categoría y radio son más bajas que las de tipo. */
      .opcion--compacta {
        align-items: center;
        padding: 0.875rem 1.25rem;
        border-radius: var(--ui-radius-sm);
      }
      .opcion--seleccionada {
        background: var(--ui-brand-subtle);
        border-color: var(--ui-brand);
        box-shadow: none;
      }
      .opcion--inactiva {
        background: var(--ui-surface-sunken);
        cursor: default;
      }
      .opcion:focus-visible {
        outline: 2px solid var(--ui-brand);
        outline-offset: 2px;
      }

      .opcion__radio {
        position: relative;
        flex: none;
        width: 1.75rem;
        height: 1.75rem;
        margin-top: 0.125rem;
        border: 2px solid var(--ui-border-strong);
        border-radius: var(--ui-radius-pill);
      }
      .opcion--compacta .opcion__radio {
        margin-top: 0;
      }
      .opcion--seleccionada .opcion__radio {
        border-color: var(--ui-brand);
      }
      .opcion--inactiva .opcion__radio {
        border-color: var(--ui-border);
      }
      .opcion__punto {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0.875rem;
        height: 0.875rem;
        transform: translate(-50%, -50%) scale(0);
        background: var(--ui-brand);
        border-radius: var(--ui-radius-pill);
        transition: transform 0.12s ease;
      }
      .opcion--seleccionada .opcion__punto {
        transform: translate(-50%, -50%) scale(1);
      }

      .opcion__texto {
        display: flex;
        flex-direction: column;
        gap: 0.125rem;
        min-width: 0;
      }
      .opcion__titulo {
        font: 600 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-text-primary);
      }
      /* Las compactas de categoría llevan el nombre en peso normal. */
      .opcion--compacta.opcion--categoria .opcion__titulo {
        font-weight: 400;
      }
      .opcion__ayuda {
        font: 400 var(--ui-caption-size) / var(--ui-caption-line) var(--ui-font);
        letter-spacing: var(--ui-caption-track);
        color: var(--ui-text-secondary);
      }
      .opcion--inactiva .opcion__titulo,
      .opcion--inactiva .opcion__ayuda {
        color: var(--ui-text-disabled);
      }
    `,
  ],
})
export class OpcionComponent {
  @Input({ required: true }) titulo!: string;
  @Input() ayuda = '';
  @Input({ transform: booleanAttribute }) seleccionada = false;
  /** MW2d: las categorías y el radio se activan al elegir el tipo. */
  @Input({ transform: booleanAttribute }) inactiva = false;
  @Input({ transform: booleanAttribute }) compacta = false;

  @Output() elegir = new EventEmitter<void>();
}
