import { Injectable, computed, inject, signal } from '@angular/core';
import { Pendiente } from '../models/pendiente.model';
import { PendientesRepository } from '../data/pendientes.repository';

/**
 * El estado de los pendientes en la pantalla.
 *
 * El store NO sabe de dónde vienen los datos: se los pide al repositorio.
 * Hoy el repositorio es falso; mañana podría ser HTTP y este archivo no
 * cambiaría. Es el patrón que enseña el módulo 7 —los datos van en
 * servicios, no en componentes— llevado un paso más allá.
 *
 * Las pantallas leen las señales y llaman a los métodos. Nunca tocan el
 * repositorio directamente.
 */
@Injectable({ providedIn: 'root' })
export class PendientesStore {
  private readonly repo = inject(PendientesRepository);

  private readonly _pendientes = signal<Pendiente[]>([]);
  private readonly _cargando = signal(false);

  readonly pendientes = this._pendientes.asReadonly();
  readonly cargando = this._cargando.asReadonly();

  readonly activos = computed(() =>
    this._pendientes().filter((p) => p.estado === 'activo'),
  );

  /**
   * Para decidir entre la lista y el estado vacío (MM03 / MW0).
   *
   * Ojo: solo es cierto DESPUÉS de cargar. Mientras `cargando` sea true
   * no muestres el estado vacío, o se verá un parpadeo de "aún no tienes
   * pendientes" cada vez que se abre la app.
   */
  readonly estaVacio = computed(
    () => !this._cargando() && this._pendientes().length === 0,
  );

  /**
   * Carga solo si aún no hay nada.
   *
   * Sin esto, aterrizar directo en /pendientes/:id o /alerta/:id —por un
   * enlace, por la pulsación larga o tras recargar— deja la señal vacía
   * y la pantalla sale en blanco. La lista era la única que llamaba a
   * `cargar()`, así que el resto dependía de haber pasado por ella.
   */
  async asegurarCargado(): Promise<void> {
    if (this._pendientes().length === 0 && !this._cargando()) {
      await this.cargar();
    }
  }

  async cargar(): Promise<void> {
    this._cargando.set(true);
    try {
      this._pendientes.set(await this.repo.listar());
    } finally {
      this._cargando.set(false);
    }
  }

  porId(id: string): Pendiente | undefined {
    return this._pendientes().find((p) => p.id === id);
  }

  async guardar(pendiente: Omit<Pendiente, 'id' | 'estado'>): Promise<Pendiente> {
    const nuevo = await this.repo.crear(pendiente);
    await this.cargar();
    return nuevo;
  }

  async actualizar(id: string, cambios: Partial<Pendiente>): Promise<void> {
    await this.repo.actualizar(id, cambios);
    await this.cargar();
  }

  async marcarRealizado(id: string): Promise<void> {
    await this.actualizar(id, { estado: 'realizado' });
  }

  /** Deja la demo como al arrancar, para repetir la presentación. */
  async reiniciar(): Promise<void> {
    await this.repo.reiniciar();
    await this.cargar();
  }
}
