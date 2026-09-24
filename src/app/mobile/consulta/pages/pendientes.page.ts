import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BarraSuperiorComponent } from '../../ui/barra-superior';
import { AnillosProximidadComponent } from '../../ui/anillos-proximidad';
import { BarraAccionesComponent } from '../ui/barra-acciones';
import { PendienteCardMobileComponent } from '../ui/pendiente-card.mobile';
import { PendientesStore } from '../../../core/store/pendientes.store';

const LETRAS = [
  'cero', 'uno', 'dos', 'tres', 'cuatro',
  'cinco', 'seis', 'siete', 'ocho', 'nueve',
];

/** Más allá de nueve vuelve a la cifra: "doce" empieza a estorbar. */
function enLetra(n: number): string {
  return LETRAS[n] ?? String(n);
}

function mayuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/**
 * Mis pendientes. `MM12`, `MM03` cuando está vacía y `MM13` cuando hay
 * alguno completado.
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
                <mob-pendiente-card
                  [pendiente]="pendiente"
                  (abrir)="abrir($event)"
                  (dispararAlerta)="dispararAlerta($event)"
                />
              </li>
            }
          </ul>
        }
      </main>

      @if (guardado()) {
        <div class="aviso" role="status">
          <span class="aviso__icono" aria-hidden="true">◎</span>
          <span><strong>Pendiente guardado</strong><br />Te avisaremos al pasar cerca</span>
          <button type="button" aria-label="Cerrar aviso" (click)="guardado.set(false)">×</button>
        </div>
      }
      <mob-barra-acciones />
    </div>
  `,
  styles: [
    `
      .pantalla {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100dvh;
        /* Transparente para que se vea la textura del fondo. */
        background: transparent;
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
      .aviso { position: absolute; z-index: 2; left: 1.25rem; right: 1.25rem;
        bottom: calc(8.75rem + env(safe-area-inset-bottom, 0px)); display: flex; align-items: center; gap: 0.75rem;
        padding: 0.75rem 1rem; border-radius: var(--ui-radius-sm); background: var(--ui-brand);
        color: var(--ui-text-inverse); font: 400 var(--ui-caption-size) / var(--ui-caption-line) var(--ui-font); }
      .aviso strong { font-weight: 600; }
      .aviso__icono { font-size: 1.5rem; }
      .aviso button { margin-left: auto; width: 2.75rem; height: 2.75rem; border: 0; background: transparent;
        color: inherit; font-size: 1.5rem; cursor: pointer; }

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
  readonly guardado = signal(false);

  ngOnInit(): void {
    this.guardado.set(!!this.router.currentNavigation()?.extras.state?.['pendienteGuardado']);
    void this.store.cargar();
  }

  /** MM12 -> MM14 (categoría) o MM15 (dirección), según el pendiente. */
  abrir(id: string): void {
    void this.router.navigate(['/pendientes', id]);
  }

  /**
   * "Tres pendientes activos." (MM12) · "Dos activos y uno completado." (MM13)
   *
   * Los mockups escriben los números con letra, no con cifra. No es
   * capricho: con este público un "3" suelto se lee peor que "tres".
   */
  /**
   * Atajo de DEMOSTRACIÓN: mantener pulsada una tarjeta abre su alerta.
   * En el producto real la dispara una geocerca del sistema operativo.
   */
  dispararAlerta(id: string): void {
    void this.router.navigate(['/alerta', id]);
  }

  subtitulo(): string {
    const activos = this.store.activos().length;
    const hechos = this.store.pendientes().length - activos;

    if (hechos === 0) {
      return activos === 1
        ? 'Un pendiente activo.'
        : `${mayuscula(enLetra(activos))} pendientes activos.`;
    }
    const a = activos === 1 ? 'uno activo' : `${enLetra(activos)} activos`;
    const c = hechos === 1 ? 'uno completado' : `${enLetra(hechos)} completados`;
    return `${mayuscula(a)} y ${c}.`;
  }
}
