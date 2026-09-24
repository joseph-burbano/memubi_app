import { Pendiente } from '../models/pendiente.model';

/**
 * La app ARRANCA SIN PENDIENTES, a propósito.
 *
 * Así la primera pantalla tras el permiso es `MM03 · Sin pendientes`,
 * que es lo que ve de verdad quien instala la app, y el listado se
 * puebla delante de quien mira la demostración.
 *
 * El contenido de `MM12` no se perdió: vive en las semillas de
 * `pendientes.page`, y los tres primeros toques de "Nuevo pendiente"
 * reconstruyen esa pantalla tal cual está en el mockup.
 *
 * Si alguna vez conviene arrancar con datos —para una captura, por
 * ejemplo— se llena este arreglo y nada más.
 */
export const PENDIENTES_MOCK: readonly Pendiente[] = [] as const;
