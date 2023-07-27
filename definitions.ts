import {
  CANVAS_PUBLIC_JWKS_URL,
  CANVAS_OIDC_URL,
  CANVAS_AUTH_TOKEN_URL,
  CANVAS_BETA_PUBLIC_JWKS_URL,
  CANVAS_BETA_AUTH_TOKEN_URL,
  CANVAS_BETA_OIDC_URL,
} from '@atomicjolt/lti/src/libs/lti_definitions';
import type { Platforms } from '@atomicjolt/lti/src/types';

export const APP_NAME = 'Atomic LTI';
export const ALLOWED_LAUNCH_TIME = 600000; // 10 minutes

//////////////////////////////////////////////////////
// TODO these should be dynamic values stored in a database
export const PLATFORMS: Platforms = {
  'https://canvas.instructure.com': {
    iss: 'https://canvas.instructure.com',
    clientId: '43460000000000624',
    jwksUrl: CANVAS_PUBLIC_JWKS_URL,
    tokenUrl: CANVAS_AUTH_TOKEN_URL,
    oidcUrl: CANVAS_OIDC_URL,
  },
  'https://canvas.beta.instructure.com': {
    iss: 'https://canvas.beta.instructure.com',
    clientId: '43460000000000624',
    jwksUrl: CANVAS_BETA_PUBLIC_JWKS_URL,
    tokenUrl: CANVAS_BETA_AUTH_TOKEN_URL,
    oidcUrl: CANVAS_BETA_OIDC_URL,
  },
  'https://schoology.schoology.com': {
    iss: 'https://schoology.schoology.com',
    clientId: '1234',
    jwksUrl: "https://lti-service.svc.schoology.com/lti-service/.well-known/jwks",
    tokenUrl: "https://lti-service.svc.schoology.com/lti-service/access-token",
    oidcUrl: "https://lti-service.svc.schoology.com/lti-service/authorize-redirect",
  },
  'https://ltiadvantagevalidator.imsglobal.org': {
    iss: 'https://ltiadvantagevalidator.imsglobal.org',
    clientId: '1234',
    jwksUrl: "https://oauth2server.imsglobal.org/jwks",
    tokenUrl: "https://ltiadvantagevalidator.imsglobal.org/ltitool/authcodejwt.html",
    oidcUrl: "https://ltiadvantagevalidator.imsglobal.org/ltitool/oidcauthurl.html",
  },
  // Leave this in place for tests
  'https://lms.example.com': {
    iss: 'https://lms.example.com',
    clientId: '1234',
    jwksUrl: "https://lms.example.com/jwks",
    tokenUrl: "https://lms.example.com/auth",
    oidcUrl: "https://lms.example.com/oidc",
  },
};
