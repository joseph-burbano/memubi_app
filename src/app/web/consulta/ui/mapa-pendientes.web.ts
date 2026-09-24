import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pendiente, describirUbicacion } from '../../../core/models/pendiente.model';

/** MW1b: mapa y panel de la consulta web. La ubicación es ilustrativa. */
@Component({
  selector: 'web-mapa-pendientes',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="vista-mapa" [class.vista-mapa--vacio]="pendientes.length === 0" aria-label="Pendientes en el mapa">
      <div class="mapa" role="group" aria-label="Mapa ilustrativo con tu posición y los pendientes">
          @if (pendientes.length === 0) {
          <img class="vacio-anillo vacio-anillo--exterior" src="assets/web/mapa-anillo-384.svg" alt="" width="384" height="384" />
          <img class="vacio-anillo vacio-anillo--medio" src="assets/web/mapa-anillo-256.svg" alt="" width="256" height="256" />
          <img class="vacio-anillo vacio-anillo--interior" src="assets/web/mapa-anillo-128.svg" alt="" width="128" height="128" />
          <img class="vacio-punto" src="assets/web/empty-dot.svg" alt="" width="22" height="22" />
          <span class="vacio-etiqueta">TÚ</span>
        } @else {
        <img class="anillo anillo--exterior" src="assets/web/mapa-anillo-384.svg" alt="" width="384" height="384" />
        <img class="anillo anillo--medio" src="assets/web/mapa-anillo-256.svg" alt="" width="256" height="256" />
        <img class="anillo anillo--interior" src="assets/web/mapa-anillo-128.svg" alt="" width="128" height="128" />
        <img class="posicion" src="assets/web/empty-dot.svg" alt="" width="22" height="22" />
        <span class="posicion-etiqueta">TÚ</span>

        <img class="punto-fondo punto-fondo--1" src="assets/web/mapa-punto-fondo.svg" alt="" width="16" height="16" />
        <img class="punto-fondo punto-fondo--2" src="assets/web/mapa-punto-fondo.svg" alt="" width="16" height="16" />
        <img class="punto-fondo punto-fondo--3" src="assets/web/mapa-punto-fondo.svg" alt="" width="16" height="16" />
        <img class="punto-fondo punto-fondo--4" src="assets/web/mapa-punto-fondo.svg" alt="" width="16" height="16" />
        <img class="punto-fondo punto-fondo--5" src="assets/web/mapa-punto-fondo.svg" alt="" width="16" height="16" />
        <img class="punto-fondo punto-fondo--6" src="assets/web/mapa-punto-fondo.svg" alt="" width="16" height="16" />

        @for (pendiente of pendientes.slice(0, 3); track pendiente.id) {
          <a class="marcador"
             [class.marcador--1]="$index === 0"
             [class.marcador--2]="$index === 1"
             [class.marcador--3]="$index === 2"
             [routerLink]="['/pendientes', pendiente.id]"
             [attr.aria-label]="'Ver detalle de ' + pendiente.titulo">
            @if (cercanos.has(pendiente.id)) {
              <img class="marcador__cerca-exterior" src="assets/web/mapa-cerca-anillo-48.svg" alt="" width="48" height="48" />
              <img class="marcador__cerca-interior" src="assets/web/mapa-cerca-anillo-28.svg" alt="" width="28" height="28" />
              <img class="marcador__cerca-punto" src="assets/web/mapa-cerca-punto-8.svg" alt="" width="8" height="8" />
            } @else {
              <img class="marcador__anillo" src="assets/web/mapa-pendiente-anillo-28.svg" alt="" width="28" height="28" />
              <img class="marcador__punto" src="assets/web/mapa-pendiente-punto-10.svg" alt="" width="10" height="10" />
            }
          </a>
        }
        }
      </div>

      <aside class="panel" aria-labelledby="mapa-panel-titulo">
        <h2 id="mapa-panel-titulo">Cerca de ti</h2>
        @if (pendientes.length === 0) {
          <p class="panel__vacio">Cuando crees un pendiente, el lugar donde se activa aparecerá aquí y sobre el mapa.</p>
          <div class="panel__ilustracion" aria-hidden="true">
            <img src="assets/web/mapa-vacio-anillo-156.svg" alt="" width="156" height="156" />
            <img src="assets/web/mapa-vacio-anillo-104.svg" alt="" width="104" height="104" />
            <img src="assets/web/mapa-vacio-anillo-52.svg" alt="" width="52" height="52" />
            <img src="assets/web/mapa-vacio-punto-18.svg" alt="" width="18" height="18" />
          </div>
        } @else {
        <div class="panel__lista">
          @for (pendiente of pendientes; track pendiente.id) {
            <a class="panel__item" [routerLink]="['/pendientes', pendiente.id]">
              <img class="panel__leyenda"
                   [src]="cercanos.has(pendiente.id) ? 'assets/web/mapa-cerca-leyenda.svg' : 'assets/web/pendiente-dot.svg'"
                   alt="" width="16" height="16" />
              <span class="panel__titulo">{{ pendiente.titulo }}</span>
              <span class="panel__ubicacion">{{ describirUbicacion(pendiente) }}</span>
              @if (cercanos.has(pendiente.id)) {
                <span class="panel__chip">Cerca</span>
              }
            </a>
          }
        </div>
        }
      </aside>
    </section>
  `,
  styles: [
    `
      :host { display: block; margin-top: 2.25rem; }
      .vista-mapa { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: 1.5rem; }
      .mapa, .panel { height: 32.5rem; border: 1px solid var(--ui-border); border-radius: var(--ui-radius-md); }
      .mapa {
        position: relative; overflow: hidden; border: 0;
        box-shadow: inset 0 0 0 1px var(--ui-border);
        background: var(--ui-surface-sunken);
      }
      .vacio-anillo--exterior { left: 8.5625rem; top: 3.5625rem; }
      .vacio-anillo--medio { left: 12.5625rem; top: 7.5625rem; }
      .vacio-anillo--interior { left: 16.5625rem; top: 11.5625rem; }
      .vacio-punto { left: 19.875rem; top: 14.875rem; }
      .vacio-etiqueta { position: absolute; left: 19.9375rem; top: 16.6875rem; font: 600 var(--ui-overline-size) / var(--ui-overline-line) var(--ui-font); letter-spacing: var(--ui-overline-track); color: var(--ui-text-secondary); }
      .mapa::before {
        content: ''; position: absolute; inset: 0;
        background-image: linear-gradient(to right, var(--ui-surface) 2px, transparent 2px),
          linear-gradient(to bottom, var(--ui-surface) 2px, transparent 2px);
        background-size: 5.25rem 100%, 100% 3.875rem;
        background-position: 1.8125rem 0, 0 1.1875rem;
        pointer-events: none;
      }
      .mapa img { display: block; position: absolute; max-width: none; }
      .anillo--exterior { left: 8.5625rem; top: 3.5625rem; }
      .anillo--medio { left: 12.5625rem; top: 7.5625rem; }
      .anillo--interior { left: 16.5625rem; top: 11.5625rem; }
      .posicion { left: 19.875rem; top: 14.875rem; }
      .posicion-etiqueta {
        position: absolute; left: 19.9375rem; top: 16.6875rem;
        font: 600 var(--ui-overline-size) / var(--ui-overline-line) var(--ui-font);
        letter-spacing: var(--ui-overline-track); color: var(--ui-text-secondary);
      }
      .punto-fondo--1 { left: 8.8125rem; top: 6.9375rem; }
      .punto-fondo--2 { left: 31.9375rem; top: 5.0625rem; }
      .punto-fondo--3 { left: 37.5625rem; top: 20.0625rem; }
      .punto-fondo--4 { left: 10.6875rem; top: 26.3125rem; }
      .punto-fondo--5 { left: 28.1875rem; top: 28.1875rem; }
      .punto-fondo--6 { left: 43.1875rem; top: 10.6875rem; }
      .marcador { position: absolute; display: block; width: 3rem; height: 3rem; border-radius: 50%; }
      .marcador--1 { left: 16.5625rem; top: 10.3125rem; }
      .marcador--2 { left: 25.9375rem; top: 21.5625rem; }
      .marcador--3 { left: 37.1875rem; top: 25.3125rem; }
      .marcador img { position: absolute; }
      .marcador__cerca-exterior { left: 0; top: 0; }
      .marcador__cerca-interior, .marcador__anillo { left: 0.625rem; top: 0.625rem; }
      .marcador__cerca-punto { left: 1.25rem; top: 1.25rem; }
      .marcador__punto { left: 1.1875rem; top: 1.1875rem; }
      .marcador:focus-visible, .panel__item:focus-visible { outline: 2px solid var(--ui-brand); outline-offset: 3px; }
      .panel { overflow: auto; background: var(--ui-surface); padding: 1.6875rem 1.9375rem; }
      .panel h2 {
        margin: 0; font: 600 var(--ui-h3-size) / var(--ui-h3-line) var(--ui-font);
        letter-spacing: var(--ui-h3-track); color: var(--ui-text-primary);
      }
      .panel__lista { margin-top: 0.625rem; }
      .panel__vacio { margin-top: 1.125rem; color: var(--ui-text-secondary); font: 400 var(--ui-body-size) / var(--ui-body-line) var(--ui-font); }
      .panel__ilustracion { position: relative; width: 9.75rem; height: 9.75rem; margin: 2.25rem auto 0; }
      .panel__ilustracion img { position: absolute; top: 50%; left: 50%; display: block; max-width: none; transform: translate(-50%, -50%); }
      .panel__item {
        position: relative; display: block; height: 8.125rem; padding: 0.875rem 0 0 1.75rem;
        color: inherit; text-decoration: none;
      }
      .panel__item:not(:last-child)::after {
        content: ''; position: absolute; left: 0; right: 0; bottom: 0.625rem;
        height: 1px; background: var(--ui-border);
      }
      .panel__leyenda { position: absolute; left: 0; top: 1rem; display: block; }
      .panel__titulo, .panel__ubicacion { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .panel__titulo { font: 600 var(--ui-body-size) / var(--ui-body-line) var(--ui-font); }
      .panel__ubicacion {
        font: 400 var(--ui-caption-size) / var(--ui-caption-line) var(--ui-font);
        letter-spacing: var(--ui-caption-track); color: var(--ui-text-secondary);
      }
      .panel__chip {
        display: inline-flex; align-items: center; justify-content: center;
        width: 6.5rem; height: 1.875rem; margin-top: 0.625rem;
        border: 1.5px solid var(--ui-action); border-radius: var(--ui-radius-pill);
        background: var(--ui-action-subtle); color: var(--ui-text-on-action);
        font: 500 var(--ui-field-size) / var(--ui-field-line) var(--ui-font);
        letter-spacing: var(--ui-field-track);
      }
      @media (max-width: 72rem) {
        .vista-mapa { grid-template-columns: minmax(0, 1fr); }
        .panel { height: auto; min-height: 20rem; }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapaPendientesWebComponent {
  @Input({ required: true }) pendientes: readonly Pendiente[] = [];
  @Input({ required: true }) cercanos: ReadonlySet<string> = new Set();

  readonly describirUbicacion = describirUbicacion;
}