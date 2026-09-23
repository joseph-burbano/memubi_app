import { Categoria, nombreCategoria } from './categoria.model';
import { RadioAviso } from './radio.model';

/**
 * El pendiente: la entidad central de MemUbi.
 *
 * EL DOMINIO ES UNO Y ESTÁ COMPLETO. Las plataformas difieren en qué
 * exponen, no en qué existe: `radioAviso` vive aquí aunque solo la web
 * lo deje editar. Por eso no decimos "ocultamos funcionalidades en
 * móvil" — decimos que cada plataforma expone lo suyo.
 *
 * Todo lo de este archivo sale de los mockups. No agregues campos que
 * no aparezcan en una pantalla.
 */

/**
 * La rama del pendiente.
 *
 * `categoria` significa "cualquier lugar de ese tipo".
 * `direccion` es un punto fijo.
 *
 * Un pendiente es una cosa o la otra, nunca las dos.
 */
export type TipoUbicacion = 'categoria' | 'direccion';

export type EstadoPendiente = 'activo' | 'realizado';

export interface Pendiente {
  id: string;
  titulo: string;
  tipoUbicacion: TipoUbicacion;
  /** Presente cuando `tipoUbicacion` es 'categoria'. */
  categoria?: Categoria;
  /** Presente cuando `tipoUbicacion` es 'direccion'. */
  direccion?: string;
  radioAviso: RadioAviso;
  estado: EstadoPendiente;
}

/** Lo que se muestra bajo el título en la lista y en el detalle. */
export function describirUbicacion(p: Pendiente): string {
  if (p.tipoUbicacion === 'categoria' && p.categoria) {
    return `Cualquier ${nombreCategoria(p.categoria).toLowerCase()}`;
  }
  return p.direccion ?? 'Una dirección específica';
}
