import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BorradorStore } from '../../../core/store/borrador.store';
import { TipoUbicacion } from '../../../core/models/pendiente.model';
import { CampoComponent } from '../../../ui/campo';
import { PasoShellComponent } from '../ui/paso-shell';
import { TipoUbicacionComponent } from '../ui/tipo-ubicacion';
import { PASO_ESTILOS } from '../ui/paso-estilos';

/** MM04/MM04b: la rama elegida cambia el estado, no la ruta. */
@Component({
  selector: 'mob-crear-que-y-donde',
  standalone: true,
  imports: [FormsModule, CampoComponent, PasoShellComponent, TipoUbicacionComponent],
  template: `
    <mob-paso-shell textoVolver="Cancelar" [deshabilitado]="!puedeSeguir()"
      (volver)="cancelar()" (siguiente)="siguiente()">
      <p class="paso ui-overline">Paso 1 de 3</p>
      <ui-campo etiqueta="¿Qué necesitas recordar?" marcador="¿Qué necesitas recordar?"
        [ngModel]="borrador.borrador().titulo" (ngModelChange)="escribirTitulo($event)" />
      <div class="campo-grupo">
        <p class="rotulo ui-label-field">¿Dónde quieres recibir este recordatorio?</p>
        <mob-tipo-ubicacion [tipo]="borrador.borrador().tipoUbicacion" (elegir)="elegirTipo($event)" />
      </div>
    </mob-paso-shell>
  `,
  styles: [PASO_ESTILOS],
})
export class CrearQueYDondePage {
  readonly borrador = inject(BorradorStore);
  private readonly router = inject(Router);
  readonly puedeSeguir = computed(() => !!this.borrador.borrador().titulo.trim() && !!this.borrador.borrador().tipoUbicacion);

  escribirTitulo(titulo: string): void { this.borrador.parchar({ titulo }); }
  elegirTipo(tipo: TipoUbicacion): void { this.borrador.elegirTipo(tipo); }
  cancelar(): void { this.borrador.limpiar(); void this.router.navigate(['/pendientes']); }
  siguiente(): void {
    if (!this.puedeSeguir()) return;
    void this.router.navigate(['/crear', this.borrador.borrador().tipoUbicacion]);
  }
}
