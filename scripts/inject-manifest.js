#!/usr/bin/env node

/**
 * Script to inject manifest data into the built worker
 * This runs after the build process to embed the manifest.json contents
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const DIST_DIR = './dist';
const CLIENT_MANIFEST_PATH = join(DIST_DIR, 'client', 'manifest.json');
const WORKER_JS_PATH = join(DIST_DIR, 'atomic_lti_worker', 'index.js');

try {
  console.log('Starting manifest injection...');

  // Check if manifest exists
  if (!existsSync(CLIENT_MANIFEST_PATH)) {
    console.log('No client manifest.json found in dist/client/, skipping manifest injection');
    process.exit(0);
  }
  console.log('✓ Client manifest found');

  // Check if worker file exists
  if (!existsSync(WORKER_JS_PATH)) {
    console.log('Worker file not found, skipping manifest injection');
    process.exit(0);
  }
  console.log('✓ Worker file found');

  // Read the manifest data
  const manifestData = JSON.parse(readFileSync(CLIENT_MANIFEST_PATH, 'utf8'));
  console.log('✓ Loaded manifest with entries:', Object.keys(manifestData));

  // Read the worker file
  let workerContent = readFileSync(WORKER_JS_PATH, 'utf8');
  console.log('✓ Read worker file');

  // Replace the empty manifestData with actual data
  const manifestDataString = JSON.stringify(manifestData, null, 2);
  const searchPattern = /let manifestData = \{\};/;

  if (searchPattern.test(workerContent)) {
    console.log('✓ Found manifestData declaration, injecting data...');
    workerContent = workerContent.replace(
      searchPattern,
      `let manifestData = ${manifestDataString};`
    );

    // Write the updated worker file
    writeFileSync(WORKER_JS_PATH, workerContent);
    console.log('✅ Successfully injected manifest data into worker');
  } else {
    console.log('❌ Could not find manifestData initialization in worker file');
    console.log('Searching for alternative patterns...');

    // Try to find if manifestData is already populated
    if (workerContent.includes('let manifestData = {')) {
      console.log('ℹ️  manifestData appears to already be populated');
    } else {
      console.log('ℹ️  manifestData declaration not found at all');
    }
  }

} catch (error) {
  console.error('Error injecting manifest:', error);
  process.exit(1);
}
