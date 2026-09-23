import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Compila el APK de depuración.
 *
 * POR QUÉ ESTE ARCHIVO EXISTE Y NO USAMOS `npx cap run android`:
 *
 * El CLI de Capacitor invoca `./gradlew` —la forma de Unix— también en
 * Windows (ver `node_modules/@capacitor/cli/dist/android/run.js`). En
 * CMD eso no resuelve `gradlew.bat` y la compilación falla con
 * "'gradlew' is not recognized".
 *
 * Y no basta con poner `gradlew.bat` en un script de npm: npm elige el
 * shell según la variable SHELL, así que en una máquina con Git Bash
 * corre con bash (donde hace falta `./gradlew`) y en otra con cmd
 * (donde hace falta `gradlew.bat`). El mismo script funcionaría en una
 * máquina y fallaría en la otra.
 *
 * Aquí se decide por `process.platform`, que no depende del shell.
 */

const esWindows = process.platform === 'win32';
const wrapper = esWindows ? 'gradlew.bat' : './gradlew';

if (!existsSync('android')) {
  console.error(
    '\nNo existe la carpeta android/.\n' +
      'Está en .gitignore, así que hay que generarla la primera vez:\n\n' +
      '  npx cap add android\n',
  );
  process.exit(1);
}

if (!process.env.JAVA_HOME) {
  console.error(
    '\nJAVA_HOME no está definida.\n' +
      'Gradle necesita un JDK completo; si toma un JRE falla con\n' +
      '"does not provide the required capabilities: [JAVA_COMPILER]".\n\n' +
      'El JDK que trae Android Studio sirve:\n' +
      '  setx JAVA_HOME "C:\\Program Files\\Android\\Android Studio\\jbr"\n\n' +
      'Cierra y vuelve a abrir la terminal después de definirla.\n',
  );
  process.exit(1);
}

// Ruta absoluta a propósito: cmd no siempre busca ejecutables en el
// directorio de trabajo, y con la ruta relativa falla con
// "'gradlew.bat' is not recognized" aunque el archivo esté ahí.
//
// Y entrecomillada, porque Node necesita `shell: true` para ejecutar un
// .bat y el shell parte el comando en los espacios. Este repo puede
// vivir en una ruta con espacios —"Semestre 3"— y sin las comillas
// falla con "'Z:\Universidad\Semestre' is not recognized".
const gradlew = resolve('android', wrapper);

// La tarea va dentro de la cadena del comando y no en el arreglo de
// argumentos: Node avisa (DEP0190) que con `shell: true` los argumentos
// se concatenan sin escapar, y el aviso saldría en cada compilación.
const { status } = esWindows
  ? spawnSync(`"${gradlew}" assembleDebug`, {
      cwd: resolve('android'),
      stdio: 'inherit',
      shell: true,
    })
  : spawnSync(gradlew, ['assembleDebug'], {
      cwd: resolve('android'),
      stdio: 'inherit',
    });

if (status !== 0) process.exit(status ?? 1);

console.log('\nAPK: android/app/build/outputs/apk/debug/app-debug.apk\n');
