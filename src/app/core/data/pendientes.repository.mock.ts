import { Injectable } from '@angular/core';
import { Pendiente } from '../models/pendiente.model';
import { PENDIENTES_MOCK } from '../mock/pendientes.mock';
import { PendientesRepository } from './pendientes.repository';

/**
 * Implementación falsa del repositorio. Es la que corre en esta entrega.
 *
 * Guarda en memoria: al cerrar la app se pierde todo y la demo vuelve a
 * empezar limpia, que es justo lo que se quiere para repetir la
 * presentación sin reinstalar nada.
 *
 * Si algún día conviene que un pendiente creado sobreviva al cierre, eso
 * se resuelve aquí con `localStorage` y en ningún otro lado. NO lo
 * agregues sin decidirlo: cambia lo que el evaluador ve al abrir la app
 * por segunda vez.
 */
@Injectable()
export class PendientesRepositoryMock extends PendientesRepository {
  private datos: Pendiente[] = PENDIENTES_MOCK.map((p) => ({ ...p }));

  async listar(): Promise<Pendiente[]> {
    return this.datos.map((p) => ({ ...p }));
  }

  async porId(id: string): Promise<Pendiente | undefined> {
    const encontrado = this.datos.find((p) => p.id === id);
    return encontrado ? { ...encontrado } : undefined;
  }

  async crear(p: Omit<Pendiente, 'id' | 'estado'>): Promise<Pendiente> {
    const nuevo: Pendiente = { ...p, id: `p${Date.now()}`, estado: 'activo' };
    this.datos = [...this.datos, nuevo];
    return { ...nuevo };
  }

  async actualizar(id: string, cambios: Partial<Pendiente>): Promise<void> {
    this.datos = this.datos.map((p) =>
      p.id === id ? { ...p, ...cambios, id } : p,
    );
  }

  async reiniciar(): Promise<void> {
    this.datos = PENDIENTES_MOCK.map((p) => ({ ...p }));
  }
}
