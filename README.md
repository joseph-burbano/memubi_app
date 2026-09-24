# MemUbi

Recordatorios que se disparan **por lugar y no por hora**.

> *"Recuérdame comprar pilas cuando pase cerca de una ferretería."*

Público objetivo: **adultos mayores** de tres hogares que se reparten diligencias entre ellos.

Proyecto final del curso de UX · MISO, Universidad de los Andes · Módulos 7 y 8.

---

## Qué es este repositorio

El **prototipo no funcional** de las interfaces de MemUbi, web y móvil, construido en Ionic + Angular + Capacitor.

*No funcional* quiere decir que el código compila, se instala y corre en un dispositivo real, y que las pantallas navegan entre sí — pero **no hay servidor, ni base de datos, ni GPS, ni geofencing**. Los datos viven en memoria y se pierden al cerrar la aplicación.

Es el punto de llegada de la cadena del curso: investigación → acotar → estilo → wireframes → mockups → maquetación. Cada pantalla de este repositorio corresponde a un marco del archivo de Figma y se maquetó contra él, verificando el resultado en un dispositivo.

## Cómo ejecutarlo

Requiere **Node 24.15+** (declarado en `package.json`) y, para el APK, **Android Studio**.

```bash
npm install

# Web
npm start
```

`npm start` levanta la web en `http://localhost:4200/` con recarga en caliente.

#### Móvil, por línea de comandos

```bash
npx cap add android   # solo la primera vez
npm run apk           # genera el APK
npm run apk:run       # genera, instala y abre en el emulador o dispositivo
```

El APK queda en `android/app/build/outputs/apk/debug/app-debug.apk`.

> Si Gradle falla con *"does not provide the required capabilities: [JAVA_COMPILER]"*, es que `JAVA_HOME` apunta a un JRE y no a un JDK. El JDK que trae Android Studio sirve:
> `setx JAVA_HOME "C:\Program Files\Android\Android Studio\jbr"`

#### Móvil, desde Android Studio

1. `npm install` y luego `npm run build` (o `npm run apk`, que además sincroniza Android) para que `android/app/src/main/assets/public` tenga la última versión compilada.
2. `npx cap open android` abre el proyecto `android/` en Android Studio. También se puede abrir manualmente con *Open* -> carpeta `android/`.
3. Esperar a que Gradle sincronice, elegir un emulador o un dispositivo físico conectado (con depuración USB habilitada) en la barra superior.
4. Presionar *Run* (▶) para compilar, instalar y abrir la aplicación.

Tras cambios en el código web hay que repetir `npx cap sync android` (o `npm run apk`, que ya lo hace) antes de volver a correr desde Android Studio; de lo contrario se reinstala la versión anterior.

---

## Cómo recorrer la demostración en móvil

El prototipo no tiene GPS, así que la alerta de proximidad no puede dispararse sola. Para poder recorrer el flujo completo con el dedo, la versión móvil incluye **dos atajos de demostración**. No son funciones del producto y no aparecen en ningún mockup: existen únicamente para poder mostrar los recorridos.

### 1. "Nuevo pendiente" abre el asistente

La aplicación **arranca sin pendientes**. *Nuevo pendiente* abre el asistente de tres pasos: escribe qué recordar, elige una categoría o dirección y revisa antes de guardar. Los datos de la demo se pierden al cerrar la aplicación.

### 2. Mantener pulsada una tarjeta dispara su alerta

Mantener el dedo sobre un pendiente durante **600 ms** abre su *alerta de proximidad*, que es lo que en el producto real ocurriría al pasar cerca del lugar. Desde ahí se puede marcar como realizado, posponerlo al próximo lugar similar o ver su detalle.

Un pendiente ya completado no responde: un recordatorio hecho no vuelve a avisar.

Se eligió la pulsación larga, y no un botón, porque **no agrega un solo elemento a la pantalla**: la maqueta se mantiene idéntica al mockup y el recorrido se puede demostrar igual.

### Recorrido sugerido

```
Permiso de ubicación  ->  Sin pendientes  ->  Nuevo pendiente
                      ->  Elegir ubicación  ->  Revisar  ->  Mis pendientes
                      ->  [tocar una tarjeta]  ->  Detalle  ->  Editar pendiente
                      ->  [mantener pulsada]  ->  Alerta de proximidad
                      ->  Marcar como realizado  ->  Pendiente realizado
                      ->  Mis pendientes, con el pendiente tachado
```

---

## Cómo está construida

### Un repositorio, dos productos

Web y móvil **no son la misma aplicación adaptada a dos tamaños**. Tienen árboles de navegación distintos, y cada plataforma hace cosas que la otra no:

| | Móvil | Web |
| --- | --- | --- |
| Alerta de proximidad y su desenlace | Sí | No — el navegador no puede |
| Permisos de ubicación y configuración | Sí | No — se administran en el dispositivo |
| Radio de aviso, mapa con radio, sugerir direcciones | Muestra el radio | Sí, y los edita |

