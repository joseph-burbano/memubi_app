import type { Lugar } from '../models/lugar.model';

export interface LocationService {
  getCurrentLocation(): Promise<Lugar>;
}

export class FakeLocationService implements LocationService {
  async getCurrentLocation(): Promise<Lugar> {
    return { latitud: 0, longitud: 0, nombre: 'Ubicación simulada' };
  }
}
