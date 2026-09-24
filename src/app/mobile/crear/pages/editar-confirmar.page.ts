import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BorradorStore } from '../../../core/store/borrador.store';
import { PendientesStore } from '../../../core/store/pendientes.store';
import { PasoShellComponent } from '../ui/paso-shell';
import { ResumenPendienteComponent } from '../ui/resumen-pendiente';
import { PASO_ESTILOS } from '../ui/paso-estilos';

@Component({
  selector: 'mob-editar-confirmar',
  standalone: true,
  imports: [PasoShellComponent, ResumenPendienteComponent],
  template: `
    <mob-paso-shell titulo="Editar pendiente" textoSiguiente="Guardar cambios"
      [deshabilitado]="!borrador.estaCompleto() || guardando()"
      (volver)="volver()" (siguiente)="guardar()">
      <p class="paso ui-overline">Editar</p>
      <h2 class="titulo ui-h2">Revisa los cambios</h2>
      @if (borrador.estaCompleto()) { <mob-resumen-pendiente [borrador]="borrador.borrador()" /> }
    </mob-paso-shell>
  `,
  styles: [PASO_ESTILOS],
})
export class EditarConfirmarPage {
  readonly id = input.required<string>();
  readonly borrador = inject(BorradorStore);
  private readonly pendientes = inject(PendientesStore);
  private readonly router = inject(Router);
  readonly guardando = signal(false);

  volver(): void {
    void this.router.navigate(['/editar', this.id()], {
      queryParams: { preservar: 1, paso: this.borrador.borrador().tipoUbicacion },
    });
  }
  async guardar(): Promise<void> {
    if (!this.borrador.estaCompleto() || this.guardando()) return;
    this.guardando.set(true);
    try {
      await this.pendientes.actualizar(this.id(), this.borrador.aPendiente());
      this.borrador.limpiar();
      await this.router.navigate(['/pendientes', this.id()]);
    } finally {
      this.guardando.set(false);
    }
  }
}
