import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Campo de texto con su etiqueta encima.
 *
 * El texto que se escribe va a 19 px (`UI/Body/Large`), más grande que
 * el cuerpo de 17 px: es lo que hace el mockup MW2d y tiene sentido con
 * el público. La etiqueta va a 15 px `UI/Label/Field`.
 */
@Component({
  selector: 'ui-campo',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CampoComponent),
      multi: true,
    },
  ],
  template: `
    <label class="campo">
      <span class="ui-label-field">{{ etiqueta }}</span>
      <input
        class="campo__input ui-body-lg"
        [type]="tipo"
        [placeholder]="marcador"
        [disabled]="deshabilitado"
        [value]="valor"
        (input)="alEscribir($any($event.target).value)"
        (blur)="alTocar()"
      />
    </label>
  `,
  styles: [
    `
      .campo {
        display: flex;
        flex-direction: column;
        gap: var(--ui-campo-gap, var(--ui-space-2));
      }
      .campo__input {
        min-height: var(--ui-campo-alto, 3.75rem);
        padding: 0 var(--ui-campo-padding, var(--ui-space-6));
        background: var(--ui-surface);
        border: 1px solid var(--ui-border);
        border-radius: var(--ui-radius-sm);
        color: var(--ui-text-primary);
      }
      .campo__input::placeholder {
        color: var(--ui-text-disabled);
      }
      .campo__input:focus-visible {
        outline: 2px solid var(--ui-brand);
        outline-offset: 2px;
      }
      .campo__input:disabled {
        background: var(--ui-surface-sunken);
        color: var(--ui-text-disabled);
      }
    `,
  ],
})
export class CampoComponent implements ControlValueAccessor {
  @Input() etiqueta = '';
  @Input() marcador = '';
  @Input() tipo: 'text' | 'search' = 'text';
  @Input() deshabilitado = false;

  valor = '';

  private alCambiar: (v: string) => void = () => {};
  private alTocarCb: () => void = () => {};

  writeValue(v: string): void {
    this.valor = v ?? '';
  }
  registerOnChange(fn: (v: string) => void): void {
    this.alCambiar = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.alTocarCb = fn;
  }
  setDisabledState(deshabilitado: boolean): void {
    this.deshabilitado = deshabilitado;
  }

  alEscribir(v: string): void {
    this.valor = v;
    this.alCambiar(v);
  }
  alTocar(): void {
    this.alTocarCb();
  }
}
