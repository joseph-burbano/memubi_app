export interface Pendiente {
  id: string;
  titulo: string;
  categoriaId?: string;
  lugar?: Lugar;
  radio?: Radio;
  completada: boolean;
}

import type { Lugar } from './lugar.model';
import type { Radio } from './radio.model';
