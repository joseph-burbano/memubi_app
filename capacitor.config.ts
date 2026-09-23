import type { CapacitorConfig } from '@capacitor/cli';

/**
 * `webDir` apunta a `www`, que es donde Angular deja el build
 * (ver `outputPath` en angular.json). Si se cambia uno, se cambia el otro.
 */
const config: CapacitorConfig = {
  appId: 'co.edu.uniandes.miso.memubi',
  appName: 'MemUbi',
  webDir: 'www',
};

export default config;
