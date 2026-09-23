import { Routes } from '@angular/router';
import { Capacitor } from '@capacitor/core';

/**
 * La plataforma elige un árbol de rutas y el otro NUNCA se descarga.
 *
 * Por PLATAFORMA, no por ancho de viewport. Si se conmutara por
 * breakpoint, achicar la ventana del navegador convertiría la web en la
 * app móvil, y "responsive" es justo la palabra con la que el tutor nos
 * señaló el problema que costó un 5/10.
 *
 * Al ser loadChildren, quien abre la web no baja un solo byte de las
 * pantallas móviles. Vale mencionarlo en la sustentación.
 */
export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      Capacitor.isNativePlatform()
        ? import('./mobile/mobile.routes').then((m) => m.MOBILE_ROUTES)
        : import('./web/web.routes').then((m) => m.WEB_ROUTES),
  },
];
