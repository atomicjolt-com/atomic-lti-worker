import type { ToolConfiguration } from '@atomicjolt/lti-types';

//export const baseUrl = "https://atomic-oxide.atomicjolt.win";
export const initPath = "lti/init";
export const redirectPath = "lti/redirect";
export const jwksPath = "jwks";
export const launchPath = "lti/launch";
export const clientName = "Atomic Worker LTI Tool";
export const logoPath = "assets/images/logo.png";
export const policyUri = "https://www.atomicjolt.com/privacy";
export const tosUri = "https://www.atomicjolt.com/tos";
export const email = "support@atomicjolt.com";

// Dynamic registration
export const registrationPath: string = 'lti/register';
export const registrationFinishPath: string = '/lti/register_finish';

export function getToolConfiguration(baseUrl: string): ToolConfiguration {
  const launch_uri = `${baseUrl}/${launchPath}`;
  return {
    application_type: "web",
    response_types: ["id_token"],
    grant_types: ["implicit", "client_credentials"],
    initiate_login_uri: `${baseUrl}/${initPath}`,
    redirect_uris: [`${baseUrl}/${redirectPath}`],
    client_name: clientName,
    jwks_uri: `${baseUrl}/${jwksPath}`,
    logo_uri: `${baseUrl}/${logoPath}`,
    client_uri: `https://${baseUrl}`,
    policy_uri: policyUri,
    tos_uri: tosUri,
    token_endpoint_auth_method: "private_key_jwt",
    contacts: [email],
    scope: "line_item line_item_readonly result score names_and_roles",
    "https://purl.imsglobal.org/spec/lti-tool-configuration": {
      domain: baseUrl,
      description: clientName,
      target_link_uri: launch_uri,
      custom_parameters: {
        "context_id_history": "$Context.id.history",
        "resource_link_id_history": "$ResourceLink.id.history",
      },
      claims: [
        "iss",
        "sub",
        "name",
        "given_name",
        "family_name",
        "https://purl.imsglobal.org/spec/lti/claim/context",
        "https://purl.imsglobal.org/spec/lti/claim/tool_platform",
      ],
      messages: [{
        type: "LtiDeepLinkingRequest",
        target_link_uri: launch_uri,
        label: clientName,
        placements: ["ContentItemSelection"],
      }],
    },
  };
}
