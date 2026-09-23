import { Component, Input } from '@angular/core';

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
    `,
  ],
})
export class AnillosProximidadComponent {
  /** Lado en px. MM01 usa 304; MM03, 204. */
  @Input() tamano = 204;
}
