import { ltiLaunch } from '@atomicjolt/lti-client/src/client/launch';

ltiLaunch(window.LAUNCH_SETTINGS).then((valid) => {
  if (valid) {
    document.body.innerHTML = 'hello world';
  } else {
    document.body.innerHTML = 'failed to launch';
  }
});
