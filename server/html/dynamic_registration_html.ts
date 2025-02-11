import type { PlatformConfiguration } from '@atomicjolt/lti-types';
import { html } from '@atomicjolt/lti-endpoints';
import { APPLICATION_NAME, LTI_REGISTRATION_FINISH_PATH } from '../../definitions';

function style(): string {
  return `
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 40px auto; padding: 20px; }
      h1 { color: #2c3e50; text-align: center; margin-bottom: 30px; }
      form { text-align: center; }
      input[type="submit"] {
        background-color: #3498db;
        color: white;
        border: none;
        padding: 1rem 2rem;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.2s;
      }
      input[type="submit"]:hover {
        background-color: #2980b9;
      }
    </style>
  `;
}

export function dynamicRegistrationHtml(
  platformConfiguration: PlatformConfiguration,
  registrationToken: string,
): string {
  const config = encodeURIComponent(JSON.stringify(platformConfiguration));
  const head = style();
  const body = `
    <h1>Register ${APPLICATION_NAME}</h1>
    <form action="${LTI_REGISTRATION_FINISH_PATH}" method="post">
      <input type="hidden" name="platformConfiguration" value="${config}" />
      <input type="hidden" name="registrationToken" value="${registrationToken}" />
      <input type="submit" value="Finish Registration" />
    </form>
  `;
  return html(head, body);
}

export default function dynamicRegistrationFinishHtml() {
  const head = style();
  const body = `
    <h1>Registration complete</h1>
    <script type="text/javascript">
      (window.opener || window.parent).postMessage({subject:"org.imsglobal.lti.close"}, "*");
    </script>
  `;

  return html(head, body);
}
