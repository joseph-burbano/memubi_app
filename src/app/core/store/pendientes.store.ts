import type { Pendiente } from '../models/pendiente.model';

export class PendientesStore {
  private pendientes: Pendiente[] = [];

  getAll(): Pendiente[] {
    return [...this.pendientes];
  }
}
