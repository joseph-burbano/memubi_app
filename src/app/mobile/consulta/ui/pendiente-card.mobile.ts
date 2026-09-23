import { Component, EventEmitter, Input, Output } from '@angular/core';
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
 *
 * PULSACIÓN LARGA = DISPARA LA ALERTA de ese pendiente.
 *
 * Es el disparador de la demo. En el producto real la alerta la lanza
 * una geocerca registrada en el sistema operativo; aquí no hay GPS, así
 * que hacía falta una forma de entrar al flujo.
 *
 * Se eligió mantener pulsado, y no un botón, porque NO AGREGA UN SOLO
 * PÍXEL a la pantalla: el mockup se respeta al milímetro y el recorrido
 * se puede demostrar con el dedo. Un elemento visible habría sido
 * inventar interfaz que el diseño no tiene.
 *
 * Al sustentar conviene decirlo así: es un atajo de demostración, no una
 * función del producto.
 */
@Component({
  selector: 'mob-pendiente-card',
  standalone: true,
  imports: [ChipComponent],
  template: `
    <button
      class="tarjeta"
      type="button"
      [class.tarjeta--completado]="completado"
      (click)="alSoltarClick()"
      (pointerdown)="iniciarPulsacion()"
      (pointerup)="cancelarPulsacion()"
      (pointerleave)="cancelarPulsacion()"
      (pointercancel)="cancelarPulsacion()"
      (contextmenu)="$event.preventDefault()"
    >
      <span class="tarjeta__marca" aria-hidden="true">
        <span class="tarjeta__anillo"></span>
        <span class="tarjeta__punto"></span>
      </span>
      <span class="tarjeta__texto">
        <span class="tarjeta__titulo">{{ pendiente.titulo }}</span>
        <span class="tarjeta__lugar">{{ ubicacion }}</span>
        <span class="tarjeta__estado">
          <ui-chip [variante]="completado ? 'apagado' : 'activo'">
            {{ completado ? 'Completado' : 'Activo' }}
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
        /* Sin esto, mantener pulsado en Android abre el menú de
         * selección de texto en vez de disparar la alerta. */
        user-select: none;
        -webkit-user-select: none;
        -webkit-touch-callout: none;
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

      /* MM13. El tachado es lo que comunica "ya está hecho"; el gris
       * solo lo acompaña. Con el color solo, alguien que no distingue
       * bien los grises no vería la diferencia. */
      .tarjeta--completado .tarjeta__titulo {
        color: var(--ui-text-disabled);
        text-decoration: line-through;
      }
      .tarjeta--completado .tarjeta__lugar {
        color: var(--ui-text-disabled);
      }
      .tarjeta--completado .tarjeta__anillo {
        border-color: var(--ui-border-strong);
      }
      .tarjeta--completado .tarjeta__punto {
        background: var(--ui-border-strong);
      }
    `,
  ],
})
export class PendienteCardMobileComponent {
  @Input({ required: true }) pendiente!: Pendiente;

  /** La tarjeta entera navega al detalle: MM12 -> MM14 / MM15. */
  @Output() abrir = new EventEmitter<string>();

  /** Pulsación larga: dispara la alerta de este pendiente (demo). */
  @Output() dispararAlerta = new EventEmitter<string>();

  private temporizador?: ReturnType<typeof setTimeout>;
  private fueLarga = false;

  iniciarPulsacion(): void {
    // Un pendiente ya completado NO vuelve a avisar. Sin este guardia,
    // mantenerlo pulsado abría su alerta y desde ahí se podía marcar de
    // nuevo, que es como revivirlo.
    if (this.completado) return;

    this.fueLarga = false;
    this.temporizador = setTimeout(() => {
      this.fueLarga = true;
      this.dispararAlerta.emit(this.pendiente.id);
    }, 600);
  }

  cancelarPulsacion(): void {
    clearTimeout(this.temporizador);
  }

  /**
   * Tras una pulsación larga el navegador emite igual el click. Sin este
   * guardia, la alerta se abriría y encima navegaría al detalle.
   */
  alSoltarClick(): void {
    if (this.fueLarga) {
      this.fueLarga = false;
      return;
    }
    this.abrir.emit(this.pendiente.id);
  }

  get completado(): boolean {
    return this.pendiente.estado === 'realizado';
  }

  get ubicacion(): string {
    return describirUbicacion(this.pendiente);
  }
}
