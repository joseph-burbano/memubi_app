import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BarraSuperiorWebComponent } from '../../ui/barra-superior.web';
import { OpcionComponent } from '../ui/opcion';
import { MapaRadioComponent } from '../ui/mapa-radio';
import { ConfirmacionComponent, FilaResumen } from '../ui/confirmacion';
import { BotonComponent } from '../../../ui/boton';
import { BorradorStore } from '../../../core/store/borrador.store';
import { PendientesStore } from '../../../core/store/pendientes.store';
import { LocationService } from '../../../core/data/location.service';
import { CATEGORIAS, Categoria, nombreCategoria } from '../../../core/models/categoria.model';
import { RADIOS, RadioAviso } from '../../../core/models/radio.model';
import { Lugar } from '../../../core/models/lugar.model';
import { DIRECCIONES_MOCK } from '../../../core/mock/lugares.mock';

/**
 * Nuevo pendiente. `MW2`, `MW2b`, `MW2d` y `MW2e`–`MW2i`.
 *
 * OCHO MARCOS, UNA PÁGINA. Es el ejemplo más claro de la regla del
 * proyecto: `MW2e`, `MW2f` y `MW2g` son la misma pantalla con Farmacia,
 * Ferretería o Centro comercial marcados; `MW2h` y `MW2i`, con el radio
 * en 200 m o 1 km; `MW2d`, sin nada elegido todavía. Ocho archivos
 * habrían sido ocho copias del mismo formulario.
 *
 * DOS COLUMNAS, y ahí está el argumento de por qué esto es web:
 *   izquierda  el formulario completo, sin fragmentar en pasos
 *   derecha    lo que va a pasar, dibujado mientras eliges
 *
 * En móvil lo mismo son cinco pantallas encadenadas, porque el usuario
 * está de pie con una mano. La corrección del módulo 5 fue justamente
 * esa: dejar de calcar el flujo móvil en web.
 *
 * ESCRIBE EN EL `BorradorStore`, el mismo que usará el asistente móvil.
 * Qué cuenta como pendiente válido se decide ahí, no aquí.
 *
 * TAMBIÉN ES `MW5` Y `MW5b`, el editar.
 *
 * No es reutilización oportunista: la Entrega 3 dice que "Editar se
 * construyó CLONANDO Crear, no imitándola — así son idénticas por
 * definición y no parecidas por aproximación. Solo cambian el título, el
 * subtítulo y el botón". En código, clonar es la misma página con otro
 * modo; dos archivos volverían a ser dos cosas que se parecen.
 */
