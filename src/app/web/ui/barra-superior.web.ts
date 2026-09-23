import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Barra superior de la aplicación web.
 *
 * COMPARTIDA ENTRE LOS DOS FLUJOS de web (`crear/` y `consulta/`), por
 * eso vive en `web/ui/` y no dentro de un flujo. Cambiarla afecta al
 * otro: avisa antes.
 *
 * NO ES LA DE MÓVIL, y no se unifican. Aquí hay navegación entre
 * secciones —"Mis pendientes" y "Privacidad"— porque en web el usuario
 * salta entre ellas; en móvil la barra solo lleva la marca y la
 * navegación vive abajo, al alcance del pulgar.
 *
 * Mide 72px, no los 56 de móvil.
 *
 * PENDIENTE DE UNIFICAR: `web/consulta/pages/lista.page.html` todavía
 * dibuja su propia cabecera en el HTML. Al cambiarla por este componente
 * desaparece esa copia. Es del bloque de consulta, así que lo hace su
 * dueño.
 */
@Component({
  selector: 'web-barra-superior',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="barra">
      <div class="barra__interior">
        <a class="marca" routerLink="/pendientes" aria-label="MemUbi">
          <span class="marca__logo" aria-hidden="true">
            <span class="marca__anillo"></span>
            <span class="marca__punto"></span>
          </span>
          <span class="marca__nombre">MemUbi</span>
        </a>

        <nav class="nav" aria-label="Navegación principal">
          <a
            class="nav__item"
            [class.nav__item--activo]="seccion === 'pendientes'"
            [attr.aria-current]="seccion === 'pendientes' ? 'page' : null"
            routerLink="/pendientes"
            >Mis pendientes</a
          >
          <a
            class="nav__item"
            [class.nav__item--activo]="seccion === 'privacidad'"
            [attr.aria-current]="seccion === 'privacidad' ? 'page' : null"
            routerLink="/privacidad"
            >Privacidad</a
          >
        </nav>
      </div>
    </header>
  `,
  styles: [
    `
      .barra {
        background: var(--ui-brand);
        color: var(--ui-text-inverse);
      }
      .barra__interior {
        display: flex;
        align-items: center;
        gap: 4.75rem;
        height: 4.5rem;
        padding: 0 6rem;
      }
      .marca {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: inherit;
        text-decoration: none;
      }
      .marca__logo {
        position: relative;
        width: 1.75rem;
        height: 1.75rem;
      }
      .marca__anillo {
        position: absolute;
        inset: 0;
        border: 2px solid var(--ui-text-inverse);
        border-radius: var(--ui-radius-pill);
      }
      .marca__punto {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0.625rem;
        height: 0.625rem;
        transform: translate(-50%, -50%);
        background: var(--ui-action);
        border-radius: var(--ui-radius-pill);
      }
      .marca__nombre {
        font: 600 var(--ui-h3-size) / var(--ui-h3-line) var(--ui-font);
        letter-spacing: var(--ui-h3-track);
      }
      .nav {
        display: flex;
        gap: 2.75rem;
      }
      .nav__item {
        position: relative;
        padding: 0.25rem 0;
        font: 400 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-text-inverse);
        text-decoration: none;
      }
      /* El subrayado es una barra de 3px con esquinas redondeadas, no un
       * text-decoration: así se despega del texto como en el mockup. */
      .nav__item--activo {
        font-weight: 600;
      }
      .nav__item--activo::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -0.25rem;
        height: 3px;
        background: var(--ui-text-inverse);
        border-radius: 2px;
      }
      .nav__item:focus-visible {
        outline: 2px solid var(--ui-text-inverse);
        outline-offset: 4px;
        border-radius: 4px;
      }
    `,
  ],
})
export class BarraSuperiorWebComponent {
  @Input() seccion: 'pendientes' | 'privacidad' = 'pendientes';
}
