import 'vite/client';
import type { InitSettings, LaunchSettings } from '@atomicjolt/lti-client/types';

export interface ResponseError {
  message: string;
}

declare global {
  function setupMiniflareIsolatedStorage(): Function;
  function getMiniflareBindings(): EnvBindings;
  interface Window {
    INIT_SETTINGS: InitSettings;
    LAUNCH_SETTINGS: LaunchSettings;
  }
}
