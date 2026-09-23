import { Component, OnInit, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { BarraSuperiorComponent } from '../../ui/barra-superior';
import { AnillosProximidadComponent } from '../../ui/anillos-proximidad';
import { BotonComponent } from '../../../ui/boton';
import { PendientesStore } from '../../../core/store/pendientes.store';
import { nombreCategoria } from '../../../core/models/categoria.model';

/**
 * Alerta de proximidad. `MM20`.
 *
 * ES LA PANTALLA QUE JUSTIFICA QUE EL PRODUCTO SEA MÓVIL. La web no
 * puede hacerla: no hay API de geofencing en el navegador,
 * `navigator.geolocation` no se expone a los service workers y con la
 * pestaña cerrada no corre nada.
 *
 * NO SE DISPARA POR GPS. Es un prototipo no funcional: se llega aquí
 * porque una ruta lleva aquí. La ubicación real se resolvería con
 * geofences registradas en el sistema operativo — ver la nota larga en
 * `core/data/location.service.ts`.
 *
 * EL ÁMBAR VIVE AQUÍ Y EN NINGÚN OTRO LADO. Es la única pantalla del
 * bloque que lo usa: la tarjeta de aviso y el botón que resuelve la
 * alerta. Si el ámbar aparece en otra pantalla, deja de avisar.
 */
@Component({
  selector: 'mob-alerta',
  standalone: true,
  imports: [BarraSuperiorComponent, AnillosProximidadComponent, BotonComponent],
  template: `
    <div class="pantalla">
      <mob-barra-superior />

      @if (pendiente(); as p) {
        <main class="alerta">
          <section class="aviso">
            <div class="aviso__ilustracion">
              <mob-anillos-proximidad [tamano]="120" alerta />
            </div>
            <p class="ui-overline aviso__rotulo">Tienes un pendiente cerca</p>
            <h2 class="aviso__titulo">{{ p.titulo }}</h2>
            <p class="aviso__lugar">{{ contexto() }}</p>
          </section>

          <div class="alerta__acciones">
            <p class="alerta__pregunta">¿Qué quieres hacer con este pendiente?</p>

            <ui-boton variante="accion" anchoCompleto (click)="marcarRealizado()">
              Marcar como realizado
            </ui-boton>

            <ui-boton
              class="alerta__secundario"
              variante="secundario"
              anchoCompleto
              (click)="proximoLugar()"
            >
              Recordarme en el próximo lugar similar
            </ui-boton>

            <button class="alerta__ver" type="button" (click)="verPendiente()">
              Ver pendiente
            </button>
          </div>
        </main>
      }
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
      .alerta {
        display: flex;
        min-height: 0;
        overflow-y: auto;
        flex-direction: column;
        flex: 1;
        padding: 1.75rem 1.25rem;
        padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px));
      }
      /* La tarjeta ámbar: el único sitio del bloque donde aparece. */
      .aviso {
        padding: 1.25rem;
        background: var(--ui-action-subtle);
        border: 2px solid var(--ui-action);
        border-radius: var(--ui-radius-lg);
        text-align: center;
      }
      .aviso__ilustracion {
        display: flex;
        justify-content: center;
      }
      .aviso__rotulo {
        margin: 1rem 0 0;
        color: var(--ui-text-on-action);
      }
      .aviso__titulo {
        margin: 0.5rem 0 0;
        font: 600 var(--ui-h2-size) / var(--ui-h2-line) var(--ui-font);
        letter-spacing: var(--ui-h2-track);
        color: var(--ui-text-on-action);
      }
      .aviso__lugar {
        margin: 0.75rem 0 0;
        font: 400 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-text-on-action);
      }
      /* Medidas tomadas de MM20, restando los 48px de la barra de
       * sistema simulada. La pantalla del dispositivo mide 360x800 CSS,
       * igual que el marco, así que las distancias se trasladan tal cual:
       *   tarjeta 84-364 · pregunta 392 · botón 468
       */
      .alerta__pregunta {
        margin: 1.75rem 0 3.125rem;
        font: 400 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-text-secondary);
        text-align: center;
      }
      /* SIN margin-top: auto. En el mockup la tarjeta, la pregunta y los
       * botones van juntos arriba y el espacio sobrante queda debajo;
       * empujarlos al pie los separaba de la alerta.
       *
       * Al no fijarlos, si el usuario sube el tamaño de letra del sistema
       * el contenido crece hacia abajo y la pantalla hace scroll en vez
       * de recortarse. */
      .alerta__acciones {
        padding-top: 0;
      }
      .alerta__secundario {
        display: block;
        margin-top: 0.75rem;
      }
      .alerta__ver {
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
export class AlertaPage implements OnInit {
  private readonly store = inject(PendientesStore);
  private readonly router = inject(Router);

  readonly id = input.required<string>();

  /** Se puede aterrizar aquí sin pasar por la lista. */
  ngOnInit(): void {
    void this.store.asegurarCargado();
  }

  readonly pendiente = computed(() => this.store.porId(this.id()));

  /** "Estás cerca de un supermercado" · "Estás cerca de Calle de Alcalá 45". */
  readonly contexto = computed(() => {
    const p = this.pendiente();
    if (!p) return '';
    if (p.tipoUbicacion === 'categoria') {
      return `Estás cerca de un ${nombreCategoria(p.categoria!).toLowerCase()}`;
    }
    return `Estás cerca de ${(p.direccion ?? '').split(',')[0].trim()}`;
  });

  /** MM20 -> MM21 */
  async marcarRealizado(): Promise<void> {
    await this.store.marcarRealizado(this.id());
    void this.router.navigate(['/realizado', this.id()]);
  }

  /** MM20 -> MM22. Todavía no existe: entra en el segundo commit. */
  proximoLugar(): void {
    void this.router.navigate(['/proximo-lugar', this.id()]);
  }

  /** MM20 -> MM20b: el detalle, con la salida de vuelta a la alerta. */
  verPendiente(): void {
    void this.router.navigate(['/pendientes', this.id()], {
      queryParams: { desde: 'alerta' },
    });
  }
}
