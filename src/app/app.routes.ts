import { mobileRoutes } from './mobile/mobile.routes';
import { webRoutes } from './web/web.routes';

export const appRoutes = {
  mobile: mobileRoutes,
  web: webRoutes,
} as const;
