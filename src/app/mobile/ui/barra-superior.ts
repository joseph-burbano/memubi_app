import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Barra superior de la app móvil.
 *
 * COMPARTIDA ENTRE LOS DOS FLUJOS de móvil (`crear/` y `consulta/`),
 * por eso vive en `mobile/ui/` y no dentro de un flujo. Cambiarla afecta
 * al otro: avisa antes.
 *
 * NO LLEVA la fila simulada de hora y señal que traen los mockups.
 * En Figma esa fila está porque un marco estático no tiene barra de
 * sistema; en el dispositivo Android la dibuja el sistema operativo y
 * quedaban dos, una encima de la otra.
 *
 * Quitarla es ser fiel a la intención del mockup, no apartarse de él: lo
 * que esa fila representa sigue estando, solo que lo pone Android. El
 * espacio lo reserva el sistema —ver la nota en los estilos— y el color
 * teal se lo pasa `AppComponent` al plugin StatusBar, leyéndolo del token.
 *
 * Por eso esta barra mide 56px y no los 104 del marco: los 48 que faltan
 * son la fila de sistema, que aquí no se dibuja.
 *
 * Es el tipo de cosa que solo se ve corriendo la app en el dispositivo,
 * que es exactamente para lo que existe un prototipo no funcional.
 *
 * DOS VARIANTES, no dos componentes:
 *   sin `titulo`  ->  logo + "MemUbi"           (MM01, MM03, MM12, MM21)
 *   con `titulo`  ->  flecha atrás + el título  (MM14, MM15, MM20b)
 *
 * Es la misma barra con el mismo alto y el mismo fondo; solo cambia qué
 * lleva dentro. Partirla en dos obligaría a mantener el alto, el color y
 * el comportamiento de la barra de sistema en dos sitios.
 */
@Component({
  selector: 'mob-barra-superior',
  standalone: true,
  template: `
    <header class="barra">
      @if (titulo) {
        <div class="barra__marca">
          <button
            class="barra__atras"
            type="button"
            aria-label="Volver"
            (click)="atras.emit()"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <h1 class="barra__titulo">{{ titulo }}</h1>
        </div>
      } @else {
        <div class="barra__marca">
          <span class="barra__logo" aria-hidden="true">
            <span class="barra__logo-anillo"></span>
            <span class="barra__logo-punto"></span>
          </span>
          <span class="barra__nombre">MemUbi</span>
        </div>
      }
    </header>
  `,
  styles: [
    `
      .barra {
        background: var(--ui-brand);
        color: var(--ui-text-inverse);
      }
      /* Android 15 fuerza edge-to-edge para apps con target 35. El inset
       * desplaza solo el contenido: el fondo teal continúa detrás de la
       * barra real del SO, sin recrear la hora ni la batería de Figma. */
      .barra__marca {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        height: calc(3.5rem + env(safe-area-inset-top, 0px));
        padding: env(safe-area-inset-top, 0px) 1.25rem 0;
        box-sizing: border-box;
      }
      .barra__logo {
        position: relative;
        width: 1.625rem;
        height: 1.625rem;
      }
      /* El concepto visual: el círculo del geofence. */
      .barra__logo-anillo {
        position: absolute;
        inset: 0;
        border: 2px solid var(--ui-text-inverse);
        border-radius: var(--ui-radius-pill);
      }
      .barra__logo-punto {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0.625rem;
        height: 0.625rem;
        transform: translate(-50%, -50%);
        background: var(--ui-action);
        border-radius: var(--ui-radius-pill);
      }
      .barra__nombre,
      .barra__titulo {
        margin: 0;
        font: 600 var(--ui-h3-size) / var(--ui-h3-line) var(--ui-font);
        letter-spacing: var(--ui-h3-track);
      }
      /* Objetivo táctil de 44px: la flecha dibujada es pequeña, pero el
       * área que responde al dedo no puede serlo. */
      .barra__atras {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.75rem;
        height: 2.75rem;
        margin-left: -0.75rem;
        background: none;
        border: none;
        color: inherit;
        font: 600 var(--ui-h2-size) / 1 var(--ui-font);
        cursor: pointer;
      }
      .barra__atras:focus-visible {
        outline: 2px solid var(--ui-text-inverse);
        outline-offset: -2px;
        border-radius: var(--ui-radius-sm);
      }
    `,
  ],
})
export class BarraSuperiorComponent {
  /** Sin título muestra la marca; con título, flecha atrás y el texto. */
  @Input() titulo = '';

  @Output() atras = new EventEmitter<void>();
}
