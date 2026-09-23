import { Component, OnInit, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { BarraSuperiorComponent } from '../../ui/barra-superior';
import { BotonComponent } from '../../../ui/boton';
import { PendientesStore } from '../../../core/store/pendientes.store';
import { nombreCategoria } from '../../../core/models/categoria.model';
import { RADIOS } from '../../../core/models/radio.model';

/**
 * Detalle del pendiente. `MM14`, `MM15` y `MM20b`.
 *
 * TRES MARCOS, UNA PÁGINA. Lo que cambia es:
 *   - la rama: `MM14` muestra CATEGORÍA, `MM15` muestra DIRECCIÓN;
 *   - de dónde vienes: llegando desde la lista la barra inferior ofrece
 *     "Volver" y "Editar pendiente" (`MM14`/`MM15`); llegando desde la
 *     alerta, solo "Volver a la alerta" (`MM20b`).
 *
 * El origen viaja en la consulta (`?desde=alerta`) y no en una ruta
 * aparte: es el mismo pendiente y el mismo contenido, solo cambia la
 * salida. Una ruta distinta obligaría a duplicar toda la ficha.
 *
 * OJO CON EL RADIO DE AVISO: los tres marcos lo muestran. El móvil no lo
 * EDITA —eso sigue siendo solo de web— pero sí lo enseña. Ver la nota en
 * `core/capabilities.ts`.
 */
@Component({
  selector: 'mob-detalle',
  standalone: true,
  imports: [BarraSuperiorComponent, BotonComponent],
  template: `
    <div class="pantalla">
      <mob-barra-superior titulo="Detalle del pendiente" (atras)="volver()" />

      @if (pendiente(); as p) {
        <main class="detalle">
          <h2 class="detalle__titulo">{{ p.titulo }}</h2>

          <dl class="ficha">
            <div class="ficha__fila">
              <dt class="ui-overline">Estado</dt>
              <dd>{{ p.estado === 'activo' ? 'Activo' : 'Realizado' }}</dd>
            </div>
            <div class="ficha__fila">
              <dt class="ui-overline">Tipo de ubicación</dt>
              <dd>
                {{
                  p.tipoUbicacion === 'categoria'
                    ? 'Cualquier lugar de una categoría'
                    : 'Una dirección específica'
                }}
              </dd>
            </div>
            <div class="ficha__fila">
              <dt class="ui-overline">
                {{ p.tipoUbicacion === 'categoria' ? 'Categoría' : 'Dirección' }}
              </dt>
              <dd>{{ lugar() }}</dd>
            </div>
            <div class="ficha__fila">
              <dt class="ui-overline">Radio de aviso</dt>
              <dd>{{ radio() }}</dd>
            </div>
          </dl>

          <section class="ficha ficha--suelta">
            <h3 class="ui-overline ficha__rotulo">Comportamiento</h3>
            <p class="ficha__texto">{{ comportamiento() }}</p>
          </section>
        </main>

        <div class="acciones">
          @if (desdeAlerta()) {
            <!-- MM20b -->
            <ui-boton variante="primario" anchoCompleto (click)="volver()">
              Volver a la alerta
            </ui-boton>
          } @else {
            <!-- MM14 · MM15 -->
            <button class="acciones__enlace" type="button" (click)="volver()">
              Volver
            </button>
            <ui-boton class="acciones__editar" variante="primario" (click)="editar()">
              Editar pendiente
            </ui-boton>
          }
        </div>
      }
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
      .detalle {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem 1.25rem 1.25rem;
      }
      .detalle__titulo {
        margin: 0 0 1.25rem;
        font: 600 var(--ui-h2-size) / var(--ui-h2-line) var(--ui-font);
        letter-spacing: var(--ui-h2-track);
        color: var(--ui-text-primary);
      }
      .ficha {
        margin: 0;
        padding: 1.25rem;
        background: var(--ui-surface);
        border: 1px solid var(--ui-border);
        border-radius: var(--ui-radius-md);
      }
      .ficha--suelta {
        margin-top: 1.25rem;
      }
      /* La línea separa filas, no envuelve: la última no la lleva. */
      .ficha__fila + .ficha__fila {
        margin-top: 0.625rem;
        padding-top: 0.625rem;
        border-top: 1px solid var(--ui-border);
      }
      .ficha dt,
      .ficha__rotulo {
        margin: 0;
        color: var(--ui-text-secondary);
      }
      .ficha dd {
        margin: 0.25rem 0 0;
        font: 600 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-text-primary);
      }
      .ficha__texto {
        margin: 0.5rem 0 0;
        font: 400 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-text-primary);
      }
      .acciones {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 1rem 1.25rem;
        padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
        background: var(--ui-surface);
        border-top: 1px solid var(--ui-border);
      }
      .acciones__enlace {
        padding: 0.75rem 0;
        background: none;
        border: none;
        font: 600 var(--ui-button-size) / var(--ui-button-line) var(--ui-font);
        letter-spacing: var(--ui-button-track);
        color: var(--ui-brand);
        cursor: pointer;
      }
      .acciones__editar {
        --ui-boton-ancho: 12rem;
      }
    `,
  ],
})
export class DetallePage implements OnInit {
  private readonly store = inject(PendientesStore);
  private readonly router = inject(Router);

  /** Vienen del router: `withComponentInputBinding()` los enlaza solo. */
  readonly id = input.required<string>();

  /** Se puede aterrizar aquí sin pasar por la lista. */
  ngOnInit(): void {
    void this.store.asegurarCargado();
  }
  readonly desde = input<string>('');

  readonly desdeAlerta = computed(() => this.desde() === 'alerta');
  readonly pendiente = computed(() => this.store.porId(this.id()));

  readonly lugar = computed(() => {
    const p = this.pendiente();
    if (!p) return '';
    return p.tipoUbicacion === 'categoria'
      ? nombreCategoria(p.categoria!)
      : (p.direccion ?? '');
  });

  readonly radio = computed(() => {
    const p = this.pendiente();
    const r = RADIOS.find((x) => x.valor === p?.radioAviso);
    return r ? `${r.etiqueta} · ${r.ayuda}` : '';
  });

  readonly comportamiento = computed(() => {
    const p = this.pendiente();
    if (!p) return '';
    if (p.tipoUbicacion === 'categoria') {
      const cat = nombreCategoria(p.categoria!).toLowerCase();
      return `Te recordaremos este pendiente cuando estés cerca de cualquier ${cat}.`;
    }
    // El mockup usa la calle sin la ciudad: "Calle de Alcalá 45, Madrid"
    // en el campo DIRECCIÓN, pero "cerca de Calle de Alcalá 45" aquí.
    const calle = (p.direccion ?? '').split(',')[0].trim();
    return `Te recordaremos este pendiente cuando estés cerca de ${calle}.`;
  });

  volver(): void {
    if (this.desdeAlerta()) {
      void this.router.navigate(['/alerta', this.id()]);
      return;
    }
    void this.router.navigate(['/pendientes']);
  }

  /** MM14 -> MM16 · MM15 -> MM17. El flujo de edición es de crear/. */
  editar(): void {
    void this.router.navigate(['/editar', this.id()]);
  }
}
