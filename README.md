# Atomic LTI Worker
This project uses Cloudflare workers to handle a Tool side LTI 1.3 launch.

## Usage
1. Rename wrangler.toml.example to wrangler.toml and then setup the required kv workers. Setup both production and preview namespaces:

  `npx wrangler kv:namespace create OAUTH_STATE`
  `npx wrangler kv:namespace create OAUTH_STATE --preview`

2. Edit definitions.ts
  Update PLATFORMS to point to your platforms:
  `export const PLATFORMS: Platforms = {}`

  Change APP_NAME to be your app name.

3. Update install.json with your tool's URLs

## Deploy
To deploy the worker, run the following command:
  `wrangler publish`

## Tips

Setup a new namespace
  `npx wrangler kv:namespace create <YOUR_NAMESPACE>`

# TODO
Consider changing OIDC storage to a durable object. Look for:
c.env.OIDC
