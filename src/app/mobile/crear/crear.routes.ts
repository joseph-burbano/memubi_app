import { Routes } from '@angular/router';

/**
 * Móvil · flujo de creación y edición.   DUEÑO: Joseph
 *
 * El asistente: cinco pantallas encadenadas escribiendo sobre el mismo
 * BorradorStore. Es la pieza más pesada del proyecto.
 *
 * Cada pantalla corresponde a un marco de la página Mobile de MemUBI App.
 *
 *   P1 · Red Route
 *   crear/que-y-donde      MM04 · MM04b   qué necesitas recordar + dónde
 *   crear/categoria        MM05 · MM06    cuadrícula 2x2, estado (elegida)
 *   crear/confirmar        MM09 · MM10    revisión antes de guardar
 *   pendientes             MM11           lista con aviso de guardado
 *
 *   P2
 *   crear/direccion        MM07 · MM08    buscar y elegir dirección
 *   editar/:id             MM16 · MM17    + estados MM16b · MM17b
 *   editar/:id/confirmar   MM18 · MM19    confirmar cambios
 *
 * Dos fallos del prototipo de navegación que NO se pueden repetir aquí:
 *   - "Guardar cambios" en editar NO va a "pendiente creado". Editar no
 *     crea nada: pasa por confirmación y vuelve al detalle.
 *   - Elegir una opción no avanza de pantalla. Solo el botón Siguiente
 *     navega; la selección solo cambia el estado.
 */
export const MOBILE_CREAR_ROUTES: Routes = [
  {
    path: 'crear/que-y-donde',
    loadComponent: () => import('./pages/crear-que-y-donde.page').then((m) => m.CrearQueYDondePage),
  },
  {
    path: 'crear/categoria',
    loadComponent: () => import('./pages/crear-categoria.page').then((m) => m.CrearCategoriaPage),
  },
  {
    path: 'crear/direccion',
    loadComponent: () => import('./pages/crear-direccion.page').then((m) => m.CrearDireccionPage),
  },
  {
    path: 'crear/confirmar',
    loadComponent: () => import('./pages/crear-confirmar.page').then((m) => m.CrearConfirmarPage),
  },
  {
    path: 'editar/:id/confirmar',
    loadComponent: () => import('./pages/editar-confirmar.page').then((m) => m.EditarConfirmarPage),
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./pages/editar.page').then((m) => m.EditarPage),
  },
];
