import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Cabecera compartida por MW6 y MW7. */
@Component({
  selector: 'web-cabecera-privacidad',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="cabecera">
      <div class="cabecera__interior">
        <a class="marca" routerLink="/pendientes" aria-label="MemUbi">
          <span class="marca__icono" aria-hidden="true">
            <img src="assets/web/logo-ring.svg" alt="" width="28" height="28" />
            <img src="assets/web/logo-dot.svg" alt="" width="10" height="10" />
          </span>
          <span class="marca__nombre">MemUbi</span>
        </a>
        <nav class="navegacion" aria-label="Navegación principal">
          <a routerLink="/pendientes">Mis pendientes</a>
          <a class="navegacion__activa" routerLink="/privacidad" aria-current="page">Privacidad</a>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .cabecera { height: 4.5rem; background: var(--ui-brand); color: var(--ui-text-inverse); }
    .cabecera__interior { display: flex; align-items: center; width: min(calc(100% - 12rem), 78rem); height: 100%; margin-inline: auto; }
    .marca, .navegacion a { color: inherit; text-decoration: none; }
    .marca { display: flex; align-items: center; gap: 0.75rem; flex: none; }
    .marca__icono { display: grid; place-items: center; position: relative; width: 1.75rem; height: 1.75rem; }
    .marca__icono img { position: absolute; display: block; }
    .marca__nombre { position: relative; top: 0.125rem; font: 600 var(--ui-h3-size) / var(--ui-h3-line) var(--ui-font); letter-spacing: var(--ui-h3-track); }
    .navegacion { display: flex; align-items: center; gap: 3.375rem; align-self: stretch; margin-left: 5rem; }
    .navegacion a { display: inline-flex; align-items: center; position: relative; top: 0.1875rem; font: 400 var(--ui-body-size) / var(--ui-body-line) var(--ui-font); white-space: nowrap; }
    .navegacion a.navegacion__activa { font-weight: 600; }
    .navegacion__activa::after { content: ''; position: absolute; bottom: -0.1875rem; left: 0; width: 5rem; height: 0.1875rem; border-radius: 0.125rem; background: currentColor; }
    a:focus-visible { outline: 2px solid var(--ui-text-inverse); outline-offset: 3px; }
    @media (max-width: 48rem) {
      .cabecera__interior { width: min(calc(100% - 2rem), 78rem); }
      .navegacion { gap: 1.25rem; margin-left: auto; }
      .navegacion a { font-size: var(--ui-caption-size); }
    }
    @media (max-width: 34rem) {
      .cabecera { height: auto; min-height: 4.5rem; }
      .cabecera__interior { flex-wrap: wrap; gap: 0.5rem 1rem; padding-block: 0.75rem; }
      .navegacion { width: 100%; height: 2rem; margin: 0; }
      .navegacion__activa::after { bottom: -0.125rem; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CabeceraPrivacidadWebComponent {}
