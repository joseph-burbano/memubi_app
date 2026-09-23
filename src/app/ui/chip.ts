import { Component, Input } from '@angular/core';

/**
 * Chip de estado. El "Activo" de MM12 y MW1.
 *
 * El texto va en `UI/Label/Overline` a 12 px: es la única excepción al
 * mínimo de 14 px, y se sostiene porque son palabras que se reconocen,
 * no que se leen.
 *
 * No es interactivo. Si necesitas que se pueda tocar, es otro componente.
 */
@Component({
  selector: 'ui-chip',
  standalone: true,
  template: `
    <span class="chip ui-overline" [class.chip--apagado]="variante === 'apagado'">
      <ng-content />
    </span>
  `,
  styles: [
    `
      .chip {
        display: inline-flex;
        align-items: center;
        min-height: 1.5rem;
        padding: 0 var(--ui-space-3);
        background: var(--ui-brand-subtle);
        border: 1px solid var(--ui-brand-border);
        border-radius: var(--ui-radius-pill);
        color: var(--ui-brand);
      }
      .chip--apagado {
        background: var(--ui-surface-sunken);
        border-color: var(--ui-border);
        color: var(--ui-text-secondary);
      }
    `,
  ],
})
export class ChipComponent {
  @Input() variante: 'activo' | 'apagado' = 'activo';
}
