import { HandlePlatformResponse } from "@atomicjolt/lti-endpoints/dist/handlers/dynamic_registration_finish";
import { ToolConfiguration } from "@atomicjolt/lti-types";


export const handlePlatformResponse: HandlePlatformResponse = (platformResponse: ToolConfiguration) => {
  // TODO store client id or deployment id here as needed
  // platformResponse.client_id
  // platformResponse[LTI_TOOL_CONFIGURATION].deployment_id
  console.log('--------------------------------------------------------');
  console.log('platformResponse', platformResponse);

  return null;
};