import { Routes } from '@angular/router';

/**
 * Web · consulta y ajustes.   DUEÑO: Juan David
 *
 * Marcos en `s7ocVpNtQdKTUFr7CaNWMh` (*MemUBI-App*), página *Web*.
 *
 * Igual que en creación: varios marcos son estados de una sola página.
 *
 *   MW1    lista
 *   MW1b   vista mapa (conmutador Lista / Mapa)
 *   MW1d   con un pendiente completado
 *   MW1e   con el aviso de "pendiente guardado"
 *
 * Descomenta cada ruta cuando su página exista.
 *
 *   P1 · Red Route
 *   [x] pendientes             MW0 · estado vacío de lista
 *   [ ] pendientes             MW1 · MW1b · MW1d · MW1e
 *   [ ] pendientes/:id         MW4 · MW4b     detalle categoría / dirección
 *
 *   P2
 *   [ ] estado vacío de mapa   MW0b           en la misma ruta /pendientes
 *   [ ] privacidad             MW6            privacidad y datos
 *   [ ] uso-ubicacion          MW7            uso de la ubicación
 *
 * La tarjeta de pendiente de web NO es la de móvil. Aquí el título va a
 * 21 px Heading/3, la tarjeta es una fila de 1248 px y hay un enlace
 * "Ver detalle" explícito. Construye `web/ui/pendiente-card.web.ts`
 * sobre los primitivos de `ui/`, sin tocar el de móvil.
 *
 * Ninguna lista muestra la distancia. No la agregues: no está prototipada.
 */
export const WEB_CONSULTA_ROUTES: Routes = [
  {
    path: 'pendientes',
    title: 'MemUbi · Mis pendientes',
    loadComponent: () =>
      import('./pages/lista.page').then((m) => m.ListaPage),
  },
];
