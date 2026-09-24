import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BorradorStore } from '../../../core/store/borrador.store';
import { PasoShellComponent } from '../ui/paso-shell';
import { DireccionSelectorComponent } from '../ui/direccion-selector';
import { PASO_ESTILOS } from '../ui/paso-estilos';

@Component({
  selector: 'mob-crear-direccion',
  standalone: true,
  imports: [PasoShellComponent, DireccionSelectorComponent],
  template: `
    <mob-paso-shell [deshabilitado]="!puedeSeguir()" (volver)="volver()" (siguiente)="siguiente()">
      <p class="paso ui-overline">Paso 2 de 3</p>
      <h2 class="titulo ui-h2">Selecciona una dirección</h2>
      <mob-direccion-selector [direccion]="borrador.borrador().direccion" [radio]="borrador.borrador().radioAviso"
        (elegir)="borrador.parchar({ direccion: $event })" />
    </mob-paso-shell>
  `,
  styles: [PASO_ESTILOS],
})
export class CrearDireccionPage {
  readonly borrador = inject(BorradorStore);
  private readonly router = inject(Router);
  readonly puedeSeguir = computed(() => !!this.borrador.borrador().titulo.trim() && this.borrador.borrador().tipoUbicacion === 'direccion' && !!this.borrador.borrador().direccion?.trim());
  volver(): void { void this.router.navigate(['/crear/que-y-donde']); }
  siguiente(): void { if (this.puedeSeguir()) void this.router.navigate(['/crear/confirmar']); }
}
