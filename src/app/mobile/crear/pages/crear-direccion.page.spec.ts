import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BorradorStore } from '../../../core/store/borrador.store';
import { CrearDireccionPage } from './crear-direccion.page';

describe('CrearDireccionPage', () => {
  it('habilita Siguiente al escribir una dirección y lo deshabilita al vaciarla', () => {
    TestBed.configureTestingModule({
      imports: [CrearDireccionPage],
      providers: [provideRouter([])],
    });
    const borrador = TestBed.inject(BorradorStore);
    borrador.parchar({ titulo: 'Recoger medicamento', tipoUbicacion: 'direccion' });
    const fixture = TestBed.createComponent(CrearDireccionPage);
    fixture.detectChanges();

    const campo = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    campo.value = 'Calle de Alcalá 45, Madrid';
    campo.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(borrador.borrador().direccion).toBe('Calle de Alcalá 45, Madrid');
    expect(fixture.componentInstance.puedeSeguir()).toBe(true);

    campo.value = '   ';
    campo.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(borrador.borrador().direccion).toBeNull();
    expect(fixture.componentInstance.puedeSeguir()).toBe(false);
  });
});
