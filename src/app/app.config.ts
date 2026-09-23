import { ApplicationConfig } from '@angular/core';
import {
  PreloadAllModules,
  RouteReuseStrategy,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { routes } from './app.routes';

import { PendientesRepository } from './core/data/pendientes.repository';
import { PendientesRepositoryMock } from './core/data/pendientes.repository.mock';
import { LocationService } from './core/data/location.service';
import { LocationServiceMock } from './core/data/location.service.mock';

/**
 * Cableado de la aplicación.
 *
 * AQUÍ ESTÁ TODO EL "SIN BACKEND" DE ESTA ENTREGA, en dos líneas.
 *
 * El prototipo es NO funcional: no hay servidor, no hay base de datos y
 * no hay GPS. Pero eso no está esparcido por el código — está decidido
 * en este archivo. Ninguna pantalla sabe de dónde salen sus datos.
 *
 * El día que exista backend:
 *
 *   { provide: PendientesRepository, useClass: PendientesRepositoryHttp }
 *   { provide: LocationService,      useClass: LocationServiceCapacitor }
 *
 * Dos líneas, y ni una pantalla cambia. Cuando en la sustentación
 * pregunten cómo se conectaría esto, la respuesta es abrir este archivo.
 *
 * La aplicación es ZONELESS: no hay `zone.js` ni polyfills. El estado
 * vive en señales y Angular reacciona a ellas. NO agregues
 * `provideZoneChangeDetection`: exige una dependencia que no está
 * instalada y rompe el arranque.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withComponentInputBinding(),
    ),

    // --- Datos: mockeados en esta entrega ---
    { provide: PendientesRepository, useClass: PendientesRepositoryMock },
    { provide: LocationService, useClass: LocationServiceMock },
  ],
};
