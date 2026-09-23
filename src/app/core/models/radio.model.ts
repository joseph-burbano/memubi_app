/**
 * Radio de aviso.
 *
 * Tres valores fijos, con el texto de ayuda que los acompaña en MW2d.
 * Ese texto importa: "500 m" no le dice nada a nadie, "a un par de
 * calles" sí. Es la distancia explicada en lenguaje de peatón.
 *
 * Solo la WEB deja elegirlo (ampliación aprobada en la Entrega 3).
 * El móvil lo hereda y no lo muestra: se decidió no tocar móvil porque
 * el tutor validó su enfoque. Está anotado, no escondido.
 */
export type RadioAviso = 200 | 500 | 1000;

export const RADIOS: ReadonlyArray<{
  valor: RadioAviso;
  etiqueta: string;
  ayuda: string;
}> = [
  { valor: 200, etiqueta: '200 m', ayuda: 'a la vuelta de la esquina' },
  { valor: 500, etiqueta: '500 m', ayuda: 'a un par de calles' },
  { valor: 1000, etiqueta: '1 km', ayuda: 'cuando entres al barrio' },
];

export const RADIO_POR_DEFECTO: RadioAviso = 500;
