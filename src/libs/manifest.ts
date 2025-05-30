// Import the manifest if it exists. In development mode, this might fail
interface ManifestEntry {
  file: string;
  name: string;
  src?: string;
  isEntry?: boolean;
  imports?: string[];
}

let manifestData: Record<string, ManifestEntry> = {};

// In development, manifestData remains empty and we use fallback paths
// In production, this will be populated with actual manifest data by the build process

/**
 * Get the file path for a client asset from the manifest
 * @param entryName - The name of the entry file (e.g. 'client/app.ts')
 * @returns The hashed file path from the manifest or a fallback path for development
 */
export function getClientAssetPath(entryName: string): string {
  console.log(`Getting client asset path for: ${entryName}`);
  // In development, Vite serves files directly without hashing
  if (Object.keys(manifestData).length === 0) {
    console.log('Using development paths, no manifest data available');
    // Convert .ts to .js for development paths
    return entryName.replace(/\.ts$/, '.js');
  }

  if (!manifestData[entryName]) {
    console.error(`Entry ${entryName} not found in manifest`);
    // Fallback to unhashed name
    return entryName.replace(/\.ts$/, '.js');
  }

  console.log(`Found entry ${entryName} in manifest, returning path: ${manifestData[entryName].file}`);

  return manifestData[entryName].file;
}

/**
 * Get all client assets from the manifest
 * @returns A map of entry names to file paths
 */
export function getAllClientAssets(): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [entryName, entry] of Object.entries(manifestData)) {
    result[entryName] = entry.file;
  }
  return result;
}