import type { PlatformConfiguration, ToolConfiguration } from '@atomicjolt/lti-types';
import { EnvBindings, Platform } from '@atomicjolt/lti-endpoints/types';
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

  // Modify toolConfiguration as needed for this tool
  return toolConfiguration;
}
