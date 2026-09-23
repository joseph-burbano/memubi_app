import { Routes } from '@angular/router';
import { MOBILE_CREAR_ROUTES } from './crear/crear.routes';
import { MOBILE_CONSULTA_ROUTES } from './consulta/consulta.routes';

/**
 * Árbol de rutas de la app móvil.
 *
 * ESTE ARCHIVO NO SE TOCA. Solo importa los dos archivos por flujo, y
 * así nadie tiene que abrir un archivo del otro para agregar una ruta.
 *
 * Cada quien agrega las suyas en:
 *   crear/crear.routes.ts       -> Juan David
 *   consulta/consulta.routes.ts -> Joseph
 */
export const MOBILE_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'permiso' },
  ...MOBILE_CONSULTA_ROUTES,
  ...MOBILE_CREAR_ROUTES,
];
