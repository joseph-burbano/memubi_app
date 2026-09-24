import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TipoUbicacion } from '../../../core/models/pendiente.model';

@Component({
  selector: 'mob-tipo-ubicacion',
  standalone: true,
  template: `
    <div class="opciones" role="radiogroup" aria-label="Tipo de ubicación">
      <button class="opcion" type="button" role="radio" [attr.aria-checked]="tipo === 'categoria'"
        [class.opcion--elegida]="tipo === 'categoria'" (click)="elegir.emit('categoria')">
        <span class="opcion__radio" aria-hidden="true"></span>
        <span class="opcion__cuerpo"><strong>Cualquier lugar de una categoría</strong>
          <span>Ejemplo: cualquier supermercado.</span></span>
      </button>
      <button class="opcion" type="button" role="radio" [attr.aria-checked]="tipo === 'direccion'"
        [class.opcion--elegida]="tipo === 'direccion'" (click)="elegir.emit('direccion')">
        <span class="opcion__radio" aria-hidden="true"></span>
        <span class="opcion__cuerpo"><strong>Una dirección específica</strong>
          <span>Solo cerca de la dirección elegida.</span></span>
      </button>
    </div>
  `,
  styles: [`
    .opciones { display: flex; flex-direction: column; gap: var(--ui-space-3); }
    .opcion { display: flex; align-items: flex-start; gap: var(--ui-space-4); width: 100%;
      min-height: 6.5rem; padding: 0.75rem 1.125rem; background: var(--ui-surface);
      border: 1px solid var(--ui-border); border-radius: var(--ui-radius-sm);
      color: var(--ui-text-primary); text-align: left; cursor: pointer; }
    .opcion--elegida { background: var(--ui-brand-subtle); border: 2px solid var(--ui-brand); padding: calc(0.75rem - 1px) calc(1.125rem - 1px); }
    .opcion__radio { flex: none; width: 1.75rem; height: 1.75rem; margin-top: 0.375rem;
      border: 2px solid var(--ui-border-strong); border-radius: var(--ui-radius-pill); }
    .opcion--elegida .opcion__radio { border-color: var(--ui-brand);
      background: radial-gradient(circle, var(--ui-brand) 0 40%, transparent 41%); }
    .opcion__cuerpo { display: flex; flex-direction: column; justify-content: space-between; gap: var(--ui-space-2); min-height: 5rem; }
    strong { font: 600 var(--ui-body-size) / var(--ui-body-line) var(--ui-font); }
    .opcion__cuerpo > span { font: 400 var(--ui-caption-size) / var(--ui-caption-line) var(--ui-font); color: var(--ui-text-secondary); }
    .opcion:focus-visible { outline: 2px solid var(--ui-brand); outline-offset: 2px; }
  `],
})
export class TipoUbicacionComponent {
  @Input() tipo: TipoUbicacion | null = null;
  @Output() elegir = new EventEmitter<TipoUbicacion>();
}
