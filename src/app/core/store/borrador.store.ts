import type { Pendiente } from '../models/pendiente.model';

export class BorradorStore {
  private borrador: Partial<Pendiente> = {};

  get(): Partial<Pendiente> {
    return { ...this.borrador };
  }

  set(value: Partial<Pendiente>): void {
    this.borrador = { ...this.borrador, ...value };
  }
}
