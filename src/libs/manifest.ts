// Import the manifest if it exists. In development mode, this might fail
let manifestData: Record<string, string> = {};
try {
  // In production, the manifest will exist
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - Dynamic import
  manifestData = require('manifest.json');
} catch (e) {
  // In development, we'll use unhashedpaths
  console.log('No manifest.json found, using development paths');
}

/**
 * Get the file path for a client asset from the manifest
 * @param entryName - The name of the entry file (e.g. 'client/app.ts')
 * @returns The hashed file path from the manifest or a fallback path for development
 */
export function getClientAssetPath(entryName: string): string {
  // In development, Vite serves files directly without hashing
  if (Object.keys(manifestData).length === 0) {
    // Convert .ts to .js for development paths
    return entryName.replace(/\.ts$/, '.js');
  }

  if (!manifestData[entryName]) {
    console.error(`Entry ${entryName} not found in manifest`);
    // Fallback to unhashed name
    return entryName.replace(/\.ts$/, '.js');
  }

  return manifestData[entryName];
}

/**
 * Get all client assets from the manifest
 * @returns A map of entry names to file paths
 */
export function getAllClientAssets(): Record<string, string> {
  return manifestData;
}