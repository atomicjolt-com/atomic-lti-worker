import { ltiLaunch } from '@atomicjolt/lti-client';
import type { LaunchSettings } from '@atomicjolt/lti-client/types';

const launchSettings: LaunchSettings = window.LAUNCH_SETTINGS;
ltiLaunch(launchSettings).then((valid) => {
  if (valid) {
    document.body.innerHTML = 'hello world';
  } else {
    document.body.innerHTML = 'failed to launch';
  }
});
