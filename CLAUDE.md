# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start local development server at http://localhost:8787
- `npm run build` - Build production bundle with TypeScript compilation and manifest injection
- `npm run check` - Validate TypeScript, build, and do a dry-run deployment
- `npm run deploy` - Build and deploy to Cloudflare Workers
- `npm test` - Run Vitest test suite
- `npm run tail` - Stream live logs from deployed worker
- `npm run types` - Generate Wrangler types

### Testing
- Run all tests: `npm test`
- Run tests in watch mode: `npm test -- --watch`
- Run a specific test file: `npm test -- path/to/test.ts`

## Architecture Overview

This is a Cloudflare Workers-based LTI 1.3 tool implementation using a serverless edge architecture:

### Core Components

1. **Server-Side (Cloudflare Worker)**
   - Entry point: `src/index.ts` - Hono app handling all LTI routes and services
   - LTI endpoints managed via `@atomicjolt/lti-endpoints` package
   - State management through Cloudflare KV namespaces and Durable Objects
   - Dynamic registration support with configurable tool settings

2. **Client-Side (SPA)**
   - Entry points: `client/app.ts` (LTI launch), `client/home.ts` (home page), `client/app-init.ts` (OIDC init)
   - Built with Vite, deployed as static assets
   - Handles post-launch interactions including deep linking and names/roles services

3. **Storage Architecture (Cloudflare KV)**
   - `KEY_SETS`: Tool's RSA key pairs for JWT signing
   - `REMOTE_JWKS`: Cached platform JWK sets
   - `CLIENT_AUTH_TOKENS`: OAuth client credentials
   - `PLATFORMS`: Platform configurations from dynamic registration
   - `OIDC_STATE` (Durable Object): Manages OIDC state during authentication flow

4. **Configuration**
   - `definitions.ts`: Central constants for paths, names, and URLs
   - `src/config.ts`: Tool configuration for dynamic registration
   - `wrangler.jsonc`: Cloudflare Workers deployment configuration

### LTI Flow

1. Platform initiates at `/lti/init` with OIDC authentication request
2. Worker validates and redirects to platform's auth endpoint
3. Platform returns to `/lti/redirect` with auth response
4. Worker validates JWT and redirects to `/lti/launch` with state
5. Launch page validates and loads client application

### Key Integration Points

- Dynamic registration: `/lti/register` endpoint for automatic platform setup
- Deep linking: Client-side handling with server JWT signing at `/lti/sign_deep_link`
- Names and roles service: `/lti/names_and_roles` for roster retrieval
- Asset serving: Vite-built files served from `public/` with manifest injection

## Important Context

- All LTI protocol handling is abstracted through `@atomicjolt/lti-*` packages
- Client scripts are injected dynamically based on manifest.json for cache busting
- Frame options are set to ALLOWALL for LMS iframe embedding
- TypeScript strict mode enforced - run `tsc` before deploying