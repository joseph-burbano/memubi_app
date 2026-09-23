import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BarraSuperiorComponent } from '../../ui/barra-superior';
import { AnillosProximidadComponent } from '../../ui/anillos-proximidad';
import { BarraAccionesComponent } from '../ui/barra-acciones';
import { PendienteCardMobileComponent } from '../ui/pendiente-card.mobile';
import { PendientesStore } from '../../../core/store/pendientes.store';

/**
 * Mis pendientes. `MM12`, y `MM03` cuando la lista está vacía.
 *
 * UNA PÁGINA, DOS ESTADOS. Son dos marcos en Figma, pero comparten
 * barra superior, título, barra inferior y hasta el mismo `h1`: lo único
 * que cambia es el cuerpo. Hacer dos componentes obligaría a mantener
 * dos copias de todo lo demás.
 *
 * Es el mismo criterio que aplica en web a `MW2`, donde ocho marcos son
 * una sola página. Si vas a crear un archivo por marco, relee esto.
 *
 * El subtítulo sí cambia entre estados: el mockup del vacío explica qué
 * va a pasar, y el de la lista cuenta cuántos hay.
 */
@Component({
  selector: 'mob-pendientes',
  standalone: true,
  imports: [
    BarraSuperiorComponent,
    AnillosProximidadComponent,
    BarraAccionesComponent,
    PendienteCardMobileComponent,
  ],
  template: `
    <div class="pantalla">
      <mob-barra-superior />

      <main class="lista">
        <h1 class="lista__titulo">Mis pendientes</h1>

        @if (store.cargando()) {
          <p class="lista__subtitulo">Cargando…</p>
        } @else if (store.estaVacio()) {
          <!-- MM03 -->
          <p class="lista__subtitulo">
            Todavía no tienes pendientes. Crea el primero y te avisaremos cuando
            pases cerca del lugar.
          </p>

          <section class="vacio">
            <div class="vacio__ilustracion">
              <mob-anillos-proximidad [tamano]="204" />
            </div>
            <h2 class="vacio__titulo">Aquí aparecerán tus pendientes</h2>
            <p class="vacio__texto">
              Cada uno se activa cuando pasas cerca del lugar que elijas.
            </p>
          </section>
        } @else {
          <!-- MM12 -->
          <p class="lista__subtitulo">{{ subtitulo() }}</p>

          <ul class="lista__items">
            @for (pendiente of store.pendientes(); track pendiente.id) {
              <li>
                <mob-pendiente-card [pendiente]="pendiente" (abrir)="abrir($event)" />
              </li>
            }
          </ul>
        }
      </main>

      <mob-barra-acciones />
    </div>
  `,
  styles: [
    `
      .pantalla {
        display: flex;
        flex-direction: column;
        height: 100dvh;
        background: var(--ui-surface-alt);
      }
      .lista {
        flex: 1;
        overflow-y: auto;
        padding: 1.75rem 1.25rem 1.25rem;
      }
      .lista__titulo {
        margin: 0;
        font: 600 var(--ui-h2-size) / var(--ui-h2-line) var(--ui-font);
        letter-spacing: var(--ui-h2-track);
        color: var(--ui-text-primary);
      }
      .lista__subtitulo {
        margin: 0.5rem 0 0;
        font: 400 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-text-secondary);
      }
      .lista__items {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin: 1.5rem 0 0;
        padding: 0;
        list-style: none;
      }

      /* --- Estado vacío · MM03 --- */
      .vacio {
        margin-top: 1.5rem;
        padding: 1.25rem;
        background: var(--ui-surface);
        border: 1px solid var(--ui-border);
        border-radius: var(--ui-radius-md);
        text-align: center;
      }
      .vacio__ilustracion {
        display: flex;
        justify-content: center;
      }
      .vacio__titulo {
        margin: 0.5rem 0 0;
        font: 600 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-text-primary);
      }
      .vacio__texto {
        margin: 0.5rem 0 0;
        font: 400 var(--ui-caption-size) / var(--ui-caption-line) var(--ui-font);
        letter-spacing: var(--ui-caption-track);
        color: var(--ui-text-secondary);
      }
    `,
  ],
})
export class PendientesPage implements OnInit {
  readonly store = inject(PendientesStore);
  private readonly router = inject(Router);

  ngOnInit(): void {
    void this.store.cargar();
  }

  /** MM12 -> MM14 (categoría) o MM15 (dirección), según el pendiente. */
  abrir(id: string): void {
    void this.router.navigate(['/pendientes', id]);
  }

  subtitulo(): string {
    const n = this.store.activos().length;
    return n === 1 ? 'Un pendiente activo.' : `${n} pendientes activos.`;
  }
}
