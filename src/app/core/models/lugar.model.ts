/**
 * Un punto en el mapa.
 *
 * `Coordenada` es lo que devolvería el GPS; hoy sale del servicio falso.
 * `Lugar` es un candidato que se dibuja en el mapa de creación (web).
 *
 * Una distinción que hay que respetar al maquetar, y que viene de la
 * Entrega 3: en la rama CATEGORÍA el mapa dibuja los candidatos pero
 * NINGUNO es seleccionable, porque el pendiente se activa con cualquiera
 * de ellos. Elegir un lugar concreto solo existe en la rama dirección.
 */
export interface Coordenada {
  lat: number;
  lng: number;
}

export interface Lugar {
  id: string;
  nombre: string;
  direccion: string;
  /** Distancia a la posición actual. Sirve para saber si cae dentro del radio. */
  distanciaMetros: number;
  coordenada?: Coordenada;
}
