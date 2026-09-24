import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BotonComponent } from '../../../ui/boton';
import { PendientesStore } from '../../../core/store/pendientes.store';
import { LocationService } from '../../../core/data/location.service';
import { Pendiente } from '../../../core/models/pendiente.model';
import { PendienteCardWebComponent } from '../ui/pendiente-card.web';
import { MapaPendientesWebComponent } from '../ui/mapa-pendientes.web';

/** MW0, MW1, MW1b y MW1d: estados de la misma ruta. */
@Component({
  selector: 'app-web-lista',
  standalone: true,
  imports: [BotonComponent, PendienteCardWebComponent, MapaPendientesWebComponent],
  templateUrl: './lista.page.html',
  styleUrl: './lista.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaPage implements OnInit {
  private readonly router = inject(Router);
  private readonly ubicacion = inject(LocationService);
  readonly pendientes = inject(PendientesStore);
  readonly vista = signal<'lista' | 'mapa'>('lista');
  readonly cercanos = signal<ReadonlySet<string>>(new Set());
  readonly completados = computed(() => this.pendientes.pendientes().filter((p) => p.estado === 'realizado'));
  readonly resumenCompletados = computed(() => {
    const activos = this.pendientes.activos().length;
    const completados = this.completados().length;
    const cantidades = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco'];
    const activosTexto = activos === 1 ? 'Un' : (cantidades[activos] ?? String(activos)).replace(/^./, (c) => c.toUpperCase());
    const completadosTexto = cantidades[completados] ?? String(completados);
    return `${activosTexto} pendiente${activos === 1 ? '' : 's'} activo${activos === 1 ? '' : 's'} y ${completadosTexto} completado${completados === 1 ? '' : 's'}.`;
  });
  private calculoCercania = 0;

  constructor() {
    effect(() => {
      void this.actualizarCercanos(this.pendientes.activos());
    });
  }

  async ngOnInit(): Promise<void> {
    await this.pendientes.asegurarCargado();
  }

  private async actualizarCercanos(activos: readonly Pendiente[]): Promise<void> {
    const calculoActual = ++this.calculoCercania;
    const ids = await Promise.all(activos.map(async (pendiente) => {
      if (pendiente.tipoUbicacion !== 'categoria' || !pendiente.categoria) return null;
      const lugares = await this.ubicacion.lugaresCercanos(pendiente.categoria);
      return lugares.some((lugar) => lugar.distanciaMetros <= pendiente.radioAviso)
        ? pendiente.id
        : null;
    }));
    if (calculoActual === this.calculoCercania) {
      this.cercanos.set(new Set(ids.filter((id): id is string => id !== null)));
    }
  }

  seleccionarVista(vista: 'lista' | 'mapa'): void {
    if (vista === 'mapa' && this.pendientes.activos().length === 0) return;
    this.vista.set(vista);
  }

  cambiarEstado(pendiente: Pendiente): void {
    const estado = pendiente.estado === 'activo' ? 'realizado' : 'activo';
    void this.pendientes.actualizar(pendiente.id, { estado });
  }

  irACrear(): void {
    void this.router.navigate(['/crear']);
  }
}