@Component({
  selector: 'web-crear',
  standalone: true,
  imports: [
    BarraSuperiorWebComponent,
    OpcionComponent,
    MapaRadioComponent,
    ConfirmacionComponent,
    BotonComponent,
  ],
  template: `
    <div class="pagina">
      <web-barra-superior seccion="pendientes" />

      <main class="crear">
        <h1 class="crear__titulo">
          {{ esEdicion() ? 'Editar pendiente' : 'Nuevo pendiente' }}
        </h1>
        <p class="crear__subtitulo">
          {{ esEdicion() ? 'Cambia lo que necesites y guarda.' : 'Todo en una sola página.' }}
        </p>

        <div class="crear__columnas">
          <!-- ---------- Izquierda: el formulario ---------- -->
          <div class="formulario">
            <div class="campo">
              <label class="ui-label-field" for="titulo">¿Qué necesitas recordar?</label>
              <input
                id="titulo"
                class="campo__input ui-body-lg"
                type="text"
                placeholder="Escribe qué necesitas recordar"
                [value]="borrador.borrador().titulo"
                (input)="escribirTitulo($any($event.target).value)"
              />
            </div>

            <div
              class="grupo"
              role="radiogroup"
              aria-label="¿Dónde quieres recibir este recordatorio?"
            >
              <p class="ui-label-field grupo__rotulo">
                ¿Dónde quieres recibir este recordatorio?
              </p>
              <web-opcion
                titulo="Cualquier lugar de una categoría"
                ayuda="Cuando estés cerca de cualquier lugar de esta categoría. Ejemplo: cualquier supermercado."
                [seleccionada]="tipo() === 'categoria'"
                (elegir)="elegirTipo('categoria')"
              />
              <web-opcion
                titulo="Una dirección específica"
                ayuda="Únicamente cuando estés cerca de la dirección seleccionada."
                [seleccionada]="tipo() === 'direccion'"
                (elegir)="elegirTipo('direccion')"
              />
            </div>

            @if (tipo() !== 'direccion') {
              <!-- MW2 · MW2e · MW2f · MW2g -->
              <div class="grupo" role="radiogroup" aria-label="Escoge la categoría">
                <div class="grupo__cabecera">
                  <p class="ui-label-field grupo__rotulo" [class.grupo__rotulo--inactivo]="!tipo()">
                    Escoge la categoría
                  </p>
                  @if (!tipo()) {
                    <p class="grupo__pista">
                      Se activan al elegir dónde quieres recibir el recordatorio
                    </p>
                  }
                </div>
                <div class="rejilla">
                  @for (c of categorias; track c.id) {
                    <web-opcion
                      compacta
                      [titulo]="c.nombre"
                      [seleccionada]="categoria() === c.id"
                      [inactiva]="!tipo()"
                      (elegir)="elegirCategoria(c.id)"
                    />
                  }
                </div>
              </div>
            }

            <!-- MW2h · MW2i -->
            <div class="grupo" role="radiogroup" aria-label="Avisarme cuando esté a">
              <p class="ui-label-field grupo__rotulo" [class.grupo__rotulo--inactivo]="!tipo()">
                Avisarme cuando esté a
              </p>
              @for (r of radios; track r.valor) {
                <web-opcion
                  [titulo]="r.etiqueta"
                  [ayuda]="r.ayuda"
                  [seleccionada]="radio() === r.valor"
                  [inactiva]="!tipo()"
                  (elegir)="elegirRadio(r.valor)"
                />
              }
            </div>
          </div>

          <!-- ---------- Derecha: lo que va a pasar ---------- -->
          <aside class="vista">
            @if (tipo() === 'direccion') {
              <!-- MW2b -->
              <div class="campo">
                <label class="ui-label-field" for="buscar">¿Dónde exactamente?</label>
                <input
                  id="buscar"
                  class="campo__input ui-body-lg"
                  type="search"
                  placeholder="Busca una dirección"
                  [value]="busqueda()"
                  (input)="busqueda.set($any($event.target).value)"
                />
              </div>

              <div class="grupo" role="radiogroup" aria-label="Cerca de donde estás">
                <p class="ui-overline grupo__rotulo">Cerca de donde estás</p>
                @for (d of direccionesFiltradas(); track d.id) {
                  <web-opcion
                    [titulo]="d.direccion"
                    [ayuda]="d.nombre + ' · a ' + distancia(d)"
                    [seleccionada]="direccion() === d.direccion"
                    (elegir)="elegirDireccion(d.direccion)"
                  />
                }
              </div>

              <web-mapa-radio
                [radio]="radio()"
                [alto]="280"
                [destino]="etiquetaDestino()"
                seleccionable
              />

              <ui-boton variante="secundario" anchoCompleto>Ampliar mapa</ui-boton>

              <div class="resumen">
                <p class="ui-overline resumen__rotulo">Dirección seleccionada</p>
                <p class="resumen__texto">
                  {{ direccion() || 'Todavía no has elegido una dirección.' }}
                </p>
              </div>
            } @else {
              <!-- MW2 · MW2d -->
              <p class="ui-label-field vista__rotulo">{{ rotuloMapa() }}</p>
              <web-mapa-radio [candidatos]="candidatos()" [radio]="radio()" [alto]="380" />

              @if (categoria()) {
                <div class="leyenda">
                  <span class="leyenda__item">
                    <span class="leyenda__marca"></span> Activa el aviso
                  </span>
                  <span class="leyenda__item">
                    <span class="leyenda__marca leyenda__marca--fuera"></span> Fuera del radio
                  </span>
                </div>
              }

              <div class="resumen">
                <p class="ui-overline resumen__rotulo">Así quedará el aviso</p>
                <p class="resumen__texto">{{ resumen() }}</p>
                <div class="resumen__linea"></div>
                <p class="resumen__nota">El aviso llegará a la aplicación móvil.</p>
              </div>
            }
          </aside>
        </div>

        <div class="acciones">
          <ui-boton class="acciones__cancelar" variante="secundario" (click)="cancelar()">
            Cancelar
          </ui-boton>
          <ui-boton
            class="acciones__guardar"
            variante="primario"
            [deshabilitado]="!borrador.estaCompleto()"
            (click)="pedirConfirmacion()"
          >
            {{ esEdicion() ? 'Guardar cambios' : 'Guardar' }}
          </ui-boton>
        </div>
      </main>

      <!-- MW3 · MW3b · MW5c · MW5d -->
      @if (confirmando()) {
        <web-confirmacion
          [titulo]="esEdicion() ? '¿Guardamos los cambios?' : '¿Guardamos este pendiente?'"
          [filas]="filasResumen()"
          [promesa]="promesa()"
          [textoConfirmar]="esEdicion() ? 'Guardar cambios' : 'Guardar'"
          (volver)="confirmando.set(false)"
          (confirmar)="confirmar()"
        />
      }
    </div>
  `,
  styles: [
    `
      .pagina {
        min-height: 100dvh;
      }
      .crear {
        max-width: 90rem;
        margin: 0 auto;
        padding: 3rem 6rem 2.5rem;
      }
      .crear__titulo {
        margin: 0;
        font: 600 var(--ui-h1-size) / var(--ui-h1-line) var(--ui-font);
        letter-spacing: var(--ui-h1-track);
        color: var(--ui-text-primary);
      }
      .crear__subtitulo {
        margin: 0.5rem 0 0;
        font: 400 var(--ui-body-size) / var(--ui-body-line) var(--ui-font);
        color: var(--ui-text-secondary);
      }
      /* 704px el formulario, 504px la vista: las medidas del mockup. */
      .crear__columnas {
        display: grid;
        grid-template-columns: minmax(0, 44rem) minmax(0, 31.5rem);
        gap: 2.5rem;
        margin-top: 2.5rem;
        align-items: start;
      }
      .formulario {
        display: flex;
        flex-direction: column;
        gap: 2.25rem;
      }
      .vista {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .campo {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
      }
      .campo__input {
        min-height: 3.75rem;
        padding: 0 1.5rem;
        background: var(--ui-surface);
        border: 2px solid var(--ui-border);
        border-radius: var(--ui-radius-sm);
        color: var(--ui-text-primary);
      }
      .campo__input::placeholder {
        color: var(--ui-text-disabled);
      }
      /* Con contenido el campo se marca en teal, como en MW2. */
      .campo__input:not(:placeholder-shown),
      .campo__input:focus {
        border-color: var(--ui-brand);
        outline: none;
      }

      .grupo {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .grupo__cabecera {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 1.5rem;
      }
      .grupo__rotulo {
        margin: 0;
      }
      .grupo__rotulo--inactivo {
        color: var(--ui-text-disabled);
      }
      .grupo__pista {
        margin: 0;
        font: 400 var(--ui-caption-size) / var(--ui-caption-line) var(--ui-font);
        letter-spacing: var(--ui-caption-track);
        color: var(--ui-text-secondary);
        text-align: right;
      }
      .rejilla {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
      }

      .vista__rotulo {
        margin: 0;
      }
      .leyenda {
        display: flex;
        gap: 3rem;
        padding: 1.25rem 1.5rem;
        background: var(--ui-surface);
        border: 1px solid var(--ui-border);
        border-radius: var(--ui-radius-sm);
      }
      .leyenda__item {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        font: 400 var(--ui-caption-size) / var(--ui-caption-line) var(--ui-font);
        letter-spacing: var(--ui-caption-track);
        color: var(--ui-text-secondary);
      }
      .leyenda__marca {
        width: 1.5rem;
        height: 1.5rem;
        background: var(--ui-brand);
        border-radius: var(--ui-radius-pill);
      }
      .leyenda__marca--fuera {
        background: var(--ui-surface);
        border: 2px solid var(--ui-border-strong);
      }

      .resumen {
        padding: 1.75rem 2rem;
        background: var(--ui-surface);
        border: 1px solid var(--ui-border);
        border-radius: var(--ui-radius-md);
      }
      .resumen__rotulo {
        margin: 0;
        color: var(--ui-text-secondary);
      }
      .resumen__texto {
        margin: 0.75rem 0 0;
        font: 600 var(--ui-h3-size) / var(--ui-h3-line) var(--ui-font);
        letter-spacing: var(--ui-h3-track);
        color: var(--ui-text-primary);
      }
      .resumen__linea {
        height: 1px;
        margin: 1.5rem 0 0;
        background: var(--ui-border);
      }
      .resumen__nota {
        margin: 1.125rem 0 0;
        font: 400 var(--ui-caption-size) / var(--ui-caption-line) var(--ui-font);
        letter-spacing: var(--ui-caption-track);
        color: var(--ui-text-secondary);
      }

      .acciones {
        display: flex;
        justify-content: space-between;
        margin-top: 2.5rem;
        padding-top: 2rem;
        border-top: 1px solid var(--ui-border);
      }
      .acciones__cancelar {
        --ui-boton-alto: 3rem;
        --ui-boton-ancho: 10rem;
      }
      .acciones__guardar {
        --ui-boton-alto: 3rem;
        --ui-boton-ancho: 12.5rem;
      }

      /* Por debajo de 1100px las dos columnas no caben: la vista pasa
       * debajo del formulario en vez de encogerse hasta ser ilegible. */
      @media (max-width: 1100px) {
        .crear {
          padding: 2rem 1.5rem;
        }
        .crear__columnas {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `,
  ],
})
export class CrearPage implements OnInit {
  readonly borrador = inject(BorradorStore);
  private readonly pendientes = inject(PendientesStore);
  private readonly ubicacion = inject(LocationService);
  private readonly router = inject(Router);

