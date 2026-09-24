import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BorradorStore } from '../../../core/store/borrador.store';
import { CrearQueYDondePage } from './crear-que-y-donde.page';

describe('CrearQueYDondePage', () => {
  it('inicia MM04 sin ninguna opción de ubicación marcada', () => {
    TestBed.configureTestingModule({
      imports: [CrearQueYDondePage],
      providers: [provideRouter([])],
    });

    const borrador = TestBed.inject(BorradorStore);
    borrador.limpiar();
    const fixture = TestBed.createComponent(CrearQueYDondePage);
    fixture.detectChanges();

    const opciones = Array.from(
      fixture.nativeElement.querySelectorAll('[role="radio"]'),
    ) as HTMLElement[];

    expect(borrador.borrador().tipoUbicacion).toBeNull();
    expect(opciones.length).toBe(2);
    expect(opciones.every((opcion) => opcion.getAttribute('aria-checked') === 'false')).toBe(true);
  });
});
