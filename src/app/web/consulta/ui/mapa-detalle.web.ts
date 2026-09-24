import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Pendiente } from '../../../core/models/pendiente.model';

/** MW4 y MW4b: mapa ilustrativo, sin geolocalización. */
@Component({
  selector: 'web-mapa-detalle',
  standalone: true,
  template: `
    <div class="mapa" role="img" [attr.aria-label]="pendiente.tipoUbicacion === 'categoria' ? 'Radio ilustrativo con lugares de la categoría' : 'Radio ilustrativo alrededor de la dirección seleccionada'">
      <img class="geocerco geocerco--area" src="assets/web/detalle-geocerco-area.svg" alt="" width="260" height="260" />
      <img class="geocerco geocerco--borde" src="assets/web/detalle-geocerco-borde.svg" alt="" width="260" height="260" />
      @if (pendiente.tipoUbicacion === 'categoria') {
        <img class="persona-categoria" src="assets/web/detalle-marcador-categoria-anillo.svg" alt="" width="28" height="28" />
        <span class="persona-etiqueta">TÚ</span>
        <img class="categoria-marca categoria-marca--1" src="assets/web/detalle-marcador-categoria-anillo.svg" alt="" width="28" height="28" />
        <img class="categoria-punto categoria-punto--1" src="assets/web/detalle-marcador-categoria-punto.svg" alt="" width="10" height="10" />
        <img class="categoria-marca categoria-marca--2" src="assets/web/detalle-marcador-categoria-anillo.svg" alt="" width="28" height="28" />
        <img class="categoria-punto categoria-punto--2" src="assets/web/detalle-marcador-categoria-punto.svg" alt="" width="10" height="10" />
        <img class="categoria-marca categoria-marca--3" src="assets/web/detalle-marcador-categoria-anillo.svg" alt="" width="28" height="28" />
        <img class="categoria-punto categoria-punto--3" src="assets/web/detalle-marcador-categoria-punto.svg" alt="" width="10" height="10" />
        <img class="punto-fondo punto-fondo--1" src="assets/web/detalle-marcador-fondo.svg" alt="" width="18" height="18" />
        <img class="punto-fondo punto-fondo--2" src="assets/web/detalle-marcador-fondo.svg" alt="" width="18" height="18" />
        <img class="punto-fondo punto-fondo--3" src="assets/web/detalle-marcador-fondo.svg" alt="" width="18" height="18" />
      } @else {
        <img class="direccion-marca" src="assets/web/detalle-marcador-direccion-anillo.svg" alt="" width="36" height="36" />
        <img class="direccion-punto" src="assets/web/detalle-marcador-direccion-punto.svg" alt="" width="14" height="14" />
        <span class="direccion-etiqueta">{{ direccionCorta }}</span>
        <img class="persona-direccion" src="assets/web/detalle-posicion-direccion-anillo.svg" alt="" width="22" height="22" />
        <img class="persona-direccion-punto" src="assets/web/detalle-posicion-direccion-punto.svg" alt="" width="10" height="10" />
        <span class="persona-direccion-etiqueta">TÚ</span>
      }
      <span class="radio-etiqueta">{{ pendiente.radioAviso >= 1000 ? '1 km' : pendiente.radioAviso + ' m' }}</span>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .mapa { position: relative; width: 100%; height: 22.875rem; overflow: hidden; border: 1px solid var(--ui-border); border-radius: var(--ui-radius-md); background: var(--ui-surface-sunken); }
    .mapa::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(to right, var(--ui-surface) 2px, transparent 2px), linear-gradient(to bottom, var(--ui-surface) 2px, transparent 2px); background-size: 4.5rem 100%, 100% 3.375rem; background-position: 1.4375rem 0, 0 0.9375rem; pointer-events: none; }
    img { position: absolute; display: block; max-width: none; transform: translate(-0.0625rem, -0.0625rem); }
    .geocerco { top: 3.5625rem; left: 7.5625rem; }
    .persona-categoria { top: 10.8125rem; left: 14.8125rem; }
    .persona-etiqueta { position: absolute; top: 12.8125rem; left: 15.125rem; }
    .categoria-marca--1 { top: 7.1875rem; left: 10.9375rem; }
    .categoria-punto--1 { top: 7.75rem; left: 11.5rem; }
    .categoria-marca--2 { top: 13.4375rem; left: 19.0625rem; }
    .categoria-punto--2 { top: 14rem; left: 19.625rem; }
    .categoria-marca--3 { top: 17.8125rem; left: 14.6875rem; }
    .categoria-punto--3 { top: 18.375rem; left: 15.25rem; }
    .punto-fondo--1 { top: 3.75rem; left: 3.125rem; }
    .punto-fondo--2 { top: 5rem; left: 26.875rem; }
    .punto-fondo--3 { top: 19.375rem; left: 27.5rem; }
    .direccion-marca { top: 10.5625rem; left: 14.5625rem; }
    .direccion-punto { top: 11.25rem; left: 15.25rem; }
    .direccion-etiqueta { position: absolute; top: 13.3125rem; left: 12.1875rem; max-width: 19rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .persona-direccion { top: 18.6875rem; left: 3.6875rem; }
    .persona-direccion-punto { top: 19.0625rem; left: 4.0625rem; }
    .persona-direccion-etiqueta { position: absolute; top: 20.4375rem; left: 3.9375rem; }
    .radio-etiqueta { position: absolute; top: 18.4375rem; left: 8.1875rem; }
    .persona-etiqueta, .direccion-etiqueta, .persona-direccion-etiqueta, .radio-etiqueta { transform: translate(-0.0625rem, -0.0625rem); font: 600 var(--ui-overline-size) / var(--ui-overline-line) var(--ui-font); letter-spacing: var(--ui-overline-track); color: var(--ui-text-secondary); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapaDetalleWebComponent {
  @Input({ required: true }) pendiente!: Pendiente;

  get direccionCorta(): string {
    return (this.pendiente.direccion ?? '').split(',')[0].trim();
  }
}
