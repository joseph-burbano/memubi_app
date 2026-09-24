import { Component, EventEmitter, Input, Output, booleanAttribute } from '@angular/core';
import { BarraSuperiorComponent } from '../../ui/barra-superior';
import { BotonComponent } from '../../../ui/boton';

/** Marco común del asistente móvil: cabecera y acciones fijas, contenido desplazable. */
@Component({
  selector: 'mob-paso-shell',
  standalone: true,
  imports: [BarraSuperiorComponent, BotonComponent],
  template: `
    <div class="pantalla">
      <mob-barra-superior [titulo]="titulo" (atras)="volver.emit()" />
      <main class="contenido"><ng-content /></main>
      <footer class="acciones">
        <button class="acciones__volver ui-label-button" type="button" (click)="volver.emit()">
          {{ textoVolver }}
        </button>
        <ui-boton class="acciones__siguiente" [deshabilitado]="deshabilitado" (click)="siguiente.emit()">
          {{ textoSiguiente }}
        </ui-boton>
      </footer>
    </div>
  `,
  styles: [`
    .pantalla { display: flex; flex-direction: column; height: 100dvh; background: transparent; }
    .contenido { flex: 1; min-height: 0; overflow-y: auto; padding: 1.5rem 1.25rem 1.25rem; }
    .acciones { display: flex; align-items: center; justify-content: space-between; gap: 1rem;
      min-height: 8.75rem; padding: 1rem 1.25rem calc(1rem + env(safe-area-inset-bottom, 0px));
      background: var(--ui-surface); border-top: 1px solid var(--ui-border); }
    .acciones__volver { min-width: 2.75rem; min-height: 2.75rem; padding: 0; background: none;
      border: 0; color: var(--ui-brand); text-align: left; cursor: pointer; }
    .acciones__siguiente { --ui-boton-ancho: 10rem; }
    .acciones__volver:focus-visible { outline: 2px solid var(--ui-brand); outline-offset: 2px; }
  `],
})
export class PasoShellComponent {
  @Input() titulo = 'Nuevo pendiente';
  @Input() textoVolver = 'Volver';
  @Input() textoSiguiente = 'Siguiente';
  @Input({ transform: booleanAttribute }) deshabilitado = false;
  @Output() volver = new EventEmitter<void>();
  @Output() siguiente = new EventEmitter<void>();
}
