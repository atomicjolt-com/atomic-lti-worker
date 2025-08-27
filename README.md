# Atomic LTI Worker

A Cloudflare Workers-based solution for handling LTI 1.3 launches on the Tool side.

## Demo

View the home page:
https://lti-worker.atomicjolt.win/

Register a Hello World LTI tool using [Dynamic Registration](https://www.imsglobal.org/spec/lti-dr/v1p0).
`https://lti-worker.atomicjolt.win/lti/register`

## Overview

This project provides a serverless implementation of the LTI 1.3 protocol using Cloudflare Workers. It handles all aspects of the Tool side of an LTI launch, including authentication, key management, and platform communication.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer)
- [Wrangler CLI](https://developers.cloudflare.com/workers/cli-wrangler/install-update) for Cloudflare Workers
- A Cloudflare account

## Deploy to Cloudflare

Deploy a simple Hello World LTI tool to Cloudflare with one click:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/atomicjolt-com/atomic-lti-worker)

If you encounter errors during the one click install don't fret. Instead, follow these steps:

1. clone down the newly created repository.
2. cd into the directory and run `npm i`
3. Run `npm run deploy`

The worker should deploy into your account. You may wish to change values in definitions.ts before deploy
to change names (the default name will atomic-lti-worker)

## Setup

### 1. Configuration

If you used the "Deploy to Cloudflare" button your wrangler.jsonc should already be modified with the ids for new Cloudflare Resources and you can skip step #2. Otherwise you will need to modify your wrangler.jsonc wtih the values generated in step #2

### 2. Create KV Namespaces

Run the following commands to create the required KV namespaces for both production and preview environments:

```bash
# For storing your tool's key pairs
npx wrangler kv:namespace create KEY_SETS
npx wrangler kv:namespace create KEY_SETS --preview

# For caching platform JWK sets
npx wrangler kv:namespace create REMOTE_JWKS
npx wrangler kv:namespace create REMOTE_JWKS --preview

# For managing client authentication tokens
npx wrangler kv:namespace create CLIENT_AUTH_TOKENS
npx wrangler kv:namespace create CLIENT_AUTH_TOKENS --preview

# For storing platform configurations
npx wrangler kv:namespace create PLATFORMS
npx wrangler kv:namespace create PLATFORMS --preview
```

After creating the namespaces, copy the returned IDs into your `wrangler.jsonc` file.

### 3. Platform Configuration

#### For Dynamic Registration

Atomic LTI worker supports dynamic registration which makes installing the tool into your platform simple. Change the tool configuration to meet your needs which will include changing the tool name, support email, etc:

- Modify `definitions.ts` to match your tool's configuration requirements
- A default tool configuration for dynamic registration is already setup but can be modified in src/config.ts as needed.
- Configuration provided by the platform once dynamic registration is finished is provied in src/register.ts. The handlePlatformResponse callback in this file gives you the opportunity to store values like client_id as needed.

Dynamic Registration URL
`https://yourdomain.com/lti/register`

#### For Manual Registration

If your LTI platform doesn't support dynamic registration:

- Update `install.json` with your tool's URLs and registration details

### 4. Build your app

This LTI tool is designed as a single page application (SPA).

If you need/want to make changes to the code that handles the LTI launch or if you need to store or modify values server side look at the code in:
`src/index.ts`

The client code can be found in:
`client/app.ts`

This is where you will want to build out your application.

### 5. Update configuration values

In scripts/inject-manifest.js look for 'atomic_lti_worker' and change it to match the folder name of your project. This will be the folder in the 'dist' directory where the cloudflare worker will be written for production

Search the project for 'Atomic LTI Worker' and change values to match your project name.

Search the project for 'atomic-lti-worker' and update values and urls to match your project.

## Development

### Local Development

To start a local development server:

```bash
npm run dev
```

This will start a local server at http://localhost:8787.

### Testing

Run the test suite with:

```bash
npm test
```

## Deployment

Deploy your worker to Cloudflare:

```bash
npm run deploy
```

To view logs after deployment:

```bash
npx wrangler tail
```

## Tips

Create a new KV namespace:

```bash
npx wrangler kv:namespace create <YOUR_NAMESPACE>
```

## Troubleshooting

If you encounter issues with your LTI integrations:

1. Check that your platform configuration is correct
2. Verify your JWKS endpoints are accessible
3. Examine the worker logs using `npx wrangler tail`
4. Ensure your KV namespaces are correctly configured in wrangler.toml

## License

This project is licensed under the MIT License - see the LICENSE file for details.
