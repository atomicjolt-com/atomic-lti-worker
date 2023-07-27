import type { LaunchSettings } from '@atomicjolt/lti/src/types';
import metafile from '../../public/dist/metafile.json';

export default function launchHtml(settings: LaunchSettings) {
  const hashedScriptName = metafile["client/app.ts"];
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <style>
          .hidden { display: none !important; }
        </style>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="/styles.css" />
        <script type="text/javascript">
          window.LAUNCH_SETTINGS = ${JSON.stringify(settings)};
        </script>
      </head>
      <body>
        <noscript>
          <div class="u-flex">
            <i class="material-icons-outlined aj-icon" aria-hidden="true">warning</i>
            <p class="aj-text">
              You must have javascript enabled to use this application.
            </p>
          </div>
        </noscript>
        <div id="error" class="hidden u-flex aj-centered-message">
          <i class="material-icons-outlined aj-icon" aria-hidden="true">warning</i>
          <p class="aj-text translate">
            There was an error launching the LTI tool. Please reload and try again.
          </p>
        </div>
        <div id="main-content">
        </div>
        <script src="/${hashedScriptName}"></script>
      </body>
    </html>
  `;
}
