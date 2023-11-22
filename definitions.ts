// This needs to be changed per project
export const clientName = "Atomic Worker LTI Tool";

// Most of the defaults below should work fine.
export const initPath = "lti/init";
export const redirectPath = "lti/redirect";
export const jwksPath = "lti/jwks";
export const launchPath = "lti/launch";
export const logoPath = "assets/images/logo.png";
export const policyUri = "https://www.atomicjolt.com/privacy";
export const tosUri = "https://www.atomicjolt.com/tos";
export const email = "support@atomicjolt.com";

// Dynamic registration
export const registrationPath: string = 'lti/register';
export const registrationFinishPath: string = '/lti/register_finish';

// LTI Services
export const namesAndRolesPath: string = 'lti/names_and_roles';
export const signDeepLinkPath: string = 'lti/sign_deep_link';
