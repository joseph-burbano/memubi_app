import { Categoria } from '../models/categoria.model';
import { Coordenada, Lugar } from '../models/lugar.model';
import { RadioAviso } from '../models/radio.model';

/**
 * La puerta al GPS. El otro punto de contacto con el mundo exterior.
 *
 * En esta entrega devuelve datos falsos: el prototipo es NO funcional y
 * la alerta de proximidad no se dispara por ubicación, se dispara porque
 * un botón navega a MM20.
 *
 * Cuando llegue el momento de hacerlo real, lo que hay que saber:
 *
 *   - El primitivo correcto NO es rastrear, es GEOFENCING: se registran
 *     círculos y el sistema operativo despierta la app. Un `watchPosition`
 *     de fondo lo mata Doze y se come la batería.
 *   - Android `GeofencingClient` (límite 100 geocercas), iOS
 *     `CLCircularRegion` (límite 20 regiones). Capacitor no lo trae:
 *     hay que escribir un plugin delgado. La UI sigue en Ionic.
 *   - La rama CATEGORÍA no se puede geocercar de una: "cualquier
 *     supermercado" no es un círculo. Hay que reregistrar una ventana
 *     móvil con las N más cercanas cada vez que el usuario se desplaza.
 *     Es la decisión de arquitectura más importante que tiene MemUbi.
 *   - La WEB no puede hacer nada de esto: no hay API de geofencing en el
 *     navegador, `navigator.geolocation` no se expone a los service
 *     workers, y con la pestaña cerrada no corre nada. Por eso la alerta
 *     es exclusiva de móvil — decisión de experiencia que además resultó
 *     ser la única posible.
 */
export abstract class LocationService {
  abstract posicionActual(): Promise<Coordenada>;
  /** Candidatos de esa categoría que caen dentro del radio. */
  abstract lugaresCercanos(
    categoria: Categoria,
    radio: RadioAviso,
  ): Promise<Lugar[]>;
}
