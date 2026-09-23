import { Pendiente } from '../models/pendiente.model';

/**
 * La única puerta a los datos de pendientes.
 *
 * ESTE ES EL PUNTO DE CONTACTO CON EL BACKEND QUE NO EXISTE.
 *
 * En esta entrega no hay servidor: el prototipo es NO funcional y todo
 * está mockeado. Pero las pantallas no lo saben, porque hablan con esta
 * clase abstracta y no con un arreglo.
 *
 * El día que haya backend se escribe `PendientesRepositoryHttp` y se
 * cambia UNA línea en `app.config.ts`. Ni una pantalla se entera. Eso es
 * lo que se contesta cuando pregunten "¿y esto cómo se conectaría?":
 * está preparado, y se ve exactamente dónde.
 *
 * Los métodos son asíncronos a propósito, aunque el mock responda de
 * inmediato. Si se escribieran síncronos, conectar un backend obligaría
 * a cambiar todas las pantallas que los llaman.
 */
export abstract class PendientesRepository {
  abstract listar(): Promise<Pendiente[]>;
  abstract porId(id: string): Promise<Pendiente | undefined>;
  abstract crear(p: Omit<Pendiente, 'id' | 'estado'>): Promise<Pendiente>;
  abstract actualizar(id: string, cambios: Partial<Pendiente>): Promise<void>;
  /** Deja la demo como al arrancar, sin reinstalar la app. */
  abstract reiniciar(): Promise<void>;
}

// Eliminar un pendiente NO está prototipado: se declaró fuera de alcance
// en la Entrega 3. No agregues un `eliminar()` aquí.
