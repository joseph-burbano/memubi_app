import { Routes } from '@angular/router';

/**
 * Móvil · primer uso, consulta, alerta y ajustes.   DUEÑO: Juan David
 *
 * Son más pantallas que el flujo de creación, pero casi todas
 * presentacionales: pintan datos del PendientesStore y navegan.
 *
 * Cada pantalla corresponde a un marco de `yjsO8FnCMVBjXthDLJLWiq`,
 * página *Wireframes y Mockups Mobile*.
 *
 * Descomenta cada ruta cuando su página exista.
 *
 *   P1 · Red Route
 *   [ ] permiso                MM01           permiso de ubicación
 *   [ ] sin-pendientes         MM03           estado vacío, lo primero que se ve
 *   [ ] pendientes             MM12 · MM13    lista, estado (completado)
 *   [ ] pendientes/:id         MM14 · MM15    detalle categoría / dirección
 *   [ ] alerta/:id             MM20 · MM20b   ALERTA DE PROXIMIDAD
 *   [ ] alerta/:id/realizado   MM21           pendiente realizado
 *
 *   P2
 *   [ ] permiso/desactivar     MM02           desactivar ubicación
 *   [ ] alerta/:id/proximo     MM22           próximo lugar similar
 *   [ ] configuracion          MM23
 *   [ ] privacidad/ubicacion   MM24 · MM24b   estado (desactivada)
 *   [ ] privacidad/datos       MM25
 *
 * La alerta (MM20, MM20b, MM21) es P1 aunque esté al final de la lista:
 * es el argumento entero de por qué el producto es móvil, y es lo único
 * que la web no puede hacer.
 *
 * El ámbar solo aparece aquí, en la alerta y en el botón que la resuelve.
 * En ninguna otra pantalla del bloque.
 */
export const MOBILE_CONSULTA_ROUTES: Routes = [
  {
    path: 'permiso',
    loadComponent: () =>
      import('./pages/permiso.page').then((m) => m.PermisoPage),
  },
  {
    // MM12 y MM03 son la misma página: el estado vacío no es otra ruta.
    path: 'pendientes',
    loadComponent: () =>
      import('./pages/pendientes.page').then((m) => m.PendientesPage),
  },
];
