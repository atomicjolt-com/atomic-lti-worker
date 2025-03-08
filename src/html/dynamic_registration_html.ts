import type { PlatformConfiguration } from '@atomicjolt/lti-types';
import { html } from '@atomicjolt/lti-endpoints';
import { APPLICATION_NAME, LTI_REGISTRATION_FINISH_PATH } from '../../definitions';

export function dynamicRegistrationHtml(
  platformConfiguration: PlatformConfiguration,
  registrationToken: string,
): string {
  const config = encodeURIComponent(JSON.stringify(platformConfiguration));
  const head = '';
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
  const head = '';
  const body = `
    <h1>Registration complete</h1>
    <script type="text/javascript">
      (window.opener || window.parent).postMessage({subject:"org.imsglobal.lti.close"}, "*");
    </script>
  `;

  return html(head, body);
}
