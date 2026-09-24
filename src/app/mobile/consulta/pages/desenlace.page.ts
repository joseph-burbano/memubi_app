import { Component, OnInit, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { BarraSuperiorComponent } from '../../ui/barra-superior';
import { AnillosProximidadComponent } from '../../ui/anillos-proximidad';
import { BotonComponent } from '../../../ui/boton';
import { PendientesStore } from '../../../core/store/pendientes.store';
import { nombreCategoria } from '../../../core/models/categoria.model';

/** Las dos salidas de la alerta. */
export type Desenlace = 'realizado' | 'sigue-activo';

/**
 * Desenlace de la alerta. `MM21` y `MM22`.
 *
 * DOS MARCOS, UNA PÁGINA. Son idénticos en estructura —barra, anillos,
 * título, nombre del pendiente en `Body/Large`, nota y un solo botón— y
 * solo cambian el texto y lo que ya ocurrió antes de llegar:
 *
 *   MM21  "Pendiente realizado"        el pendiente pasó a completado
 *   MM22  "El pendiente sigue activo"  no se tocó; se reintentará luego
 *
 * El cambio de estado NO se hace aquí: lo hace `alerta.page` antes de
 * navegar. Esta página solo cuenta lo que pasó, y por eso puede ser una.
 *
 * SIN ÁMBAR, en los dos casos. La alerta lo usa porque está pidiendo
 * algo; aquí ya se resolvió y el color vuelve al teal. Si el ámbar
 * acompañara también al final del flujo, dejaría de señalar el momento
 * en que hay que actuar.
 */
@Component({
  selector: 'mob-desenlace',
  standalone: true,
  imports: [BarraSuperiorComponent, AnillosProximidadComponent, BotonComponent],
  template: `
    <div class="pantalla">
      <mob-barra-superior />

      <main class="desenlace">
        <div class="desenlace__ilustracion">
          <mob-anillos-proximidad [tamano]="204" />
        </div>

        <h2 class="desenlace__titulo">{{ titulo() }}</h2>

        @if (pendiente(); as p) {
          <p class="desenlace__pendiente">{{ p.titulo }}</p>
        }

        <p class="desenlace__nota">{{ nota() }}</p>

        <div class="desenlace__acciones">
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
        height: 100dvh;
        /* Transparente para que se vea la textura del fondo. */
        background: transparent;
      }
      .desenlace {
        display: flex;
        min-height: 0;
        overflow-y: auto;
        flex-direction: column;
        flex: 1;
        padding: 0 1.25rem;
        /* 48px de aire bajo el botón: en MM21 termina en 648 de 696, no
         * pegado al borde. */
        padding-bottom: calc(3rem + env(safe-area-inset-bottom, 0px));
        text-align: center;
      }
      .desenlace__ilustracion {
        display: flex;
        justify-content: center;
        padding: 3.25rem 0 1rem;
      }
      .desenlace__titulo {
        margin: 0;
        font: 600 var(--ui-h2-size) / var(--ui-h2-line) var(--ui-font);
        letter-spacing: var(--ui-h2-track);
        color: var(--ui-text-primary);
      }
      /* Body/Large: el mockup lo trata como un eco de lo que acabas de
       * hacer, no como un encabezado. */
      .desenlace__pendiente {
        margin: 0.5rem 0 0;
        font: 400 var(--ui-body-lg-size) / var(--ui-body-lg-line) var(--ui-font);
        color: var(--ui-text-secondary);
      }
      .desenlace__nota {
        margin: 1.25rem 0 0;
        font: 400 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-text-secondary);
      }
      .desenlace__acciones {
        margin-top: auto;
        padding-top: 2rem;
      }
    `,
  ],
})
export class DesenlacePage implements OnInit {
  private readonly store = inject(PendientesStore);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  /** Se puede aterrizar aquí sin pasar por la lista. */
  ngOnInit(): void {
    void this.store.asegurarCargado();
  }
  /** Llega por `data` de la ruta, no por la URL: es parte del recorrido. */
  readonly desenlace = input.required<Desenlace>();

  readonly pendiente = computed(() => this.store.porId(this.id()));

  readonly titulo = computed(() =>
    this.desenlace() === 'realizado'
      ? 'Pendiente realizado'
      : 'El pendiente sigue activo',
  );

  readonly nota = computed(() => {
    if (this.desenlace() === 'realizado') {
      return 'Este pendiente dejará de estar activo y ya no te avisaremos.';
    }
    const p = this.pendiente();
    if (p?.tipoUbicacion === 'categoria') {
      const cat = nombreCategoria(p.categoria!).toLowerCase();
      return `Te lo recordaremos cuando estés cerca de otro ${cat}.`;
    }
    return 'Te lo recordaremos la próxima vez que pases cerca.';
  });

  /** MM21 -> MM13 · MM22 -> MM12. Las dos vuelven a la misma lista. */
  volver(): void {
    void this.router.navigate(['/pendientes']);
  }
}
