import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

/**
 * Cascarón de la aplicación. Es el único componente que comparten web y
 * móvil: debajo de él, cada plataforma monta su propio árbol de rutas.
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    void this.ajustarBarraDeSistema();
  }

  /**
   * La barra superior de la app es teal, y encima de ella Android dibuja
   * su reloj y sus iconos. Por defecto los pinta oscuros, que sobre teal
   * casi no se leen — y el público de esta app son adultos mayores.
   *
   * `Style.Dark` significa "fondo oscuro", o sea contenido claro. El
   * nombre confunde: es la convención de la plataforma, no un error.
   *
   * Solo corre en nativo. En el navegador estos plugins no existen y
   * llamarlos lanzaría una excepción en el arranque.
   */
  private async ajustarBarraDeSistema(): Promise<void> {
    if (!Capacitor.isNativePlatform()) return;

    // El color se LEE del token, no se escribe aquí. El plugin necesita
    // una cadena literal y no entiende var(), pero eso no es excusa para
    // duplicar el valor: si cambia --ui-brand, esto cambia con él.
    const teal = getComputedStyle(document.documentElement)
      .getPropertyValue('--ui-brand')
      .trim();

    try {
      await StatusBar.setStyle({ style: Style.Dark });
      if (teal) await StatusBar.setBackgroundColor({ color: teal });
      await StatusBar.setOverlaysWebView({ overlay: false });
    } catch {
      // Si el plugin falla, la app sigue: es cosmético, no funcional.
    }
  }
}
