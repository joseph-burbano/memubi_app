import { Component } from '@angular/core';

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
 */
@Component({
  selector: 'mob-barra-superior',
  standalone: true,
  template: `
    <header class="barra">
      <div class="barra__marca">
        <span class="barra__logo" aria-hidden="true">
          <span class="barra__logo-anillo"></span>
          <span class="barra__logo-punto"></span>
        </span>
        <span class="barra__nombre">MemUbi</span>
      </div>
    </header>
  `,
  styles: [
    `
      /* SIN padding de safe-area a propósito.
       *
       * StatusBar.setOverlaysWebView({ overlay: false }) hace que
       * Android reserve el alto de su barra POR FUERA del WebView. Si
       * además sumáramos env(safe-area-inset-top), el espacio se contaría
       * dos veces y aparecería una banda teal vacía entre el reloj del
       * sistema y el nombre de la app.
       *
       * Si alguna vez se pasa a overlay: true, hay que volver a poner el
       * padding — pero entonces sobra la reserva de Android. Es uno o el
       * otro, nunca los dos. */
      .barra {
        background: var(--ui-brand);
        color: var(--ui-text-inverse);
      }
      /* 56px = los 104 del marco menos los 48 de la barra de sistema
       * simulada, que en el dispositivo la pone Android. */
      .barra__marca {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        height: 3.5rem;
        padding: 0 1.25rem;
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
      .barra__nombre {
        font: 600 var(--ui-h3-size) / var(--ui-h3-line) var(--ui-font);
        letter-spacing: var(--ui-h3-track);
      }
    `,
  ],
})
export class BarraSuperiorComponent {}