  /** Presente solo en /editar/:id. Llega del router. */
  readonly id = input<string>('');
  readonly esEdicion = computed(() => !!this.id());

  readonly confirmando = signal(false);

  readonly categorias = CATEGORIAS;
  readonly radios = RADIOS;
  readonly direcciones = DIRECCIONES_MOCK;

  readonly busqueda = signal('');
  private readonly _candidatos = signal<readonly Lugar[]>([]);
  readonly candidatos = this._candidatos.asReadonly();

  readonly tipo = computed(() => this.borrador.borrador().tipoUbicacion);
  readonly categoria = computed(() => this.borrador.borrador().categoria);
  readonly direccion = computed(() => this.borrador.borrador().direccion);
  readonly radio = computed(() => this.borrador.borrador().radioAviso);

  async ngOnInit(): Promise<void> {
    if (!this.esEdicion()) {
      this.borrador.limpiar();
      return;
    }
    // MW5: el formulario arranca con lo que ya tenía el pendiente.
    await this.pendientes.asegurarCargado();
    const p = this.pendientes.porId(this.id());
    if (p) {
      this.borrador.cargarDesde(p);
      void this.refrescarCandidatos();
    }
  }

  readonly filasResumen = computed<FilaResumen[]>(() => {
    const b = this.borrador.borrador();
    const esCategoria = b.tipoUbicacion === 'categoria';
    return [
      { rotulo: 'Pendiente', valor: b.titulo },
      {
        rotulo: 'Tipo de ubicación',
        valor: esCategoria ? 'Cualquier lugar de una categoría' : 'Una dirección específica',
      },
      {
        rotulo: esCategoria ? 'Categoría' : 'Dirección',
        valor: esCategoria ? nombreCategoria(b.categoria!) : (b.direccion ?? ''),
      },
      { rotulo: 'Radio de aviso', valor: this.radioConAyuda() },
    ];
  });

