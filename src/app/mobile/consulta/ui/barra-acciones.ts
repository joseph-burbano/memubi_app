import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BotonComponent } from '../../../ui/boton';

/**
 * Barra inferior de "Mis pendientes". Idéntica en `MM03` y `MM12`.
 *
 * Queda fija abajo porque en los dos marcos está al pie de la pantalla
 * y no se desplaza con la lista.
 *
 * El `padding-bottom` suma el inset del sistema: en un teléfono con
 * barra de gestos, sin eso los botones quedan debajo de ella. Se ve solo
 * en el dispositivo real, nunca en el navegador — que es justamente el
 * tipo de cosa que este prototipo existe para detectar.
 */
@Component({
  selector: 'mob-barra-acciones',
  standalone: true,
  imports: [BotonComponent, RouterLink],
  template: `
    <div class="acciones">
      <a class="acciones__enlace" routerLink="/configuracion">Configuración</a>
      <ui-boton class="acciones__nuevo" variante="primario" routerLink="/crear/que-y-donde">
        Nuevo pendiente
      </ui-boton>
    </div>
  `,
  styles: [
    `
      .acciones {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem 1.25rem;
        padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
        background: var(--ui-surface);
        border-top: 1px solid var(--ui-border);
      }
      .acciones__enlace {
        font: 600 var(--ui-button-size) / var(--ui-button-line) var(--ui-font);
        letter-spacing: var(--ui-button-track);
        color: var(--ui-brand);
        text-decoration: none;
        /* Objetivo táctil de 44px aunque el texto mida menos. */
        padding: 0.75rem 0;
      }
      .acciones__nuevo {
        --ui-boton-ancho: 12.5rem;
      }
    `,
  ],
})
export class BarraAccionesComponent {}
