import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

/** MW1e: aviso de confirmación al volver de crear un pendiente web. */
@Component({
  selector: 'web-aviso-guardado',
  standalone: true,
  template: `
    <aside class="aviso" role="status" aria-label="Pendiente guardado">
      <span class="aviso__marca" aria-hidden="true">
        <img src="assets/web/aviso-guardado-ring.svg" alt="" width="24" height="24" />
        <img src="assets/web/aviso-guardado-dot.svg" alt="" width="10" height="10" />
      </span>
      <strong class="aviso__titulo">Pendiente guardado</strong>
      <span class="aviso__mensaje">Ya está activo. Te avisaremos cuando pases cerca.</span>
      <button type="button" class="aviso__cerrar" (click)="cerrar.emit()">Cerrar</button>
    </aside>
  `,
  styles: [
    `
      :host {
        position: fixed;
        z-index: 10;
        left: max(6rem, calc(50vw - 39rem));
        bottom: 4.25rem;
        display: block;
        width: 35rem;
        height: 4.5rem;
      }
      .aviso {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: var(--ui-radius-md);
        background: var(--ui-brand);
        color: var(--ui-text-inverse);
        font-family: var(--ui-font);
      }
      .aviso__marca img { position: absolute; display: block; max-width: none; }
      .aviso__marca img:first-child { left: 2rem; top: 1.5rem; }
      .aviso__marca img:last-child { left: 2.4375rem; top: 1.9375rem; }
      .aviso__titulo {
        position: absolute;
        left: 4.75rem;
        top: 1.375rem;
        font: 600 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
      }
      .aviso__mensaje {
        position: absolute;
        left: 4.75rem;
        top: 2.875rem;
        font: 400 var(--ui-caption-size) / var(--ui-caption-line) var(--ui-font);
        letter-spacing: var(--ui-caption-track);
        white-space: nowrap;
      }
      .aviso__cerrar {
        position: absolute;
        left: 29.375rem;
        top: 1rem;
        width: 5.75rem;
        height: 2.125rem;
        padding: 0 0 0 0.875rem;
        border: 0;
        border-radius: var(--ui-radius-sm);
        background: transparent;
        color: var(--ui-text-inverse);
        font: 500 var(--ui-field-size) / var(--ui-field-line) var(--ui-font);
        letter-spacing: var(--ui-field-track);
        text-align: left;
        cursor: pointer;
      }
      .aviso__cerrar:focus-visible { outline: 2px solid var(--ui-text-inverse); outline-offset: 2px; }
      @media (max-width: 48rem) {
        :host { left: 1rem; bottom: 1.5rem; max-width: calc(100vw - 2rem); }
      }
      @media (max-width: 36rem) {
        :host { height: 6rem; }
        .aviso__titulo { top: 1rem; }
        .aviso__mensaje { top: 2.75rem; right: 1rem; white-space: normal; }
        .aviso__cerrar { left: auto; right: 0.5rem; top: 0.625rem; }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvisoGuardadoWebComponent {
  @Output() cerrar = new EventEmitter<void>();
}
