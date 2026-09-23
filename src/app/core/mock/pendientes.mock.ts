import { Pendiente } from '../models/pendiente.model';

/**
 * Los pendientes de la demo.
 *
 * NO LOS CAMBIES. Son exactamente los de los mockups MM12 y MW1, y las
 * capturas de la sustentación tienen que coincidir con lo que se vea en
 * la demo. Si en la presentación aparece "Comprar leche" y en la app
 * "Prueba 1", se nota.
 *
 * Todo dato falso del proyecto vive en esta carpeta. Si necesitas
 * inventar un dato para una pantalla, va aquí y no dentro del componente.
 */
export const PENDIENTES_MOCK: readonly Pendiente[] = [
  {
    id: 'p1',
    titulo: 'Comprar leche',
    tipoUbicacion: 'categoria',
    categoria: 'supermercado',
    radioAviso: 500,
    estado: 'activo',
  },
  {
    id: 'p2',
    titulo: 'Recoger medicamento',
    tipoUbicacion: 'direccion',
    direccion: 'Farmacia cerca de Calle de Alcalá',
    radioAviso: 500,
    estado: 'activo',
  },
  {
    id: 'p3',
    titulo: 'Cambiar las cuerdas del cello',
    tipoUbicacion: 'direccion',
    direccion: 'Una dirección específica',
    radioAviso: 500,
    estado: 'activo',
  },
  {
    id: 'p4',
    titulo: 'Comprar pan',
    tipoUbicacion: 'direccion',
    direccion: 'Panadería del barrio',
    radioAviso: 500,
    estado: 'activo',
  },
] as const;
