import type { RedirectParams } from '@atomicjolt/lti/src/types';

export default function redirectHtml(redirectParams: RedirectParams, targetLinkUri: string) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="/styles.css" />
      </head>
      <body>
        <noscript>
          <div class="u-flex aj-centered-message">
            <i class="material-icons-outlined aj-icon" aria-hidden="true">warning</i>
            <p class="aj-text">
              You must have javascript enabled to use this application.
            </p>
          </div>
        </noscript>
        <form action="${targetLinkUri}" method="POST">
          <input type="hidden" name="id_token" value="${redirectParams.idToken}" />
          <input type="hidden" name="state" value="${redirectParams.state}" />
          <input type="hidden" name="lti_storage_target" value="${redirectParams.ltiStorageTarget}" />
        </form>
        <script>
          window.addEventListener("load", () => {
            document.forms[0].submit();
          });
        </script>
      </body>
    </html>
  `;
}
