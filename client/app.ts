import { ltiLaunch } from '@atomicjolt/lti-client';
import type { LaunchSettings } from '@atomicjolt/lti-client';
import { LTI_NAMES_AND_ROLES_PATH, LTI_SIGN_DEEP_LINK_PATH } from '../definitions';

const launchSettings: LaunchSettings = window.LAUNCH_SETTINGS;
ltiLaunch(launchSettings).then((valid) => {
  if (valid) {
    const mainContent = document.getElementById('main-content');

    if (!mainContent) {
      console.error('Main content element not found');
      return;
    }

    mainContent.innerHTML = `
      <h1>Hello World</h1>
    `;

    const jwt = launchSettings.jwt;

    // Deep Linking example
    if (launchSettings.deepLinking) {
      mainContent.innerHTML += `
        <h2>Deep Linking</h2>
        <button id="deep-linking-button">Deep Link</button>
        <form id="deep-linking-form" method="post">
          <input id="deep-link-jwt" type="hidden" name="JWT" value="" />
          <button id="deep-link-submit" type="submit" style="display:none;">Submit</button>
        </form>
      `;
      const deepLinkingButton = document.getElementById('deep-linking-button');
      if (deepLinkingButton) {
        deepLinkingButton.addEventListener('click', () => {

          let deepLink: any = {
            type: 'image',
            title: 'Atomic Jolt',
            text: 'Atomic Jolt Logo',
            url: 'https://atomic-lti-worker.atomicjolt.win/images/atomicjolt_name.png',
          };

          if (launchSettings.deepLinking?.accept_types) {
            if (launchSettings.deepLinking.accept_types.indexOf('html') >= 0) {
              deepLink = {
                type: 'html',
                html: '<h2>Just saying hi!</h2>',
                title: 'Hello World',
                text: 'A simple hello world example',
              };
            } else if (launchSettings.deepLinking.accept_types.indexOf('link') >= 0) {
              deepLink = {
                type: 'link',
                title: 'Atomic Jolt',
                text: 'Atomic Jolt Home Page',
                url: 'https://atomicjolt.com',
              };
            }
          }

          fetch('/' + LTI_SIGN_DEEP_LINK_PATH, {
            method: 'POST',
            body: JSON.stringify([deepLink]),
            headers: {
              'Authorization': `Bearer ${jwt}`,
              'Content-Type': 'application/json'
            }
          })
            .then(response => {
              return response.json();
            })
            .then((d: any) => {
              const data = JSON.parse(d);
              const form = document.getElementById('deep-linking-form') as HTMLFormElement;
              form?.setAttribute('action', launchSettings.deepLinking?.deep_link_return_url || '');
              const field = document.getElementById('deep-link-jwt');
              field?.setAttribute('value', data.jwt);
              form?.submit();
            })
            .catch((error) => {
              console.error('Error:', error);
            });

        });
      }
    }

    // Example of calling the names and roles service
    fetch(`/${LTI_NAMES_AND_ROLES_PATH}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwt}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch((error) => {
        console.error('Error:', error);
      });

  } else {
    document.body.innerHTML = 'Failed to launch';
  }
});
