import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CabeceraPrivacidadWebComponent } from '../ui/cabecera-privacidad.web';

/** MW6: información de privacidad y datos de la consulta web. */
@Component({
  selector: 'app-web-privacidad',
  standalone: true,
  imports: [RouterLink, CabeceraPrivacidadWebComponent],
  templateUrl: './privacidad.page.html',
  styleUrl: './privacidad.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacidadPage {}
