import { Component, Input } from '@angular/core';
import { ChipComponent } from '../../../ui/chip';
import { Pendiente, describirUbicacion } from '../../../core/models/pendiente.model';

/**
 * Tarjeta de pendiente en móvil. `MM12`.
 *
 * NO ES LA MISMA QUE LA DE WEB, y no se unifican. En móvil el título va
 * a 17 px `Body/Strong`, la tarjeta se apila a 320 px de ancho y el chip
 * queda debajo del texto; en web el título sube a 21 px `Heading/3`, la
 * tarjeta es una fila de 1248 px y hay un enlace "Ver detalle" explícito.
 * Unificarlas es exactamente el error que costó un 5/10 en el módulo 5.
 *
 * La tarjeta ENTERA navega, y por eso es un `<button>` y no un `<div>`
 * con un click encima. Con adultos mayores —que suben el tamaño de letra
 * y a veces usan lector de pantalla— el elemento correcto no es un
 * detalle de estilo.
 *
 * La tarjeta NO muestra la distancia: no está en el mockup, y agregarla
 * sería inventar producto sin validarlo.
 */
@Component({
  selector: 'mob-pendiente-card',
  standalone: true,
  imports: [ChipComponent],
  template: `
    <button class="tarjeta" type="button">
      <span class="tarjeta__marca" aria-hidden="true">
        <span class="tarjeta__anillo"></span>
        <span class="tarjeta__punto"></span>
      </span>
      <span class="tarjeta__texto">
        <span class="tarjeta__titulo">{{ pendiente.titulo }}</span>
        <span class="tarjeta__lugar">{{ ubicacion }}</span>
        <span class="tarjeta__estado">
          <ui-chip [variante]="pendiente.estado === 'activo' ? 'activo' : 'apagado'">
            {{ pendiente.estado === 'activo' ? 'Activo' : 'Realizado' }}
          </ui-chip>
        </span>
      </span>
    </button>
  `,
  styles: [
    `
      .tarjeta {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        width: 100%;
        min-height: 7.75rem; /* 124px */
        padding: 1.25rem;
        background: var(--ui-surface);
        border: 1px solid var(--ui-border);
        border-radius: var(--ui-radius-md);
        text-align: left;
        cursor: pointer;
      }
      .tarjeta:focus-visible {
        outline: 2px solid var(--ui-brand);
        outline-offset: 2px;
      }
      .tarjeta__marca {
        position: relative;
        flex: none;
        width: 1.75rem;
        height: 1.75rem;
        margin-top: 1.5rem;
      }
      .tarjeta__anillo {
        position: absolute;
        inset: 0;
        border: 2px solid var(--ui-brand-border);
        border-radius: var(--ui-radius-pill);
      }
      .tarjeta__punto {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0.75rem;
        height: 0.75rem;
        transform: translate(-50%, -50%);
        background: var(--ui-brand);
        border-radius: var(--ui-radius-pill);
      }
      .tarjeta__texto {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width: 0;
      }
      .tarjeta__titulo {
        font: 600 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-text-primary);
      }
      .tarjeta__lugar {
        font: 400 var(--ui-caption-size) / var(--ui-caption-line) var(--ui-font);
        letter-spacing: var(--ui-caption-track);
        color: var(--ui-text-secondary);
      }
      .tarjeta__estado {
        margin-top: 0.125rem;
      }
    `,
  ],
})
export class PendienteCardMobileComponent {
  @Input({ required: true }) pendiente!: Pendiente;

  get ubicacion(): string {
    return describirUbicacion(this.pendiente);
  }
}
