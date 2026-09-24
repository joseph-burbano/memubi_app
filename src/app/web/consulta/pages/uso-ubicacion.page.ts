import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BotonComponent } from '../../../ui/boton';
import { CabeceraPrivacidadWebComponent } from '../ui/cabecera-privacidad.web';

/** MW7: explicación de cómo se usa la ubicación en el producto. */
@Component({
  selector: 'app-web-uso-ubicacion',
  standalone: true,
  imports: [RouterLink, BotonComponent, CabeceraPrivacidadWebComponent],
  templateUrl: './uso-ubicacion.page.html',
  styleUrl: './uso-ubicacion.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsoUbicacionPage {
  private readonly router = inject(Router);

  volver(): void {
    void this.router.navigate(['/privacidad']);
  }
}
