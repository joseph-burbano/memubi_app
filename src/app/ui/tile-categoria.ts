import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Categoria } from '../core/models/categoria.model';

/**
 * Tarjeta de categoría, seleccionable.
 *
 * Es tarjeta y no radio button por una decisión de la Entrega 3: un
 * radio button sirve para opciones de texto, y una categoría se
 * reconoce por su imagen antes que por su nombre. En móvil van en
 * cuadrícula 2x2 (MM05); en web, las cuatro a la vista (MW2).
 *
 * Elegir NO navega. Solo cambia `seleccionada`; avanzar es trabajo del
 * botón Siguiente. En el prototipo original tocar una opción saltaba de
 * pantalla y se saltaba la confirmación visual de la elección.
 */
@Component({
  selector: 'ui-tile-categoria',
  standalone: true,
  template: `
    <button
      class="tile"
      type="button"
      role="radio"
      [attr.aria-checked]="seleccionada"
      [class.tile--seleccionada]="seleccionada"
      [disabled]="deshabilitada"
      (click)="elegir.emit(categoria)"
    >
      <span class="tile__marca" aria-hidden="true"></span>
      <span class="ui-body">{{ nombre }}</span>
    </button>
  `,
  styles: [
    `
      .tile {
        display: flex;
        align-items: center;
        gap: var(--ui-space-4);
        width: 100%;
        min-height: 4rem; /* 64px */
        padding: 0 var(--ui-space-5);
        background: var(--ui-surface);
        border: 1px solid var(--ui-border);
        border-radius: var(--ui-radius-sm);
        color: var(--ui-text-primary);
        text-align: left;
        cursor: pointer;
      }
      .tile__marca {
        flex: none;
        width: 1.75rem;
        height: 1.75rem;
        border: 2px solid var(--ui-border-strong);
        border-radius: var(--ui-radius-pill);
      }
      .tile--seleccionada {
        background: var(--ui-brand-subtle);
        border-color: var(--ui-brand);
      }
      .tile--seleccionada .tile__marca {
        border-color: var(--ui-brand);
        background:
          radial-gradient(circle, var(--ui-brand) 0 40%, transparent 41%);
      }
      .tile:disabled {
        background: var(--ui-surface-sunken);
        color: var(--ui-text-disabled);
        cursor: default;
      }
      .tile:focus-visible {
        outline: 2px solid var(--ui-brand);
        outline-offset: 2px;
      }
    `,
  ],
})
export class TileCategoriaComponent {
  @Input({ required: true }) categoria!: Categoria;
  @Input({ required: true }) nombre!: string;
  @Input() seleccionada = false;
  /** Las categorías se activan al elegir "cualquier lugar de una categoría" (MW2d). */
  @Input() deshabilitada = false;

  @Output() elegir = new EventEmitter<Categoria>();
}
