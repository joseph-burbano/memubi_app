import { Routes } from '@angular/router';
import { WEB_CREAR_ROUTES } from './crear/crear.routes';
import { WEB_CONSULTA_ROUTES } from './consulta/consulta.routes';

/**
 * Árbol de rutas de la app web.
 *
 * ESTE ARCHIVO NO SE TOCA. Solo importa los dos archivos por flujo.
 *
 * Cada quien agrega las suyas en:
 *   crear/crear.routes.ts       -> Joseph
 *   consulta/consulta.routes.ts -> Juan David
 *
 * Fíjate en que este árbol NO comparte una sola pantalla con el de
 * móvil. Ahí está la respuesta a "no pueden tener la misma funcionalidad
 * para las dos".
 */
export const WEB_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'pendientes' },
  ...WEB_CONSULTA_ROUTES,
  ...WEB_CREAR_ROUTES,
];
