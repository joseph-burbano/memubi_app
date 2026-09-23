import { Injectable } from '@angular/core';
import { Categoria } from '../models/categoria.model';
import { Coordenada, Lugar } from '../models/lugar.model';
import { RadioAviso } from '../models/radio.model';
import { LUGARES_MOCK, POSICION_MOCK } from '../mock/lugares.mock';
import { LocationService } from './location.service';

/**
 * GPS falso. Es el que corre en esta entrega.
 *
 * La posición no cambia nunca: el usuario de la demo está parado en la
 * Puerta del Sol. No hace falta más, porque las pantallas que consumen
 * esto solo necesitan algo que dibujar.
 */
@Injectable()
export class LocationServiceMock extends LocationService {
  async posicionActual(): Promise<Coordenada> {
    return { ...POSICION_MOCK };
  }

  async lugaresCercanos(
    categoria: Categoria,
    radio: RadioAviso,
  ): Promise<Lugar[]> {
    return (LUGARES_MOCK[categoria] ?? [])
      .filter((l) => l.distanciaMetros <= radio)
      .map((l) => ({ ...l }));
  }
}
