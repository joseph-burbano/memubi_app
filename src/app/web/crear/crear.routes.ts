import { Routes } from '@angular/router';

/**
 * Web · flujo de creación y edición.   DUEÑO: Joseph
 *
 * Marcos en `s7ocVpNtQdKTUFr7CaNWMh` (*MemUBI-App*), página *Web*.
 *
 * OJO, ESTO ES LO MÁS IMPORTANTE DE ESTE ARCHIVO:
 * ocho marcos son UNA SOLA PÁGINA con estado interno, no ocho páginas.
 *
 *   MW2    categoría elegida
 *   MW2b   rama dirección
 *   MW2d   sin completar (Guardar deshabilitado, campos apagados)
 *   MW2e   Farmacia seleccionada
 *   MW2f   Ferretería seleccionada
 *   MW2g   Centro comercial seleccionado
 *   MW2h   radio en 200 m
 *   MW2i   radio en 1 km
 *
 * Un componente, un formulario, un BorradorStore. Si creas ocho
 * archivos, se rompe en cuanto haya que cambiar un campo.
 *
 * Descomenta cada ruta cuando su página exista.
 *
 *   P1 · Red Route
 *   [ ] crear                  MW2 y sus 7 estados   página con scroll, dos columnas
 *   [ ] crear/confirmar        MW3 · MW3b            pop up de confirmación
 *   [ ] editar/:id             MW5 · MW5b            clon de crear: solo cambian
 *                                                     título, subtítulo y botón
 *   P2
 *   [ ] crear/direccion        MW2c                  pop up seleccionar dirección
 *   [ ] editar/:id/confirmar   MW5c · MW5d           confirmar cambios
 *
 * Dos cosas que vienen decididas de la Entrega 3 y no se re-deciden aquí:
 *   - Las cuatro categorías van A LA VISTA, no en un desplegable. Son
 *     cuatro y el público son adultos mayores.
 *   - En la rama CATEGORÍA el mapa dibuja los candidatos pero NINGUNO es
 *     seleccionable: el pendiente se activa con cualquiera de ellos.
 *     Elegir un lugar concreto solo existe en la rama dirección.
 */
export const WEB_CREAR_ROUTES: Routes = [
  // {
  //   path: 'crear',
  //   loadComponent: () =>
  //     import('./pages/crear.page').then((m) => m.CrearPage),
  // },
];
