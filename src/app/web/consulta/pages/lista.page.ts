import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BotonComponent } from '../../../ui/boton';

/** MW0: estado inicial de Mis pendientes. MW1 se incorporará a esta ruta. */
@Component({
  selector: 'app-web-lista',
  standalone: true,
  imports: [BotonComponent],
  templateUrl: './lista.page.html',
  styleUrl: './lista.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaPage {
  private readonly router = inject(Router);

  irACrear(): void {
    void this.router.navigate(['/crear']);
  }
}
