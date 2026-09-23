import type { Lugar } from '../../../core/models/lugar.model';
import type { RadioAviso } from '../../../core/models/radio.model';

/**
 * Mapa con la posición del usuario, el círculo del radio y los lugares
 * que lo activarían. Solo web: necesita ancho para ser legible.
 *
 * PENDIENTE DE CONVERTIR a componente standalone de Angular. Esto
 * todavía es una interfaz de Props al estilo React. Lo mismo pasa con
 * `pendiente-card.web.ts`, `pendiente-card.mobile.ts` y `alerta-banner.ts`.
 *
 * Al construirlo, la regla que no se puede romper (Entrega 3):
 * en la rama CATEGORÍA los candidatos se dibujan pero NINGUNO es
 * seleccionable — el pendiente se activa con cualquiera de ellos, y el
 * mapa está ahí para que el usuario entienda qué significa el radio que
 * acaba de elegir, no para escoger local. Elegir un lugar concreto solo
 * existe en la rama dirección.
 */
export interface MapaRadioProps {
  lugares: Lugar[];
  radio: RadioAviso;
  /** Solo la rama dirección permite elegir. */
  seleccionable: boolean;
}
