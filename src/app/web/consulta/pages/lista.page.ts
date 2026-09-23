import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

/** MW0: estado inicial de Mis pendientes. MW1 se incorporará a esta ruta. */
@Component({
  selector: 'app-web-lista',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './lista.page.html',
  styleUrl: './lista.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaPage {}
