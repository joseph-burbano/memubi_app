import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Pendiente, describirUbicacion } from '../../../core/models/pendiente.model';
import { ChipComponent } from '../../../ui/chip';

/** MW1: tarjeta web; la disposición y la navegación difieren de MM12. */
@Component({
  selector: 'web-pendiente-card',
  standalone: true,
  imports: [RouterLink, ChipComponent],
  template: `
    <article class="tarjeta">
      <span class="tarjeta__marca" aria-hidden="true">
        <img src="assets/web/pendiente-ring.svg" alt="" width="40" height="40" />
        <img src="assets/web/pendiente-dot.svg" alt="" width="16" height="16" />
      </span>

      <div class="tarjeta__contenido">
        <h2 class="tarjeta__titulo">{{ pendiente.titulo }}</h2>
        <p class="tarjeta__ubicacion">{{ describirUbicacion(pendiente) }}</p>
      </div>

      <a class="tarjeta__detalle" [routerLink]="['/pendientes', pendiente.id]">
        Ver detalle
      </a>
      <ui-chip class="tarjeta__estado">Activo</ui-chip>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .tarjeta {
        display: grid;
        grid-template-columns: 2.5rem minmax(0, 1fr) 6rem 7.5rem;
        align-items: center;
        column-gap: 1.5rem;
        width: 100%;
        min-height: 6rem;
        padding: 0 4.625rem 0 2rem;
        border: 1px solid var(--ui-border);
        border-radius: var(--ui-radius-md);
        background: var(--ui-surface);
      }
      .tarjeta__marca {
        position: relative;
        width: 2.5rem;
        height: 2.5rem;
      }
      .tarjeta__marca img {
        position: absolute;
        display: block;
      }
      .tarjeta__marca img:first-child {
        inset: 0;
      }
      .tarjeta__marca img:last-child {
        top: 0.75rem;
        left: 0.75rem;
      }
      .tarjeta__contenido {
        min-width: 0;
      }
      .tarjeta__titulo,
      .tarjeta__ubicacion {
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .tarjeta__titulo {
        font: 600 var(--ui-h3-size) / var(--ui-h3-line) var(--ui-font);
        letter-spacing: var(--ui-h3-track);
        color: var(--ui-text-primary);
      }
      .tarjeta__ubicacion {
        margin-top: 0.125rem;
        font: 400 var(--ui-caption-size) / var(--ui-caption-line) var(--ui-font);
        letter-spacing: var(--ui-caption-track);
        color: var(--ui-text-secondary);
      }
      .tarjeta__detalle {
        font: 500 var(--ui-field-size) / var(--ui-field-line) var(--ui-font);
        letter-spacing: var(--ui-field-track);
        color: var(--ui-text-link);
        text-decoration: none;
        white-space: nowrap;
      }
      .tarjeta__detalle:focus-visible {
        outline: 2px solid var(--ui-brand);
        outline-offset: 3px;
      }
      .tarjeta__estado {
        display: block;
        width: 7.5rem;
      }
      .tarjeta__estado ::ng-deep .chip {
        justify-content: center;
        width: 7.5rem;
        min-height: 2rem;
        padding: 0;
        border-width: 1.5px;
        font: 500 var(--ui-field-size) / var(--ui-field-line) var(--ui-font);
        letter-spacing: var(--ui-field-track);
        text-transform: none;
      }
      @media (max-width: 48rem) {
        .tarjeta {
          grid-template-columns: 2.5rem minmax(0, 1fr) auto;
          row-gap: 0.75rem;
          padding: 1rem;
        }
        .tarjeta__detalle {
          grid-column: 2;
        }
        .tarjeta__estado {
          grid-column: 3;
          grid-row: 1 / 3;
        }
      }
    `,
  ],
})
export class PendienteCardWebComponent {
  @Input({ required: true }) pendiente!: Pendiente;

  readonly describirUbicacion = describirUbicacion;
}
