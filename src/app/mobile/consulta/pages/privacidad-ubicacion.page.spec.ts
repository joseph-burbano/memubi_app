import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PrivacidadUbicacionPage } from './privacidad-ubicacion.page';

describe('PrivacidadUbicacionPage', () => {
  it('activa Abrir configuración al pulsar el botón', () => {
    TestBed.configureTestingModule({
      imports: [PrivacidadUbicacionPage],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(PrivacidadUbicacionPage);
    fixture.detectChanges();

    const boton = fixture.nativeElement.querySelector('.privacidad__accion button') as HTMLButtonElement;
    boton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.errorAjustes()).toBe(
      'Los ajustes de ubicación solo están disponibles en el dispositivo.',
    );
  });
});
