import * as esbuild from 'esbuild';
import fs from 'node:fs';

const [env] = process.argv.slice(2);
const entryPoints = ['client/app-init.ts', 'client/app.ts', 'client/home.ts'];

const metafilePlugin = {
  name: 'metafileWriter',
  setup(build) {
    build.onEnd((result) => {
      if (result.errors.length === 0) {
        const out = {};
        Object.keys(result.metafile.outputs).forEach((dest) => {
          const data = result.metafile.outputs[dest];
          if (data.entryPoint) {
            // Remove the public prefix. It's not included in the public URL.
            out[data.entryPoint] = dest.replace('public/', '');
          }
        });
        fs.writeFileSync(
          baseConfig.outdir + '/metafile.json',
          JSON.stringify(out, null, 2),
        );
      }
    });
  },
};

const indexHtmlPath = 'public/index.html';
const htmlFileWriter = {
  name: 'htmlFileWriter',
  setup(build) {
    build.onEnd((result) => {
      if (result.errors.length === 0) {
        Object.keys(result.metafile.outputs).forEach((dest) => {
          const data = result.metafile.outputs[dest];
          if (data.entryPoint === 'client/home.ts') {
            // Read the HTML file
            const html = fs.readFileSync(indexHtmlPath, 'utf-8');

            // Replace the script src with the new transpiled JavaScript file name
            const newHtml = html.replace(
              /<script id="main-script" src=".+.js"><\/script>/g, 
              `<script id="main-script" src="${dest.replace('public/', '')}"></script>`
            );

            // Write the new HTML back to the file
            fs.writeFileSync(indexHtmlPath, newHtml);            
          }
        });
      }
    });
  }
};

const baseConfig = {
  entryPoints,
  bundle: true,
  outdir: 'public/dist',
  publicPath: 'assets',
  entryNames: '[name]-[hash]',
  assetNames: '[name]-[hash]',
  chunkNames: '[name][hash]',
  metafile: true,
  logLevel: 'info',
  //splitting: true,
  //format: 'esm',
  plugins: [metafilePlugin, htmlFileWriter],
  loader: {
    '.js': 'jsx',
    '.json': 'json',
    '.png': 'file',
    '.woff': 'file',
    '.woff2': 'file',
    '.eot': 'file',
    '.ttf': 'file',
    '.svg': 'file',
    '.jpg': 'file',
    '.lazy.json': 'file',
  },
};

if (env === 'dev') {
  const ctx = await esbuild.context({
    ...baseConfig,
    sourcemap: 'inline',
  });
  await ctx.watch();
} else {
  await esbuild.build({
    ...baseConfig,
    sourcemap: 'external',
    treeShaking: true,
    minify: true,
  });
}
