import { Routes } from '@angular/router';


export const WEB_CONSULTA_ROUTES: Routes = [
  {
    path: 'pendientes',
    title: 'MemUbi · Mis pendientes',
    loadComponent: () =>
      import('./pages/lista.page').then((m) => m.ListaPage),
  },
  {
    path: 'pendientes/:id',
    title: 'MemUbi · Detalle del pendiente',
    loadComponent: () =>
      import('./pages/detalle.page').then((m) => m.DetallePage),
  },
  {
    path: 'privacidad',
    title: 'MemUbi · Privacidad y datos',
    loadComponent: () =>
      import('./pages/privacidad.page').then((m) => m.PrivacidadPage),
  },
  {
    path: 'privacidad/ubicacion',
    title: 'MemUbi · Uso de la ubicación',
    loadComponent: () =>
      import('./pages/uso-ubicacion.page').then((m) => m.UsoUbicacionPage),
  },
];
