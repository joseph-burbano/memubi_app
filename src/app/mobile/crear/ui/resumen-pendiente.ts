import { Component, Input } from '@angular/core';
import { Borrador } from '../../../core/store/borrador.store';
import { nombreCategoria } from '../../../core/models/categoria.model';
import { RADIOS } from '../../../core/models/radio.model';

/** Ficha de revisión común para alta y edición (MM09/MM10/MM18/MM19). */
@Component({
  selector: 'mob-resumen-pendiente',
  standalone: true,
  template: `
    <dl class="ficha">
      <div class="fila"><dt class="ui-overline">Pendiente</dt><dd>{{ borrador.titulo }}</dd></div>
      <div class="fila"><dt class="ui-overline">Tipo de ubicación</dt>
        <dd>{{ borrador.tipoUbicacion === 'categoria' ? 'Cualquier lugar de una categoría' : 'Una dirección específica' }}</dd></div>
      <div class="fila"><dt class="ui-overline">{{ borrador.tipoUbicacion === 'categoria' ? 'Categoría' : 'Dirección' }}</dt>
        <dd>{{ borrador.tipoUbicacion === 'categoria' ? nombreCategoria(borrador.categoria!) : borrador.direccion }}</dd></div>
      <div class="fila"><dt class="ui-overline">Radio de aviso</dt><dd>{{ radioTexto() }}</dd></div>
    </dl>
    <p class="promesa ui-label-field">{{ promesa() }}</p>
  `,
  styles: [`
    .ficha { display: grid; grid-template-rows: repeat(4, minmax(0, 1fr)); height: 20rem; box-sizing: border-box;
      margin: 0; padding: 1.25rem; border: 1px solid var(--ui-border); border-radius: var(--ui-radius-md); background: var(--ui-surface); }
    .fila { display: flex; flex-direction: column; justify-content: center; min-height: 0; }
    .fila + .fila { border-top: 1px solid var(--ui-border); }
    dt { color: var(--ui-text-secondary); }
    dd { margin: var(--ui-space-1) 0 0; font: 600 var(--ui-body-size) / var(--ui-body-line) var(--ui-font); color: var(--ui-text-primary); }
    .promesa { display: flex; align-items: center; min-height: 5.5rem; box-sizing: border-box;
      margin: var(--ui-space-3) 0 0; padding: 1.25rem; border: 1.5px solid var(--ui-brand-border);
      border-radius: 0.875rem; background: var(--ui-brand-subtle); color: var(--ui-brand); }
  `],
})
export class ResumenPendienteComponent {
  @Input({ required: true }) borrador!: Borrador;
  readonly nombreCategoria = nombreCategoria;
  radioTexto(): string {
    const r = RADIOS.find((r) => r.valor === this.borrador.radioAviso);
    return r ? `${r.etiqueta} · ${r.ayuda}` : '';
  }
  promesa(): string {
    const r = this.borrador.radioAviso >= 1000 ? '1 km' : `${this.borrador.radioAviso} m`;
    if (this.borrador.tipoUbicacion === 'categoria') {
      return `Te avisaremos cuando estés a ${r} de cualquier ${nombreCategoria(this.borrador.categoria!).toLowerCase()}.`;
    }
    const calle = (this.borrador.direccion ?? '').split(',')[0].trim();
    return `Te avisaremos cuando estés a ${r} de ${calle}.`;
  }
}
