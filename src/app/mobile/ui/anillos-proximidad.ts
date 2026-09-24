import { Component, Input, booleanAttribute } from '@angular/core';

/**
 * Los anillos concéntricos del concepto visual.
 *
 * MemUbi → cercanía → el círculo del geofence. Aparecen en `MM01` como
 * ilustración grande y en `MM03` dentro de la tarjeta del estado vacío.
 *
 * Va en SVG inline y no como archivo de assets porque son cuatro
 * círculos: dibujarlos aquí los deja escalar con el tamaño que pida cada
 * pantalla y evita cuatro peticiones de red en el arranque de la app.
 *
 * COMPARTIDO ENTRE LOS DOS FLUJOS de móvil.
 */
@Component({
  selector: 'mob-anillos-proximidad',
  standalone: true,
  template: `
    <svg
      class="anillos"
      [class.anillos--apagado]="apagado"
      [class.anillos--alerta]="alerta"
      viewBox="0 0 200 200"
      [attr.width]="tamano"
      [attr.height]="tamano"
      role="presentation"
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="99" />
      <circle cx="100" cy="100" r="74" />
      <circle cx="100" cy="100" r="49" />
      <circle class="anillos__centro" cx="100" cy="100" r="9" />
    </svg>
  `,
  styles: [
    `
      .anillos {
        display: block;
      }
      .anillos circle {
        fill: none;
        stroke: var(--ui-brand-border);
        stroke-width: 1.5;
      }
      /* El punto es el usuario: relleno, sin borde. */
      .anillos__centro {
        fill: var(--ui-brand);
        stroke: none;
      }
      /* MM02: sin permiso de ubicación no hay señal, y los anillos se
       * apagan. El concepto visual cuenta el estado, no solo decora. */
      .anillos--apagado circle {
        stroke: var(--ui-border);
      }
      .anillos--apagado .anillos__centro {
        fill: var(--ui-border-strong);
      }
      /* MM20: dentro de la tarjeta de alerta los anillos son ámbar. El
       * teal ahí dentro se lee como un elemento ajeno. */
      .anillos--alerta circle {
        stroke: var(--ui-action);
      }
      .anillos--alerta .anillos__centro {
        fill: var(--ui-action);
      }
    `,
  ],
})
export class AnillosProximidadComponent {
  /** Lado en px. MM01 usa 304; MM03 y MM21, 204; la alerta, 120. */
  @Input() tamano = 204;

  /** En gris, para cuando la ubicación está desactivada (MM02). */
  @Input({ transform: booleanAttribute }) apagado = false;

  /** En ámbar, dentro de la tarjeta de alerta (MM20). */
  @Input({ transform: booleanAttribute }) alerta = false;
}
