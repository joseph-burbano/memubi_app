import { copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// android/ se genera y está en .gitignore. Esta integración se aplica tras
// `cap sync android` para que el botón siga funcionando en un clon limpio.
const packagePath = resolve('android/app/src/main/java/co/edu/uniandes/miso/memubi');
const mainActivityPath = resolve(packagePath, 'MainActivity.java');
const pluginPath = resolve(packagePath, 'LocationSettingsPlugin.java');
const defaultActivity = 'public class MainActivity extends BridgeActivity {}';
const registeredActivity = `public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(LocationSettingsPlugin.class);
        super.onCreate(savedInstanceState);
    }
}`;

const activity = readFileSync(mainActivityPath, 'utf8');
if (!activity.includes(registeredActivity)) {
  if (!activity.includes(defaultActivity)) {
    throw new Error('MainActivity.java no tiene la plantilla esperada; registra LocationSettingsPlugin manualmente.');
  }
  writeFileSync(mainActivityPath, activity.replace(defaultActivity, registeredActivity));
}

copyFileSync(resolve('native/LocationSettingsPlugin.java'), pluginPath);
