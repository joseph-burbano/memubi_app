import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BotonComponent } from '../../../ui/boton';
import { PendientesStore } from '../../../core/store/pendientes.store';
import { PendienteCardWebComponent } from '../ui/pendiente-card.web';

/** MW0 y MW1: estados vacío y con pendientes de la misma ruta. */
@Component({
  selector: 'app-web-lista',
  standalone: true,
  imports: [BotonComponent, PendienteCardWebComponent],
  templateUrl: './lista.page.html',
  styleUrl: './lista.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaPage implements OnInit {
  private readonly router = inject(Router);
  readonly pendientes = inject(PendientesStore);

  async ngOnInit(): Promise<void> {
    await this.pendientes.asegurarCargado();
  }

  irACrear(): void {
    void this.router.navigate(['/crear']);
  }
}
