# Atomic LTI Worker

This project uses Cloudflare workers to handle a Tool side LTI 1.3 launch.

## Usage

1. Rename wrangler.toml.example to wrangler.toml and then setup the required kv workers.
   Setup both production and preview namespaces and the copy the ids into wrangler.toml:

`     npx wrangler kv:namespace create OAUTH_STATE
    npx wrangler kv:namespace create OAUTH_STATE --preview
    npx wrangler kv:namespace create KEY_SETS
    npx wrangler kv:namespace create KEY_SETS --preview
    npx wrangler kv:namespace create REMOTE_JWKS
    npx wrangler kv:namespace create REMOTE_JWKS --preview
    npx wrangler kv:namespace create OIDC
    npx wrangler kv:namespace create OIDC --preview
    npx wrangler kv:namespace create CLIENT_AUTH_TOKENS
    npx wrangler kv:namespace create CLIENT_AUTH_TOKENS --preview
    npx wrangler kv:namespace create PLATFORMS
    npx wrangler kv:namespace create PLATFORMS --preview
  `

2. Platform setup
   If you are using dynamic registration
   Change server/tool_configuration.ts to match the tool's config

If your platform doesn't support dynamic registration:
Update install.json with your tool's URLs

## Deploy

To deploy the worker, run the following command:
`wrangler publish`

## Tips

Setup a new namespace
`npx wrangler kv:namespace create <YOUR_NAMESPACE>`
