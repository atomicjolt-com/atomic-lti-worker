import { KVNamespace } from '@cloudflare/workers-types';
import type { ToolConfiguration, PlatformConfiguration } from '@atomicjolt/lti-types';

export async function handlePlatformConfiguration(config: PlatformConfiguration, platforms_kv: KVNamespace) {
  await platforms_kv.put(config.issuer, JSON.stringify(config));
}

export function handlePlatformResponse(config: ToolConfiguration, platforms_kv: KVNamespace) {
  // store client id or deployment id here as needed
}
