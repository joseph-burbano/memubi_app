/**
 * Mapa de capacidades: qué funcionalidad existe en qué plataforma.
 *
 * NO son capacidades del dispositivo. Es la asimetría deliberada entre
 * los dos productos, y es lo que hay que poder sustentar:
 *
 *   "No ocultamos funcionalidades en móvil. El dominio es uno y está
 *    completo; cada plataforma expone lo suyo."
 *
 * Fíjate en que hay exclusivas en AMBAS direcciones. Web no es móvil
 * con extras, y móvil no es web recortada.
 */

export interface Capacidad {
  readonly movil: boolean;
  readonly web: boolean;
  readonly porque: string;
}

export const CAPACIDADES = {
  listaPendientes: {
    movil: true,
    web: true,
    porque: 'Núcleo del producto en las dos plataformas',
  },
  crearPendiente: {
    movil: true,
    web: true,
    porque: 'Mismo caso de uso, distinta forma: asistente en móvil, una página en web',
  },
  editarPendiente: { movil: true, web: true, porque: 'Núcleo' },
  privacidadYDatos: { movil: true, web: true, porque: 'Núcleo' },

  // --- Solo móvil ---
  alertaProximidad: {
    movil: true,
    web: false,
    porque:
      'El navegador no puede: no hay API de geofencing, navigator.geolocation ' +
      'no se expone a los service workers y con la pestaña cerrada no corre nada. ' +
      'El móvil es el único que va contigo en la calle',
  },
  permisosUbicacion: {
    movil: true,
    web: false,
    porque: 'Se administran en el dispositivo, no desde la web (MW7 lo dice explícitamente)',
  },
  configuracion: {
    movil: true,
    web: false,
    porque: 'Los ajustes viven donde llega el aviso',
  },

  // --- Solo web ---
  /**
   * OJO: esto es EDITAR el radio, no verlo.
   *
   * Corregido el 23/09 contra los mockups: MM14, MM15 y MM20b SÍ muestran
   * "RADIO DE AVISO · 500 m · a un par de calles". La Entrega 3 lo dejó
   * anotado como pendiente ("si el pendiente guarda un radio, MOB-08
   * debería mostrarlo") y en los mockups se resolvió.
   *
   * Lo que sigue siendo exclusivo de web es elegirlo: en móvil no hay
   * ninguna pantalla donde se cambie.
   */
  editarRadioAviso: {
    movil: false,
    web: true,
    porque:
      'Ampliación aprobada en la Entrega 3. El móvil MUESTRA el radio en el ' +
      'detalle, pero no tiene pantalla para cambiarlo',
  },
  mapaConRadio: {
    movil: false,
    web: true,
    porque: 'Necesita ancho de pantalla para ser legible',
  },
  sugerirDirecciones: {
    movil: false,
    web: true,
    porque:
      'Mostrar candidatos aplica a las dos ramas; ELEGIR uno solo a la rama ' +
      'dirección. En categoría contradiría el significado de "cualquier lugar de ese tipo"',
  },
} as const satisfies Record<string, Capacidad>;

export type NombreCapacidad = keyof typeof CAPACIDADES;
