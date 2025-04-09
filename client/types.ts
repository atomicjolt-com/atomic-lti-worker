import type { InitSettings, LaunchSettings } from '@atomicjolt/lti-client';

declare global {
  interface Window {
    INIT_SETTINGS: InitSettings;
    LAUNCH_SETTINGS: LaunchSettings;
  }
}