La asimetría es deliberada y está documentada en código, con el porqué de cada exclusiva, en `src/app/core/capabilities.ts`.

La plataforma se detecta con `Capacitor.isNativePlatform()` y se carga un árbol de rutas u otro. **No se conmuta por ancho de pantalla**: achicar la ventana del navegador no convierte la web en la aplicación móvil. Como los árboles se cargan de forma diferida, quien abre la web no descarga ni un byte de las pantallas móviles.

### Estructura

```
src/app/
  core/
    models/        el dominio: pendiente, categoría, radio, lugar
    mock/          todos los datos de ejemplo, en un solo lugar
    data/          repositorios y servicios: interfaz + implementación falsa
    store/         estado de la aplicación, en señales
    capabilities.ts  qué funcionalidad existe en qué plataforma
  ui/              tokens del sistema de diseño + componentes base
  mobile/
    consulta/      lista, detalle, alerta, configuración y privacidad
    crear/         asistente de creación y edición
  web/
    consulta/      lista, detalle y privacidad
    crear/         creación, confirmación y edición
```

Cada plataforma trabaja dentro de sus carpetas y no importa las de la otra. Lo único compartido es `core/` y `ui/`.

### Sin servidor, pero preparado para uno

Las pantallas nunca leen un arreglo de datos: hablan con `PendientesRepository` y `LocationService`, que son clases abstractas. Cuál implementación entra se decide en un solo archivo, `src/app/app.config.ts`:

```ts
{ provide: PendientesRepository, useClass: PendientesRepositoryMock },
{ provide: LocationService,      useClass: LocationServiceMock },
```

El día que exista un servidor se cambian esas dos líneas y ninguna pantalla se entera. Los métodos ya son asíncronos aunque la implementación falsa responda de inmediato, precisamente para que ese cambio no obligue a tocar las pantallas.

### Sistema de diseño

Los colores, tipografías, radios y espaciados salen del Design System del proyecto y viven como variables CSS en `src/app/ui/tokens.css`. Ningún componente escribe un color a mano.

Dos reglas del sistema que se sostienen en el código:

- **El ámbar está reservado** a la alerta de proximidad y a la acción que la resuelve. No aparece en ninguna otra pantalla: si adornara, dejaría de avisar.
- **Los tamaños van en `rem`**, no en píxeles, para que crezcan cuando el usuario aumenta el tamaño de letra del sistema. Con este público no es un detalle menor.

La tipografía es **Inter**, empaquetada con la aplicación. No viene con Android, y sin empaquetarla el sistema la sustituiría por otra.

---

## Estado

### Implementado

| Plataforma | Pantallas |
| --- | --- |
| **Móvil · consulta** | Permiso de ubicación · Mis pendientes (vacío, con pendientes y con completados) · Detalle · Alerta de proximidad · Desenlace de la alerta · Configuración · Privacidad y ubicación · Privacidad y datos |
| **Móvil · crear** | Asistente por categoría o dirección · Revisión · Aviso de guardado · Edición y confirmación de cambios |
| **Web** | Mis pendientes (estado inicial) |

Los marcos del mockup móvil se agrupan por recorrido: los estados de selección, la lista vacía y la lista con completados cambian dentro de sus páginas y no crean rutas adicionales.

### En construcción

| Plataforma | Pendiente |
| --- | --- |
| **Web · crear** | Creación, confirmación y edición |
| **Web · consulta** | Detalle, privacidad y uso de la ubicación |

### Fuera de alcance, por decisión

Estas funciones se decidieron y se dejaron anotadas, no se olvidaron:

- **Eliminar un pendiente.** Se detectó al auditar la cobertura del flujo y se dejó para una iteración posterior en lugar de introducirlo sin validarlo.
- **Editar el radio de aviso desde móvil.** La web lo configura; el móvil lo muestra en el detalle.
- **Mostrar la distancia en la lista.** No aparece en ningún mockup, y agregarla sería incorporar producto sin haberlo probado con usuarios.
- **Captura por voz.** Está en el concepto, pero nunca se prototipó.

### Lo que solo se ve en el dispositivo

Construir el prototipo para que corra de verdad —y no solo en un visor— hizo visibles cosas que una maqueta estática no muestra:

- Los mockups dibujan una barra de estado simulada, con la hora y la señal. En el dispositivo esa barra la dibuja Android, así que se retiró de la maqueta para no tener dos superpuestas.
- El área táctil de la flecha de *volver* y de los enlaces secundarios se amplió a 44 px, aunque el elemento dibujado sea más pequeño.
- El contenedor web de Android ignora por defecto el tamaño de letra del sistema, así que hubo que construir la tipografía para que lo respete.
