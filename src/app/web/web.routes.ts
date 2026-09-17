export const webRoutes = [
  { path: '', component: 'ListaPage' },
  { path: 'crear', component: 'CrearPage' },
  { path: 'detalle/:id', component: 'DetallePage' },
  { path: 'editar/:id', component: 'EditarPage' },
  { path: 'privacidad', component: 'PrivacidadPage' },
  { path: 'uso-ubicacion', component: 'UsoUbicacionPage' },
] as const;
