import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
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
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // --- Datos: mockeados en esta entrega ---
    { provide: PendientesRepository, useClass: PendientesRepositoryMock },
    { provide: LocationService, useClass: LocationServiceMock },
  ],
};
