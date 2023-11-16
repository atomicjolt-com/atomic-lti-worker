import type { PlatformConfiguration } from '@atomicjolt/lti-types';
import { html } from '@atomicjolt/lti-endpoints';
import { registrationFinishPath } from '../tool_configuration';

export function dynamicRegistrationHtml(
  platformConfiguration: PlatformConfiguration,
  registrationToken: string,
): string {
  const head = "";
  const body = `
    <h1>Register</h1>
    <form action="${registrationFinishPath}" method="post">
      <input type="hidden" name="registrationEndpoint" value="${platformConfiguration.registration_endpoint}" />
      <input type="hidden" name="registrationToken" value="${registrationToken}" />
      <input type="submit" value="Finish Registration" />
    </form>
  `;
  return html(head, body);
}
