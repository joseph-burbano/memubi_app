import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CATEGORIAS, Categoria } from '../../../core/models/categoria.model';
import { TipoUbicacion } from '../../../core/models/pendiente.model';
import { BorradorStore } from '../../../core/store/borrador.store';
import { PendientesStore } from '../../../core/store/pendientes.store';
import { CampoComponent } from '../../../ui/campo';
import { TileCategoriaComponent } from '../../../ui/tile-categoria';
import { PasoShellComponent } from '../ui/paso-shell';
import { TipoUbicacionComponent } from '../ui/tipo-ubicacion';
import { DireccionSelectorComponent } from '../ui/direccion-selector';
import { PASO_ESTILOS } from '../ui/paso-estilos';

type PasoEdicion = 'inicio' | 'categoria' | 'direccion';

/** MM16/MM17 con sus estados de selección MM16b/MM17b. */
@Component({
  selector: 'mob-editar-pendiente',
  standalone: true,
  imports: [FormsModule, CampoComponent, TileCategoriaComponent, PasoShellComponent, TipoUbicacionComponent, DireccionSelectorComponent],
  template: `
    @if (cargado()) {
      <mob-paso-shell titulo="Editar pendiente" [deshabilitado]="!puedeSeguir()"
        (volver)="volver()" (siguiente)="siguiente()">
        <p class="paso ui-overline">Editar</p>
        @switch (paso()) {
          @case ('inicio') {
            <ui-campo etiqueta="¿Qué necesitas recordar?" [ngModel]="borrador.borrador().titulo"
              (ngModelChange)="borrador.parchar({ titulo: $event })" />
            <div class="campo-grupo">
              <p class="rotulo ui-label-field">¿Dónde quieres recibir este recordatorio?</p>
              <mob-tipo-ubicacion [tipo]="borrador.borrador().tipoUbicacion" (elegir)="elegirTipo($event)" />
            </div>
          }
          @case ('categoria') {
            <h2 class="titulo ui-h2">Selecciona una categoría</h2>
            <p class="ayuda ui-body">El pendiente se activará cuando estés cerca de cualquier lugar de esta categoría.</p>
            <div class="rejilla" role="radiogroup" aria-label="Categoría del lugar">
              @for (categoria of categorias; track categoria.id) {
                <ui-tile-categoria cuadriculaMovil [categoria]="categoria.id" [nombre]="categoria.nombre"
                  [seleccionada]="borrador.borrador().categoria === categoria.id" (elegir)="elegirCategoria($event)" />
              }
            </div>
          }
          @case ('direccion') {
            <h2 class="titulo ui-h2">Selecciona una dirección</h2>
            <mob-direccion-selector [direccion]="borrador.borrador().direccion" [radio]="borrador.borrador().radioAviso"
              (elegir)="borrador.parchar({ direccion: $event })" />
          }
        }
      </mob-paso-shell>
    }
  `,
  styles: [PASO_ESTILOS, `.rejilla { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--ui-space-4); }`],
})
export class EditarPage implements OnInit {
  readonly id = input.required<string>();
  readonly borrador = inject(BorradorStore);
  private readonly pendientes = inject(PendientesStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly categorias = CATEGORIAS;
  readonly cargado = signal(false);
  readonly paso = signal<PasoEdicion>('inicio');
  readonly puedeSeguir = computed(() => {
    const b = this.borrador.borrador();
    if (!b.titulo.trim() || !b.tipoUbicacion) return false;
    return this.paso() === 'inicio' || (b.tipoUbicacion === 'categoria' ? !!b.categoria : !!b.direccion?.trim());
  });

  async ngOnInit(): Promise<void> {
    const preservar = this.route.snapshot.queryParamMap.get('preservar') === '1';
    if (!preservar) {
      await this.pendientes.asegurarCargado();
      const pendiente = this.pendientes.porId(this.id());
      if (!pendiente) { void this.router.navigate(['/pendientes']); return; }
      this.borrador.cargarDesde(pendiente);
    }
    this.paso.set(this.route.snapshot.queryParamMap.get('paso') === 'direccion' ? 'direccion' :
      this.route.snapshot.queryParamMap.get('paso') === 'categoria' ? 'categoria' : 'inicio');
    this.cargado.set(true);
  }

  elegirTipo(tipo: TipoUbicacion): void { this.borrador.elegirTipo(tipo); }
  elegirCategoria(categoria: Categoria): void { this.borrador.parchar({ categoria }); }
  volver(): void {
    if (this.paso() !== 'inicio') { this.paso.set('inicio'); return; }
    this.borrador.limpiar();
    void this.router.navigate(['/pendientes', this.id()]);
  }
  siguiente(): void {
    if (!this.puedeSeguir()) return;
    if (this.paso() === 'inicio') {
      this.paso.set(this.borrador.borrador().tipoUbicacion!);
      return;
    }
    void this.router.navigate(['/editar', this.id(), 'confirmar']);
  }
}
