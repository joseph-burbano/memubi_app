import { Categoria } from '../models/categoria.model';
import { Coordenada, Lugar } from '../models/lugar.model';

/**
 * Posición y lugares de la demo.
 *
 * El proyecto está ambientado en MADRID, no en Bogotá. Las direcciones
 * de los mockups son de allí (Calle de Alcalá, Gran Vía), y mezclarlas
 * con otras ciudades se nota en la sustentación.
 */

/** Puerta del Sol. */
export const POSICION_MOCK: Coordenada = { lat: 40.4168, lng: -3.7038 };

export const LUGARES_MOCK: Record<Categoria, readonly Lugar[]> = {
  supermercado: [
    { id: 'l1', nombre: 'Supermercado Alcalá', direccion: 'Calle de Alcalá 45', distanciaMetros: 180 },
    { id: 'l2', nombre: 'Supermercado Sol', direccion: 'Calle Mayor 12', distanciaMetros: 420 },
    { id: 'l3', nombre: 'Supermercado Gran Vía', direccion: 'Gran Vía 28', distanciaMetros: 860 },
  ],
  farmacia: [
    { id: 'l4', nombre: 'Farmacia Alcalá', direccion: 'Calle de Alcalá 45', distanciaMetros: 150 },
    { id: 'l5', nombre: 'Farmacia Preciados', direccion: 'Calle Preciados 9', distanciaMetros: 640 },
  ],
  ferreteria: [
    { id: 'l6', nombre: 'Ferretería Centro', direccion: 'Calle de Atocha 33', distanciaMetros: 520 },
  ],
  'centro-comercial': [
    { id: 'l7', nombre: 'Centro comercial Príncipe Pío', direccion: 'Paseo de la Florida 2', distanciaMetros: 1400 },
  ],
};

/**
 * Direcciones candidatas para la rama DIRECCIÓN de MW2b.
 *
 * Son las del mockup. A diferencia de los candidatos por categoría,
 * estas SÍ se eligen: el pendiente se ata a una dirección concreta.
 */
export const DIRECCIONES_MOCK: readonly Lugar[] = [
  {
    id: 'd1',
    nombre: 'Farmacia',
    direccion: 'Calle de Alcalá 45, Madrid',
    distanciaMetros: 300,
  },
  {
    id: 'd2',
    nombre: 'Farmacia',
    direccion: 'Calle de Alcalá 128, Madrid',
    distanciaMetros: 1100,
  },
];

/**
 * Elegidas para que el radio se note al cambiarlo en MW2h / MW2i:
 * con 200 m entra un supermercado, con 500 m entran dos, con 1 km tres.
 * Si cambias las distancias, esa demostración deja de funcionar.
 */
