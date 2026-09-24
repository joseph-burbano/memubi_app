import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BorradorStore } from '../../../core/store/borrador.store';
import { PendientesStore } from '../../../core/store/pendientes.store';
import { PasoShellComponent } from '../ui/paso-shell';
import { ResumenPendienteComponent } from '../ui/resumen-pendiente';
import { PASO_ESTILOS } from '../ui/paso-estilos';

@Component({
  selector: 'mob-crear-confirmar',
  standalone: true,
  imports: [PasoShellComponent, ResumenPendienteComponent],
  template: `
    <mob-paso-shell textoSiguiente="Guardar" [deshabilitado]="!borrador.estaCompleto() || guardando()"
      (volver)="volver()" (siguiente)="guardar()">
      <p class="paso ui-overline">Paso 3 de 3</p>
      <h2 class="titulo ui-h2">Revisa tu pendiente</h2>
      @if (borrador.estaCompleto()) { <mob-resumen-pendiente [borrador]="borrador.borrador()" /> }
    </mob-paso-shell>
  `,
  styles: [PASO_ESTILOS],
})
export class CrearConfirmarPage {
  readonly borrador = inject(BorradorStore);
  private readonly pendientes = inject(PendientesStore);
  private readonly router = inject(Router);
  readonly guardando = signal(false);

  volver(): void {
    void this.router.navigate(['/crear', this.borrador.borrador().tipoUbicacion ?? 'que-y-donde']);
  }
  async guardar(): Promise<void> {
    if (!this.borrador.estaCompleto() || this.guardando()) return;
    this.guardando.set(true);
    try {
      await this.pendientes.guardar(this.borrador.aPendiente());
      this.borrador.limpiar();
      await this.router.navigate(['/pendientes'], { state: { pendienteGuardado: true } });
    } finally {
      this.guardando.set(false);
    }
  }
}
