import { Routes } from '@angular/router';

/**
 * Móvil · flujo de creación y edición.   DUEÑO: Joseph
 *
 * El asistente: cinco pantallas encadenadas escribiendo sobre el mismo
 * BorradorStore. Es la pieza más pesada del proyecto.
 *
 * Cada pantalla corresponde a un marco de `yjsO8FnCMVBjXthDLJLWiq`,
 * página *Wireframes y Mockups Mobile*. Si vas a escribir un campo o un
 * estado que no puedes señalar en un marco, para y pregunta.
 *
 * Descomenta cada ruta cuando su página exista.
 *
 *   P1 · Red Route
 *   [ ] crear/que-y-donde      MM04           qué necesitas recordar + dónde
 *   [ ] crear/categoria        MM05 · MM06    cuadrícula 2x2, estado (elegida)
 *   [ ] crear/confirmar        MM09 · MM10    revisión antes de guardar
 *   [ ] crear/listo            MM11           pendiente creado
 *
 *   P2
 *   [ ] crear/que-y-donde      MM04b          rama dirección
 *   [ ] crear/direccion        MM07 · MM08    buscar y elegir dirección
 *   [ ] editar/:id             MM16 · MM17    + estados MM16b · MM17b
 *   [ ] editar/:id/confirmar   MM18 · MM19    confirmar cambios
 *
 * Dos fallos del prototipo de navegación que NO se pueden repetir aquí:
 *   - "Guardar cambios" en editar NO va a "pendiente creado". Editar no
 *     crea nada: pasa por confirmación y vuelve al detalle.
 *   - Elegir una opción no avanza de pantalla. Solo el botón Siguiente
 *     navega; la selección solo cambia el estado.
 */
export const MOBILE_CREAR_ROUTES: Routes = [
  // {
  //   path: 'crear/que-y-donde',
  //   loadComponent: () =>
  //     import('./pages/que-y-donde.page').then((m) => m.QueYDondePage),
  // },
];
