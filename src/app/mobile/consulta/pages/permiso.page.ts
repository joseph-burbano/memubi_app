import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BarraSuperiorComponent } from '../../ui/barra-superior';
import { AnillosProximidadComponent } from '../../ui/anillos-proximidad';
import { BotonComponent } from '../../../ui/boton';

/**
 * `MM01 · Permiso de ubicación`. Lo primero que ve quien instala la app.
 *
 * NO PIDE EL PERMISO DE VERDAD. Es un prototipo no funcional: los dos
 * botones navegan y nada más. Cuando el producto sea real, aquí entra
 * `Geolocation.requestPermissions()` de Capacitor y el flujo aparte de
 * `ACCESS_BACKGROUND_LOCATION`, que en Android 10+ se pide por separado.
 *
 * El segundo párrafo, el de segundo plano, está en el mockup y va aunque
 * parezca repetitivo: es la advertencia que evita que el usuario acepte
 * el permiso básico y luego no reciba ningún aviso.
 */
@Component({
  selector: 'mob-permiso',
  standalone: true,
  imports: [BarraSuperiorComponent, AnillosProximidadComponent, BotonComponent],
  template: `
    <div class="pantalla">
      <mob-barra-superior />

      <main class="permiso">
        <div class="permiso__ilustracion">
          <mob-anillos-proximidad [tamano]="304" />
        </div>

        <h1 class="permiso__titulo">Recordatorios cuando estés cerca</h1>

        <p class="permiso__texto">
          Para avisarte cuando estés cerca de un lugar relacionado con tus
          pendientes, la aplicación necesita acceder a tu ubicación.
        </p>

        <p class="permiso__nota">
          Para recibir recordatorios aunque no tengas la aplicación abierta,
          también puede ser necesario permitir el acceso en segundo plano.
        </p>

        <div class="permiso__acciones">
          <ui-boton variante="primario" anchoCompleto (click)="continuar()">
            Continuar
          </ui-boton>
          <button class="permiso__ahora-no" type="button" (click)="ahoraNo()">
            Ahora no
          </button>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .pantalla {
        display: flex;
        flex-direction: column;
        min-height: 100dvh;
        background: var(--ui-surface-alt);
      }
      .permiso {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 0 1.25rem;
        padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
      }
      .permiso__ilustracion {
        display: flex;
        justify-content: center;
        padding: 2.5rem 0 1rem;
      }
      .permiso__titulo {
        margin: 0;
        font: 600 var(--ui-h2-size) / var(--ui-h2-line) var(--ui-font);
        letter-spacing: var(--ui-h2-track);
        color: var(--ui-text-primary);
        text-align: center;
      }
      .permiso__texto {
        margin: 1.5rem 0 0;
        font: 400 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-text-secondary);
      }
      .permiso__nota {
        margin: 1.5rem 0 0;
        font: 400 var(--ui-caption-size) / var(--ui-caption-line) var(--ui-font);
        letter-spacing: var(--ui-caption-track);
        color: var(--ui-text-secondary);
      }
      /* Empuja las acciones al pie sin fijarlas: si el usuario sube el
       * tamaño de letra del sistema, el texto crece y la pantalla hace
       * scroll en vez de recortarse. */
      .permiso__acciones {
        margin-top: auto;
        padding-top: 2rem;
      }
      .permiso__ahora-no {
        width: 100%;
        min-height: 2.75rem;
        margin-top: 1rem;
        background: none;
        border: none;
        font: 600 var(--ui-button-size) / var(--ui-button-line) var(--ui-font);
        letter-spacing: var(--ui-button-track);
        color: var(--ui-brand);
        cursor: pointer;
      }
    `,
  ],
})
export class PermisoPage {
  constructor(private readonly router: Router) {}

  /** MM01 → MM03 */
  continuar(): void {
    this.router.navigate(['/pendientes']);
  }

  /** MM01 → MM02 · Desactivar ubicación. Todavía no existe. */
  ahoraNo(): void {
    this.router.navigate(['/pendientes']);
  }
}
