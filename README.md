# Atomic LTI Worker

A Cloudflare Workers-based solution for handling LTI 1.3 launches on the Tool side.

## Overview

This project provides a serverless implementation of the LTI 1.3 protocol using Cloudflare Workers. It handles all aspects of the Tool side of an LTI launch, including authentication, key management, and platform communication.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or newer)
- [Wrangler CLI](https://developers.cloudflare.com/workers/cli-wrangler/install-update) for Cloudflare Workers
- A Cloudflare account

## Setup

### 1. Configuration

Copy the example configuration file to create your own:

```bash
cp wrangler.toml.example wrangler.toml
```

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

After creating the namespaces, copy the returned IDs into your `wrangler.toml` file.

### 3. Platform Configuration

#### For Dynamic Registration

If your LTI platform supports dynamic registration:

- Modify `server/tool_configuration.ts` to match your tool's configuration requirements

#### For Manual Registration

If your LTI platform doesn't support dynamic registration:

- Update `install.json` with your tool's URLs and registration details

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