  readonly promesa = computed(() => {
    const b = this.borrador.borrador();
    if (b.tipoUbicacion === 'categoria' && b.categoria) {
      return `Te avisaremos cuando estés a ${this.etiquetaRadio()} de cualquier ${nombreCategoria(b.categoria).toLowerCase()}.`;
    }
    return `Te avisaremos cuando estés a ${this.etiquetaRadio()} de ${b.direccion ?? ''}.`;
  });

  radioConAyuda(): string {
    const r = RADIOS.find((x) => x.valor === this.radio());
    return r ? `${r.etiqueta} · ${r.ayuda}` : '';
  }

  readonly rotuloMapa = computed(() => {
    const c = this.categoria();
    return c ? `${nombreCategoria(c)}s cerca de ti` : 'Vista previa del aviso';
  });

  readonly resumen = computed(() => {
    const c = this.categoria();
    if (!c) return 'Completa el pendiente para ver cómo quedará el aviso.';
    return `Te avisaremos cuando estés a ${this.etiquetaRadio()} de cualquier ${nombreCategoria(c).toLowerCase()}.`;
  });

  readonly etiquetaDestino = computed(() => {
    const d = this.direccion();
    return d ? d.split(',')[0].trim() : '';
  });

  readonly direccionesFiltradas = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    if (!q) return this.direcciones;
    return this.direcciones.filter((d) => d.direccion.toLowerCase().includes(q));
  });

  etiquetaRadio(): string {
    return this.radio() >= 1000 ? '1 km' : `${this.radio()} m`;
  }

  distancia(l: Lugar): string {
    return l.distanciaMetros >= 1000
      ? `${(l.distanciaMetros / 1000).toFixed(1).replace('.', ',')} km`
      : `${l.distanciaMetros} m`;
  }

  escribirTitulo(v: string): void {
    this.borrador.parchar({ titulo: v });
  }

  elegirTipo(tipo: 'categoria' | 'direccion'): void {
    this.borrador.elegirTipo(tipo);
    void this.refrescarCandidatos();
  }

  elegirCategoria(c: Categoria): void {
    if (!this.tipo()) return;
    this.borrador.parchar({ categoria: c });
    void this.refrescarCandidatos();
  }

  elegirDireccion(d: string): void {
    this.borrador.parchar({ direccion: d });
  }

  elegirRadio(r: RadioAviso): void {
    if (!this.tipo()) return;
    this.borrador.parchar({ radioAviso: r });
    void this.refrescarCandidatos();
  }

  /**
   * Los candidatos salen del `LocationService`, no de un arreglo aquí.
   * Hoy responde con datos falsos; el día que exista un servicio real,
   * esta pantalla no cambia.
   */
  private async refrescarCandidatos(): Promise<void> {
    const c = this.categoria();
    if (!c) {
      this._candidatos.set([]);
      return;
    }
    this._candidatos.set(await this.ubicacion.lugaresCercanos(c));
  }

  cancelar(): void {
    this.borrador.limpiar();
    void this.router.navigate(['/pendientes']);
  }

  /** MW2 -> MW3 · MW2b -> MW3b · MW5 -> MW5c · MW5b -> MW5d. */
  pedirConfirmacion(): void {
    if (!this.borrador.estaCompleto()) return;
    this.confirmando.set(true);
  }

  /** Confirmado: se escribe y se vuelve a la lista (MW1e). */
  async confirmar(): Promise<void> {
    if (this.esEdicion()) {
      await this.pendientes.actualizar(this.id(), this.borrador.aPendiente());
    } else {
      await this.pendientes.guardar(this.borrador.aPendiente());
    }
    this.borrador.limpiar();
    this.confirmando.set(false);
    void this.router.navigate(['/pendientes']);
  }
}
