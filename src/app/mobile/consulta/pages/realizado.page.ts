import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { BarraSuperiorComponent } from '../../ui/barra-superior';
import { AnillosProximidadComponent } from '../../ui/anillos-proximidad';
import { BotonComponent } from '../../../ui/boton';
import { PendientesStore } from '../../../core/store/pendientes.store';

/**
 * Pendiente realizado. `MM21`. Cierra el flujo de la alerta.
 *
 * SIN ÁMBAR, a propósito. La alerta usa ámbar porque está pidiendo algo;
 * aquí ya se resolvió y el color vuelve al teal del sistema. Es la regla
 * del ámbar reservado: si acompañara también al final del flujo, dejaría
 * de señalar el momento en que hay que actuar.
 *
 * El título del pendiente va en `Body/Large` (19px) y no en el cuerpo de
 * 17: el mockup lo trata como un eco de lo que acabas de hacer, no como
 * un encabezado.
 */
@Component({
  selector: 'mob-realizado',
  standalone: true,
  imports: [BarraSuperiorComponent, AnillosProximidadComponent, BotonComponent],
  template: `
    <div class="pantalla">
      <mob-barra-superior />

      <main class="realizado">
        <div class="realizado__ilustracion">
          <mob-anillos-proximidad [tamano]="204" />
        </div>

        <h2 class="realizado__titulo">Pendiente realizado</h2>

        @if (pendiente(); as p) {
          <p class="realizado__pendiente">{{ p.titulo }}</p>
        }

        <p class="realizado__nota">
          Este pendiente dejará de estar activo y ya no te avisaremos.
        </p>

        <div class="realizado__acciones">
          <ui-boton variante="primario" anchoCompleto (click)="volver()">
            Volver a Mis pendientes
          </ui-boton>
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
      .realizado {
        display: flex;
        flex-direction: column;
        flex: 1;
        padding: 0 1.25rem;
        padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
        text-align: center;
      }
      .realizado__ilustracion {
        display: flex;
        justify-content: center;
        padding: 3.25rem 0 1rem;
      }
      .realizado__titulo {
        margin: 0;
        font: 600 var(--ui-h2-size) / var(--ui-h2-line) var(--ui-font);
        letter-spacing: var(--ui-h2-track);
        color: var(--ui-text-primary);
      }
      .realizado__pendiente {
        margin: 0.5rem 0 0;
        font: 400 var(--ui-body-lg-size) / var(--ui-body-lg-line) var(--ui-font);
        color: var(--ui-text-secondary);
      }
      .realizado__nota {
        margin: 1.25rem 0 0;
        font: 400 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-text-secondary);
      }
      .realizado__acciones {
        margin-top: auto;
        padding-top: 2rem;
      }
    `,
  ],
})
export class RealizadoPage {
  private readonly store = inject(PendientesStore);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  readonly pendiente = computed(() => this.store.porId(this.id()));

  /** MM21 -> MM13: la lista, ya con el pendiente marcado. */
  volver(): void {
    void this.router.navigate(['/pendientes']);
  }
}
