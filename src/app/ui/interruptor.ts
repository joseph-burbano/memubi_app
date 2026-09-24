import { Component, EventEmitter, Input, Output, booleanAttribute } from '@angular/core';

/**
 * Interruptor del sistema. `MM24` encendido, `MM24b` apagado.
 *
 * Va en `ui/` y no dentro de un flujo porque es un control genérico: si
 * aparece otro ajuste, reusa este.
 *
 * Es un `<button role="switch">` y no un `<div>` con click: el lector de
 * pantalla anuncia "activado/desactivado" solo, y responde a la barra
 * espaciadora sin código extra. Con este público no es un detalle.
 *
 * El apagado usa `surface-sunken` con borde, no un gris plano: así se
 * distingue de un control deshabilitado, que es otra cosa.
 */
@Component({
  selector: 'ui-interruptor',
  standalone: true,
  template: `
    <button
      class="interruptor"
      type="button"
      role="switch"
      [attr.aria-checked]="activo"
      [attr.aria-label]="etiqueta || null"
      (click)="cambiar.emit(!activo)"
    >
      <span class="interruptor__pista" [class.interruptor__pista--on]="activo">
        <span class="interruptor__pomo"></span>
      </span>
    </button>
  `,
  styles: [
    `
      .interruptor {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        /* Objetivo táctil de 44px aunque la pista mida 52x32. */
        min-width: 2.75rem;
        min-height: 2.75rem;
        padding: 0;
        background: none;
        border: none;
        cursor: pointer;
      }
      .interruptor__pista {
        position: relative;
        width: 3.25rem;
        height: 2rem;
        background: var(--ui-surface-sunken);
        border: 1px solid var(--ui-border);
        border-radius: var(--ui-radius-pill);
        transition: background 0.15s ease;
      }
      .interruptor__pista--on {
        background: var(--ui-brand);
        border-color: var(--ui-brand);
      }
      .interruptor__pomo {
        position: absolute;
        top: 50%;
        left: 0.1875rem;
        width: 1.5rem;
        height: 1.5rem;
        transform: translateY(-50%);
        background: var(--ui-surface);
        border: 1px solid var(--ui-border);
        border-radius: var(--ui-radius-pill);
        transition: left 0.15s ease;
      }
      .interruptor__pista--on .interruptor__pomo {
        left: calc(100% - 1.6875rem);
        border-color: transparent;
      }
      .interruptor:focus-visible .interruptor__pista {
        outline: 2px solid var(--ui-brand);
        outline-offset: 2px;
      }
    `,
  ],
})
export class InterruptorComponent {
  @Input({ transform: booleanAttribute }) activo = false;
  @Input() etiqueta = '';

  @Output() cambiar = new EventEmitter<boolean>();
}
