import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { DIRECCIONES_MOCK } from '../../../core/mock/lugares.mock';
import { Lugar } from '../../../core/models/lugar.model';
import { RADIO_POR_DEFECTO, RadioAviso } from '../../../core/models/radio.model';

/** Buscador y elección de dirección de MM07/MM08/MM17b. */
@Component({
  selector: 'mob-direccion-selector',
  standalone: true,
  template: `
    <label class="busqueda">
      <span class="sr-only">Busca una dirección</span>
      <input type="search" class="busqueda__campo ui-body-lg" placeholder="Busca una dirección"
        [value]="consulta()" (input)="buscar($any($event.target).value)" />
    </label>

    @if (candidatos().length) {
      <p class="rotulo ui-overline">Cerca de donde estás</p>
      <div class="candidatos" role="radiogroup" aria-label="Direcciones encontradas">
        @for (lugar of candidatos(); track lugar.id) {
          <button class="candidato" type="button" role="radio"
            [attr.aria-checked]="direccion === lugar.direccion"
            [class.candidato--elegido]="direccion === lugar.direccion"
            (click)="seleccionar(lugar.direccion)">
            <span class="candidato__radio" aria-hidden="true"></span>
            <span class="candidato__texto"><span>{{ lugar.direccion }}</span>
              <small>{{ lugar.id === 'manual' ? 'Dirección ingresada' : lugar.nombre + ' · a ' + distancia(lugar.distanciaMetros) }}</small></span>
          </button>
        }
      </div>
      @if (direccionConocida()) {
      <div class="mapa mapa--seleccion" role="img" [attr.aria-label]="'Vista previa del radio de ' + radioTexto() + ' alrededor de la dirección elegida'">
        <span class="mapa__lienzo" aria-hidden="true">
          <img class="mapa__area" src="assets/mobile/crear/mapa-anillo-area.svg" alt="" width="112" height="112" />
          <img class="mapa__borde" src="assets/mobile/crear/mapa-anillo-borde.svg" alt="" width="112" height="112" />
          <img class="mapa__marcador" src="assets/mobile/crear/mapa-marcador-anillo.svg" alt="" width="28" height="28" />
          <img class="mapa__punto" src="assets/mobile/crear/mapa-marcador-punto.svg" alt="" width="10" height="10" />
          <span class="mapa__etiqueta ui-overline">{{ radioTexto() }}</span>
          <img class="mapa__yo" src="assets/mobile/crear/mapa-yo-anillo.svg" alt="" width="18" height="18" />
          <img class="mapa__yo-punto" src="assets/mobile/crear/mapa-yo-punto.svg" alt="" width="8" height="8" />
        </span>
      </div>
      } @else {
        <img class="mapa mapa--vacio" src="assets/mobile/crear/mapa-direccion-vacio.svg" alt="Mapa de ejemplo para buscar una dirección" />
      }
    } @else {
      <img class="mapa mapa--vacio" src="assets/mobile/crear/mapa-direccion-vacio.svg" alt="Mapa de ejemplo para buscar una dirección" />
      <p class="rotulo ui-overline">Cerca de donde estás</p>
      <p class="pista ui-body">Busca una dirección para elegirla en la lista.</p>
    }
  `,
  styles: [`
    .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
    .busqueda__campo { display: block; width: 100%; height: 3.5rem; padding: 0 var(--ui-space-5); border: 1px solid var(--ui-border);
      border-radius: var(--ui-radius-sm); background: var(--ui-surface); color: var(--ui-text-primary); }
    .busqueda__campo:not(:placeholder-shown), .busqueda__campo:focus { border: 2px solid var(--ui-brand); outline: none; }
    .rotulo { margin: 1.25rem 0 0.5rem; color: var(--ui-text-secondary); }
    .pista { margin: 0; color: var(--ui-text-disabled); }
    .candidatos { display: flex; flex-direction: column; gap: var(--ui-space-2); }
    .candidato { display: flex; align-items: center; gap: var(--ui-space-3); width: 100%; min-height: 3.75rem;
      padding: var(--ui-space-2) var(--ui-space-4); background: var(--ui-surface); border: 1px solid var(--ui-border);
      border-radius: var(--ui-radius-sm); text-align: left; color: var(--ui-text-primary); cursor: pointer; }
    .candidato--elegido { background: var(--ui-brand-subtle); border: 2px solid var(--ui-brand); }
    .candidato__radio { flex: none; width: 1.75rem; height: 1.75rem; border: 2px solid var(--ui-border-strong); border-radius: var(--ui-radius-pill); }
    .candidato--elegido .candidato__radio { border-color: var(--ui-brand); background: radial-gradient(circle, var(--ui-brand) 0 40%, transparent 41%); }
    .candidato__texto { display: flex; flex-direction: column; font: 500 var(--ui-field-size) / var(--ui-field-line) var(--ui-font); }
    small { font: 400 var(--ui-overline-size) / var(--ui-overline-line) var(--ui-font); color: var(--ui-text-secondary); }
    .mapa { display: block; width: 100%; object-fit: cover; border: 1px solid var(--ui-border); border-radius: 0.875rem; }
    .mapa--vacio { height: 12.5rem; margin-top: var(--ui-space-5); }
    .mapa--seleccion { position: relative; height: 11.25rem; margin-top: var(--ui-space-5); overflow: hidden;
      background-color: var(--ui-surface-sunken);
      background-image: repeating-linear-gradient(to right, var(--ui-surface) 0 2px, transparent 2px 66px),
        repeating-linear-gradient(to bottom, var(--ui-surface) 0 2px, transparent 2px 40px); }
    .mapa__lienzo { position: relative; display: block; width: 20rem; height: 11.25rem; margin: 0 auto; }
    .mapa__lienzo img { position: absolute; display: block; }
    .mapa__area, .mapa__borde { left: 6.5rem; top: 2.125rem; }
    .mapa__marcador { left: 9.125rem; top: 4.75rem; }
    .mapa__punto { left: 9.6875rem; top: 5.3125rem; }
    .mapa__etiqueta { position: absolute; left: 5.625rem; top: 7.75rem; color: var(--ui-text-secondary); }
    .mapa__yo { left: 1.5rem; top: 9.125rem; }
    .mapa__yo-punto { left: 1.8125rem; top: 9.4375rem; }
    .candidato:focus-visible, .busqueda__campo:focus-visible { outline: 2px solid var(--ui-brand); outline-offset: 2px; }
  `],
})
export class DireccionSelectorComponent {
  private _direccion: string | null = null;
  private escribiendo = false;
  @Input() set direccion(value: string | null) {
    this._direccion = value;
    if (!this.escribiendo) this.consulta.set(value ?? '');
  }
  get direccion(): string | null { return this._direccion; }
  @Input() radio: RadioAviso = RADIO_POR_DEFECTO;
  @Output() elegir = new EventEmitter<string | null>();
  readonly consulta = signal('');
  candidatos(): readonly Lugar[] {
    const q = this.consulta().trim().toLocaleLowerCase();
    const actuales = this.direccion && !this.direccionConocida()
      ? [{ id: 'manual', nombre: 'Dirección ingresada', direccion: this.direccion, distanciaMetros: 0 }]
      : [];
    if (!q) return this.direccion ? [...actuales, ...DIRECCIONES_MOCK.filter((l) => l.direccion === this.direccion)] : [];
    return [...actuales, ...DIRECCIONES_MOCK].filter((l) => l.direccion.toLocaleLowerCase().includes(q));
  }
  direccionConocida(): boolean { return DIRECCIONES_MOCK.some((l) => l.direccion === this.direccion); }
  buscar(texto: string): void {
    this.escribiendo = true;
    this.consulta.set(texto);
    this.elegir.emit(texto.trim() || null);
  }
  seleccionar(direccion: string): void {
    this.escribiendo = true;
    this.consulta.set(direccion);
    this.elegir.emit(direccion);
  }
  distancia(metros: number): string { return metros >= 1000 ? `${(metros / 1000).toFixed(1).replace('.', ',')} km` : `${metros} m`; }
  radioTexto(): string { return this.radio >= 1000 ? '1 km' : `${this.radio} m`; }
}
