import { HandlePlatformResponse } from "@atomicjolt/lti-endpoints/dist/handlers/dynamic_registration_finish";
import { RegistrationConfiguration } from "@atomicjolt/lti-types";


export const handlePlatformResponse: HandlePlatformResponse = (registrationConfiguration: RegistrationConfiguration) => {
  // Store client id or deployment id here as needed
  // platformResponse.client_id
  // platformResponse[LTI_TOOL_CONFIGURATION].deployment_id
  console.log('--------------------------------------------------------');
  console.log('registrationConfiguration', registrationConfiguration);

  return null;
};