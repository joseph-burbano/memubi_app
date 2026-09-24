import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BotonComponent } from '../../../ui/boton';
import { PendientesStore } from '../../../core/store/pendientes.store';
import { LocationService } from '../../../core/data/location.service';
import { Pendiente } from '../../../core/models/pendiente.model';
import { PendienteCardWebComponent } from '../ui/pendiente-card.web';
import { MapaPendientesWebComponent } from '../ui/mapa-pendientes.web';
import { AvisoGuardadoWebComponent } from '../ui/aviso-guardado.web';

/** MW0, MW1, MW1b, MW1d y MW1e: estados de la misma ruta. */
let totalAntesDeCrear: number | null = null;

@Component({
  selector: 'app-web-lista',
  standalone: true,
  imports: [BotonComponent, PendienteCardWebComponent, MapaPendientesWebComponent, AvisoGuardadoWebComponent],
  templateUrl: './lista.page.html',
  styleUrl: './lista.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaPage implements OnInit {
  private readonly router = inject(Router);
  private readonly ubicacion = inject(LocationService);
  readonly pendientes = inject(PendientesStore);
  readonly vista = signal<'lista' | 'mapa'>('lista');
  readonly mostrarAvisoGuardado = signal(false);
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

  /** Ionic conserva la página al abrir /crear; este hook corre al regresar. */
  ionViewWillEnter(): void {
    if (totalAntesDeCrear !== null) {
      this.mostrarAvisoGuardado.set(this.pendientes.pendientes().length > totalAntesDeCrear);
      totalAntesDeCrear = null;
    }
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
    if (vista === 'mapa') this.mostrarAvisoGuardado.set(false);
    this.vista.set(vista);
  }

  cambiarEstado(pendiente: Pendiente): void {
    const estado = pendiente.estado === 'activo' ? 'realizado' : 'activo';
    void this.pendientes.actualizar(pendiente.id, { estado });
  }

  irACrear(): void {
    totalAntesDeCrear = this.pendientes.pendientes().length;
    void this.router.navigate(['/crear']);
  }
}
