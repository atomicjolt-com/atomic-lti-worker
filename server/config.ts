import {
  AGS_SCOPE_LINE_ITEM,
  AGS_SCOPE_LINE_ITEM_READONLY,
  AGS_SCOPE_RESULT,
  AGS_SCOPE_SCORE,
  NAMES_AND_ROLES_SCOPE,
  type ToolConfiguration
} from '@atomicjolt/lti-types';
import { getDefaultToolConfiguration } from '@atomicjolt/lti-server';
import {
  clientName,
  initPath,
  jwksPath,
  launchPath,
  logoPath,
  policyUri,
  redirectPath,
  tosUri,
  email,
} from '../definitions';

export function getToolConfiguration(baseUrl: string): ToolConfiguration {
  const toolConfiguration = getDefaultToolConfiguration(
    baseUrl,
    clientName,
    initPath,
    jwksPath,
    launchPath,
    logoPath,
    policyUri,
    redirectPath,
    tosUri,
    email,
  );

  toolConfiguration.scope = [
    AGS_SCOPE_LINE_ITEM,
    AGS_SCOPE_LINE_ITEM_READONLY,
    AGS_SCOPE_RESULT,
    AGS_SCOPE_SCORE,
    NAMES_AND_ROLES_SCOPE,
  ].join(' ');

  // Modify toolConfiguration as needed for this tool
  return toolConfiguration;
}
