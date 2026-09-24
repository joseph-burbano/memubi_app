import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PendientesStore } from '../../../core/store/pendientes.store';
import { Pendiente } from '../../../core/models/pendiente.model';
import { nombreCategoria } from '../../../core/models/categoria.model';
import { RADIOS } from '../../../core/models/radio.model';
import { BotonComponent } from '../../../ui/boton';
import { ChipComponent } from '../../../ui/chip';
import { MapaDetalleWebComponent } from '../ui/mapa-detalle.web';

/** MW4 y MW4b: detalle web de un pendiente por categoría o dirección. */
@Component({
  selector: 'app-web-detalle',
  standalone: true,
  imports: [RouterLink, BotonComponent, ChipComponent, MapaDetalleWebComponent],
  templateUrl: './detalle.page.html',
  styleUrl: './detalle.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetallePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly parametros = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  readonly pendientes = inject(PendientesStore);
  readonly pendiente = computed(() => this.pendientes.porId(this.parametros().get('id') ?? ''));

  async ngOnInit(): Promise<void> {
    await this.pendientes.asegurarCargado();
    if (!this.pendiente()) void this.router.navigate(['/pendientes']);
  }

  tipoUbicacion(pendiente: Pendiente): string {
    return pendiente.tipoUbicacion === 'categoria'
      ? 'Cualquier lugar de una categoría'
      : 'Una dirección específica';
  }

  lugar(pendiente: Pendiente): string {
    return pendiente.tipoUbicacion === 'categoria' && pendiente.categoria
      ? nombreCategoria(pendiente.categoria)
      : pendiente.direccion ?? '';
  }

  radio(pendiente: Pendiente): string {
    const radio = RADIOS.find((opcion) => opcion.valor === pendiente.radioAviso);
    return radio ? `${radio.etiqueta} · ${radio.ayuda}` : '';
  }

  comportamiento(pendiente: Pendiente): string {
    if (pendiente.tipoUbicacion === 'categoria' && pendiente.categoria) {
      return `Te recordaremos este pendiente cuando estés cerca de cualquier ${nombreCategoria(pendiente.categoria).toLowerCase()}.`;
    }
    return `Te recordaremos este pendiente cuando estés cerca de ${this.direccionCorta(pendiente)}.`;
  }

  private direccionCorta(pendiente: Pendiente): string {
    return (pendiente.direccion ?? '').split(',')[0].trim();
  }

  volver(): void {
    void this.router.navigate(['/pendientes']);
  }

  editar(pendiente: Pendiente): void {
    void this.router.navigate(['/editar', pendiente.id]);
  }
}
