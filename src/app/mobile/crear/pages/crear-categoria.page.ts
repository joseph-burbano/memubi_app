import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CATEGORIAS, Categoria } from '../../../core/models/categoria.model';
import { BorradorStore } from '../../../core/store/borrador.store';
import { TileCategoriaComponent } from '../../../ui/tile-categoria';
import { PasoShellComponent } from '../ui/paso-shell';
import { PASO_ESTILOS } from '../ui/paso-estilos';

/** MM05/MM06: escoger marca la tarjeta; Siguiente navega. */
@Component({
  selector: 'mob-crear-categoria',
  standalone: true,
  imports: [TileCategoriaComponent, PasoShellComponent],
  template: `
    <mob-paso-shell [deshabilitado]="!puedeSeguir()" (volver)="volver()" (siguiente)="siguiente()">
      <p class="paso ui-overline">Paso 2 de 3</p>
      <h2 class="titulo ui-h2">Selecciona una categoría</h2>
      <p class="ayuda ui-body">El pendiente se activará cuando estés cerca de cualquier lugar de esta categoría.</p>
      <div class="rejilla" role="radiogroup" aria-label="Categoría del lugar">
        @for (categoria of categorias; track categoria.id) {
          <ui-tile-categoria cuadriculaMovil [categoria]="categoria.id" [nombre]="categoria.nombre"
            [seleccionada]="borrador.borrador().categoria === categoria.id" (elegir)="elegir($event)" />
        }
      </div>
    </mob-paso-shell>
  `,
  styles: [PASO_ESTILOS, `.rejilla { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--ui-space-4); }`],
})
export class CrearCategoriaPage {
  readonly borrador = inject(BorradorStore);
  private readonly router = inject(Router);
  readonly categorias = CATEGORIAS;
  readonly puedeSeguir = computed(() => !!this.borrador.borrador().titulo.trim() && this.borrador.borrador().tipoUbicacion === 'categoria' && !!this.borrador.borrador().categoria);

  elegir(categoria: Categoria): void { this.borrador.parchar({ categoria }); }
  volver(): void { void this.router.navigate(['/crear/que-y-donde']); }
  siguiente(): void { if (this.puedeSeguir()) void this.router.navigate(['/crear/confirmar']); }
}
