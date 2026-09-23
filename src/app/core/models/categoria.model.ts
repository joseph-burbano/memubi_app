/**
 * Las categorías de lugar.
 *
 * Son CUATRO y son fijas. Salen de MW2d y MM05, y la decisión de que
 * vayan a la vista en vez de en un desplegable está en la Entrega 3:
 * son solo cuatro, el público son adultos mayores, y una categoría se
 * reconoce por su imagen antes que por su nombre.
 *
 * No agregues una quinta. Si el producto necesitara más, eso se decide
 * y se prototipa antes de programarse.
 */
export type Categoria =
  | 'supermercado'
  | 'farmacia'
  | 'ferreteria'
  | 'centro-comercial';

export const CATEGORIAS: ReadonlyArray<{ id: Categoria; nombre: string }> = [
  { id: 'supermercado', nombre: 'Supermercado' },
  { id: 'farmacia', nombre: 'Farmacia' },
  { id: 'ferreteria', nombre: 'Ferretería' },
  { id: 'centro-comercial', nombre: 'Centro comercial' },
];

export function nombreCategoria(id: Categoria): string {
  return CATEGORIAS.find((c) => c.id === id)?.nombre ?? '';
}
