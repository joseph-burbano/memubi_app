import { Component, Input, booleanAttribute } from '@angular/core';

/**
 * Botón del sistema.
 *
 * Tres variantes, y la tercera tiene una regla dura:
 *   primario    teal relleno
 *   secundario  blanco con borde teal
 *   accion      ÁMBAR · SOLO en la alerta de proximidad (MM20) y en la
 *               acción que la resuelve. Si el ámbar adorna, deja de avisar.
 *
 * NO le agregues un @Input() de plataforma. Si necesitas que se vea
 * distinto en web y en móvil, no es un botón: son dos componentes.
 */
@Component({
  selector: 'ui-boton',
  standalone: true,
  template: `
    <button
      class="boton ui-label-button"
      [class.boton--primario]="variante === 'primario'"
      [class.boton--secundario]="variante === 'secundario'"
      [class.boton--accion]="variante === 'accion'"
      [class.boton--ancho]="anchoCompleto"
      [disabled]="deshabilitado"
      [attr.aria-label]="etiquetaAccesible || null"
    >
      <ng-content />
    </button>
  `,
  styles: [
    `
      /* La altura y el ancho salen de custom properties para que cada
       * pantalla ajuste la medida de su mockup sin que el componente
       * sepa en qué plataforma está. El móvil usa el valor por defecto
       * (52px, MM20); la web pide 48px desde su propio scss (MW1).
       *
       * Es la forma de no terminar con un @Input() variante 'web'|'movil',
       * que sería la señal de que este componente en realidad son dos. */
      .boton {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--ui-space-3);
        min-height: var(--ui-boton-alto, 3.25rem);
        width: var(--ui-boton-ancho, auto);
        padding: 0 var(--ui-space-6);
        border-radius: var(--ui-radius-pill);
        border: none;
        white-space: nowrap;
        cursor: pointer;
      }
      .boton--ancho {
        width: 100%;
      }
      .boton--primario {
        background: var(--ui-brand);
        color: var(--ui-text-inverse);
      }
      .boton--secundario {
        background: var(--ui-surface);
        color: var(--ui-brand);
        border: 1.5px solid var(--ui-brand-border);
      }
      .boton--accion {
        background: var(--ui-action);
        color: var(--ui-text-on-action);
      }
      .boton:disabled {
        background: var(--ui-disabled);
        color: var(--ui-text-disabled);
        border-color: transparent;
        cursor: default;
      }
    `,
  ],
})
export class BotonComponent {
  @Input() variante: 'primario' | 'secundario' | 'accion' = 'primario';
  /* `booleanAttribute` permite escribir <ui-boton anchoCompleto> sin el
   * [x]="true". Un atributo suelto llega como cadena vacía, y sin esta
   * transformación el compilador de plantillas lo rechaza. */
  @Input({ transform: booleanAttribute }) deshabilitado = false;
  @Input({ transform: booleanAttribute }) anchoCompleto = false;
  @Input() etiquetaAccesible = '';
}
