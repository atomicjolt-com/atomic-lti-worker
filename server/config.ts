import {
  AGS_SCOPE_LINE_ITEM,
  AGS_SCOPE_LINE_ITEM_READONLY,
  AGS_SCOPE_RESULT,
  AGS_SCOPE_SCORE,
  NAMES_AND_ROLES_SCOPE,
  LTI_PLATFORM_CONFIGURATION,
  PlatformConfiguration,
  type ToolConfiguration
} from '@atomicjolt/lti-types';
import {
  buildToolConfiguration,
  ToolConfigurationParams
} from '@atomicjolt/lti-server';
import {
  APPLICATION_NAME,
  LTI_INIT_PATH,
  LTI_JWKS_PATH,
  LTI_LAUNCH_PATH,
  LOGO_PATH,
  POLICY_URL,
  LTI_REDIRECT_PATH,
  TOS_URL,
  SUPPORT_EMAIL,
} from '../definitions';

export function getToolConfiguration(platformConfig: PlatformConfiguration, host: string): ToolConfiguration {
  const scope = [
    AGS_SCOPE_LINE_ITEM,
    AGS_SCOPE_LINE_ITEM_READONLY,
    AGS_SCOPE_RESULT,
    AGS_SCOPE_SCORE,
    NAMES_AND_ROLES_SCOPE,
  ].join(' ');

  const ltiPlatformConfig = platformConfig[LTI_PLATFORM_CONFIGURATION];

  const params: ToolConfigurationParams = {
    host,
    clientName: APPLICATION_NAME,
    description: APPLICATION_NAME,
    initPath: LTI_INIT_PATH,
    jwksPath: LTI_JWKS_PATH,
    launchPath: LTI_LAUNCH_PATH,
    logoPath: LOGO_PATH,
    policyUri: POLICY_URL,
    redirectPath: LTI_REDIRECT_PATH,
    tosUri: TOS_URL,
    email: SUPPORT_EMAIL,
    scope,
    productFamilyCode: ltiPlatformConfig?.product_family_code,
    courseNav: true,
    doDeepLinking: true,
  }

  const toolConfiguration = buildToolConfiguration(params);

  // Modify toolConfiguration as needed for this tool
  return toolConfiguration;
}
