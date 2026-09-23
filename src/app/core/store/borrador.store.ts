import { Injectable, computed, signal } from '@angular/core';
import { Categoria } from '../models/categoria.model';
import { RADIO_POR_DEFECTO, RadioAviso } from '../models/radio.model';
import { Pendiente, TipoUbicacion } from '../models/pendiente.model';

/**
 * El pendiente en construcción.
 *
 * ESTA ES LA PIEZA COMPARTIDA ENTRE LAS DOS PLATAFORMAS, y por eso su
 * interfaz está congelada: cambiarla rompe al otro en silencio. Si
 * necesitas tocarla, avisa antes.
 *
 * Cómo la consume cada plataforma:
 *
 *   Móvil — el asistente la llena a lo largo de cinco rutas:
 *           título en MM04, categoría en MM05/MM06, confirmación en MM09.
 *   Web   — la página única MW2 la llena de una sola vez.
 *
 * Los dos terminan llamando `PendientesStore.guardar(...)`. Cero lógica
 * duplicada y cero plantillas compartidas: lo que se comparte vive aquí,
 * no en los templates.
 */
export interface Borrador {
  titulo: string;
  tipoUbicacion: TipoUbicacion | null;
  categoria: Categoria | null;
  direccion: string | null;
  radioAviso: RadioAviso;
}

const VACIO: Borrador = {
  titulo: '',
  tipoUbicacion: null,
  categoria: null,
  direccion: null,
  radioAviso: RADIO_POR_DEFECTO,
};

@Injectable({ providedIn: 'root' })
export class BorradorStore {
  private readonly _borrador = signal<Borrador>({ ...VACIO });

  readonly borrador = this._borrador.asReadonly();

  /**
   * El botón Guardar / Siguiente se habilita con esto.
   *
   * Ojo: en MM06 el botón quedó apagado con la categoría ya elegida
   * porque la pantalla heredó el estado de su clon. Que no vuelva a pasar.
   */
  readonly estaCompleto = computed(() => {
    const b = this._borrador();
    if (!b.titulo.trim() || !b.tipoUbicacion) return false;
    return b.tipoUbicacion === 'categoria' ? !!b.categoria : !!b.direccion;
  });

  parchar(cambios: Partial<Borrador>): void {
    this._borrador.update((b) => ({ ...b, ...cambios }));
  }

  /** Cambiar de rama limpia la otra: un pendiente es categoría O dirección. */
  elegirTipo(tipo: TipoUbicacion): void {
    this._borrador.update((b) => ({
      ...b,
      tipoUbicacion: tipo,
      categoria: tipo === 'categoria' ? b.categoria : null,
      direccion: tipo === 'direccion' ? b.direccion : null,
    }));
  }

  /** Carga un pendiente existente para editarlo. Editar reusa este store. */
  cargarDesde(p: Pendiente): void {
    this._borrador.set({
      titulo: p.titulo,
      tipoUbicacion: p.tipoUbicacion,
      categoria: p.categoria ?? null,
      direccion: p.direccion ?? null,
      radioAviso: p.radioAviso,
    });
  }

  /** Lo que se le pasa a `PendientesStore.guardar`. Solo con `estaCompleto`. */
  aPendiente(): Omit<Pendiente, 'id' | 'estado'> {
    const b = this._borrador();
    return {
      titulo: b.titulo.trim(),
      tipoUbicacion: b.tipoUbicacion!,
      categoria: b.categoria ?? undefined,
      direccion: b.direccion ?? undefined,
      radioAviso: b.radioAviso,
    };
  }

  limpiar(): void {
    this._borrador.set({ ...VACIO });
  }
}
