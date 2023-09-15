import { initOIDCLaunch } from '@atomicjolt/lti-client';
import type { InitSettings } from '@atomicjolt/lti-client/types';

const initSettings: InitSettings = window.INIT_SETTINGS;
initOIDCLaunch(initSettings);
