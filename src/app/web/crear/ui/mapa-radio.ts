import { Component, EventEmitter, Input, Output, booleanAttribute } from '@angular/core';
import { Lugar } from '../../../core/models/lugar.model';
import { RadioAviso } from '../../../core/models/radio.model';

/**
 * Mapa con tu posición, el círculo del radio y los lugares que lo
 * activarían. `MW2` (rama categoría) y `MW2b` (rama dirección).
 *
 * SOLO WEB. Necesita ancho para ser legible, y por eso móvil no lo tiene.
 *
 * LA REGLA QUE NO SE PUEDE ROMPER, de la Entrega 3:
 * en la rama CATEGORÍA los candidatos se dibujan pero NINGUNO es
 * seleccionable. El pendiente se activa con cualquiera de ellos, así que
 * el mapa está para que el usuario entienda qué significa el radio que
 * acaba de elegir, no para escoger local. Elegir un lugar concreto solo
 * existe en la rama dirección, y ahí se hace en la lista de al lado.
 *
 * No es un mapa de verdad: es una cuadrícula que lo representa. El
 * prototipo es no funcional y no hay servicio de mapas. La cuadrícula
 * sale del mockup, no es un marcador de posición improvisado.
 */
@Component({
  selector: 'web-mapa-radio',
  standalone: true,
  template: `
    <div class="mapa" [style.height.px]="alto" role="img" [attr.aria-label]="descripcion">
      <div class="mapa__cuadricula" aria-hidden="true"></div>

      <!-- El geocerco: el radio elegido, dibujado -->
      <div class="geocerco" [style.width.px]="diametro" [style.height.px]="diametro">
        <span class="geocerco__etiqueta">{{ etiquetaRadio }}</span>
      </div>

      <!-- Tú, en el centro cuando es categoría; a un lado cuando es dirección -->
      <div class="marcador marcador--tu" [class.marcador--tu-lateral]="!!destino">
        <span class="marcador__punto"></span>
        <span class="marcador__nombre">{{ destino ? 'TÚ' : 'TÚ' }}</span>
      </div>

      @if (destino) {
        <div class="marcador marcador--destino">
          <span class="marcador__anillo"></span>
          <span class="marcador__nombre">{{ destino }}</span>
        </div>
      }

      @for (c of candidatos; track c.id; let i = $index) {
        @if (seleccionable) {
          <button
            class="marcador marcador--candidato marcador--pulsable"
            type="button"
            [attr.aria-label]="'Elegir ' + c.direccion"
            [class.marcador--fuera]="c.distanciaMetros > radio"
            [style.left.px]="posicion(c, i).x"
            [style.top.px]="posicion(c, i).y"
            (click)="elegirLugar.emit(c)"
          >
            <span class="marcador__anillo"></span>
          </button>
        } @else {
          <div
            class="marcador marcador--candidato"
            [class.marcador--fuera]="c.distanciaMetros > radio"
            [style.left.px]="posicion(c, i).x"
            [style.top.px]="posicion(c, i).y"
          >
            <span class="marcador__anillo"></span>
          </div>
        }
      }
    </div>
  `,
  styles: [
    `
      .mapa {
        position: relative;
        overflow: hidden;
        background: var(--ui-surface-sunken);
        border: 1px solid var(--ui-border);
        border-radius: var(--ui-radius-md);
      }
      /* Las calles: líneas blancas de 2px cada 72px en horizontal y 54
       * en vertical, como en el mockup. */
      .mapa__cuadricula {
        position: absolute;
        inset: 0;
        background-image:
          repeating-linear-gradient(
            to right,
            var(--ui-surface) 0 2px,
            transparent 2px 72px
          ),
          repeating-linear-gradient(
            to bottom,
            var(--ui-surface) 0 2px,
            transparent 2px 54px
          );
        background-position: 23px 15px;
      }

      .geocerco {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: color-mix(in srgb, var(--ui-brand) 12%, transparent);
        border: 2px solid var(--ui-brand);
        border-radius: var(--ui-radius-pill);
      }
      .geocerco__etiqueta {
        position: absolute;
        bottom: 0.5rem;
        left: 1.25rem;
        font: 600 var(--ui-overline-size) / var(--ui-overline-line) var(--ui-font);
        letter-spacing: var(--ui-overline-track);
        color: var(--ui-text-secondary);
      }

      .marcador {
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.375rem;
        transform: translate(-50%, -50%);
      }
      .marcador__punto {
        width: 1.5rem;
        height: 1.5rem;
        background: var(--ui-brand);
        border-radius: var(--ui-radius-pill);
      }
      .marcador__anillo {
        width: 1.75rem;
        height: 1.75rem;
        background: var(--ui-brand);
        border: 4px solid var(--ui-brand-subtle);
        border-radius: var(--ui-radius-pill);
      }
      /* Fuera del radio: hueco, no relleno. El relleno dice "este te va
       * a avisar"; el hueco, "este no". */
      .marcador--fuera .marcador__anillo {
        width: 1.125rem;
        height: 1.125rem;
        background: var(--ui-surface);
        border: 2px solid var(--ui-border-strong);
      }
      .marcador__nombre {
        font: 600 var(--ui-overline-size) / var(--ui-overline-line) var(--ui-font);
        letter-spacing: var(--ui-overline-track);
        color: var(--ui-text-secondary);
        white-space: nowrap;
      }
      .marcador--tu {
        top: 50%;
        left: 50%;
      }
      .marcador--tu-lateral {
        top: 80%;
        left: 12%;
      }
      .marcador--destino {
        top: 50%;
        left: 50%;
      }
      /* Solo la rama dirección los vuelve pulsables. El objetivo táctil
       * es mayor que el punto dibujado. */
      .marcador--pulsable {
        padding: 0.5rem;
        margin: -0.5rem;
        background: none;
        border: none;
        cursor: pointer;
      }
      .marcador--pulsable:focus-visible {
        outline: 2px solid var(--ui-brand);
        outline-offset: 2px;
        border-radius: var(--ui-radius-pill);
      }
      .marcador--pulsable:hover .marcador__anillo {
        transform: scale(1.15);
      }
      .marcador__anillo {
        transition: transform 0.12s ease;
      }
    `,
  ],
})
export class MapaRadioComponent {
  /** Los que caen dentro del radio se pintan rellenos; el resto, huecos. */
  @Input() candidatos: readonly Lugar[] = [];
  @Input() radio: RadioAviso = 500;
  @Input() alto = 380;
  /** Con dirección elegida el geocerco se centra en ella, no en ti. */
  @Input() destino = '';
  /**
   * Solo la rama DIRECCIÓN deja elegir; la de categoría nunca.
   *
   * No es un detalle de interacción: viene de la Entrega 3. En categoría
   * el pendiente se activa con cualquiera de los lugares, así que elegir
   * uno concreto contradiría el significado de "cualquier supermercado".
   * Con esto en false los marcadores son `div` y no hay nada que pulsar.
   */
  @Input({ transform: booleanAttribute }) seleccionable = false;

  /**
   * El "toca un punto del mapa" de MW2c.
   *
   * Los puntos pulsables son los marcadores, no cualquier píxel: son las
   * direcciones que el prototipo conoce. Tocar el vacío exigiría
   * geocodificación inversa —convertir coordenadas en una dirección— y
   * eso es backend, que esta entrega no tiene. Inventar una dirección
   * para un punto cualquiera sería mentir sobre lo que la app sabe.
   */
  @Output() elegirLugar = new EventEmitter<Lugar>();

  /**
   * Ángulos fijos, no aleatorios: la demo tiene que verse igual siempre.
   * Repartidos para que no se solapen con la etiqueta del radio.
   */
  private readonly angulos = [-60, 20, 100, 160, -125, 65, -20];

  /**
   * Coloca cada lugar a una distancia PROPORCIONAL a la real.
   *
   * Antes iban en posiciones fijas, y pasaba algo que se veía mal: un
   * lugar marcado "fuera del radio" podía quedar dibujado DENTRO del
   * círculo. El mapa decía una cosa y el marcador otra.
   *
   * Ahora el radio elegido es la escala: un lugar a `radio` metros cae
   * justo sobre la circunferencia, uno más cerca queda dentro y uno más
   * lejos, fuera. Así el dibujo y la leyenda dicen lo mismo.
   */
  posicion(l: Lugar, i: number): { x: number; y: number } {
    const centroX = 252; // la mitad de los 504px del mockup
    const centroY = this.alto / 2;
    const radioPx = this.diametro / 2;

    // Los muy lejanos se acercan al borde en vez de salirse del recuadro.
    const proporcion = Math.min(l.distanciaMetros / this.radio, 1.35);
    const dist = proporcion * radioPx;
    const ang = (this.angulos[i % this.angulos.length] * Math.PI) / 180;

    return {
      x: centroX + Math.cos(ang) * dist,
      y: centroY + Math.sin(ang) * dist,
    };
  }

  /** El círculo crece con el radio, pero acotado para que quepa. */
  get diametro(): number {
    const porRadio: Record<number, number> = { 200: 200, 500: 280, 1000: 340 };
    return porRadio[this.radio] ?? 280;
  }

  get etiquetaRadio(): string {
    return this.radio >= 1000 ? '1 km' : `${this.radio} m`;
  }

  get descripcion(): string {
    return this.destino
      ? `Mapa con el radio de ${this.etiquetaRadio} alrededor de ${this.destino}`
      : `Mapa con tu posición y los lugares dentro de ${this.etiquetaRadio}`;
  }
}
