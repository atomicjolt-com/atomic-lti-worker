import { importPKCS8 } from 'jose';
import { expect, it, describe, afterEach } from 'vitest';
import { IdToken } from '@atomicjolt/lti-client/src/libs/lti_definitions';
import type { KeySet } from '@atomicjolt/lti-server/src/types';

import {
  getJwks,
  signJwtPrivate,
  verifyJwtPublic,
  generateKeySet,
  getKeySets,
  keySetsToJwks,
  rotateKeys,
  JWKS_KV_KEY,
  alg,
} from './jwt';

const env = getMiniflareBindings();
const clientId = '43460000000000572';

export const test_id_token: IdToken = {
  'https://purl.imsglobal.org/spec/lti/claim/message_type': 'LtiResourceLinkRequest',
  'https://purl.imsglobal.org/spec/lti/claim/version': '1.3.0',
  'https://purl.imsglobal.org/spec/lti/claim/resource_link': {
    'id': 'a8a76fb8fbcc2d09787dafd28564e2ecdab51f11',
    'description': null,
    'title': '8th Grade Math',
    'validation_context': null,
    'errors': {
      'errors': {}
    }
  },
  'aud': clientId,
  'azp': clientId,
  'https://purl.imsglobal.org/spec/lti/claim/deployment_id': '22108:a8a76fb8fbcc2d09787dafd28564e2ecdab51f11',
  'iss': 'https://canvas.instructure.com',
  'nonce': 'ff3719333ec73654a962018adf0c0fe313531ec78fb5a7f5ad4188f786d16eb1ff5b6f3fbcbac00acdc1211b78afd1a01d3f304a84fe7b6da0a7ab0d93c16e0e',
  'sub': 'cfca15d8-2958-4647-a33e-a7c4b2ddab2c',
  'https://purl.imsglobal.org/spec/lti/claim/target_link_uri': 'https://assessments.atomicjolt.win/lti_launches',
  'picture': 'https://canvas.instructure.com/images/messages/avatar-50.png',
  'email': 'testguy@example.com',
  'name': 'testguy@example.com',
  'given_name': 'testguy@example.com',
  'family_name': '',
  'https://purl.imsglobal.org/spec/lti/claim/lis': {
    'person_sourcedid': '1234',
    'course_section_sourcedid': '32',
    'course_offering_sourcedid': 'MATH1010032016S',
    'validation_context': null,
    'errors': {
      'errors': {}
    }
  },
  'https://purl.imsglobal.org/spec/lti/claim/context': {
    'id': 'a8a76fb8fbcc2d09787dafd28564e2ecdab51f11',
    'label': 'Grade 8 Math',
    'title': '8th Grade Math',
    'type': [
      'http://purl.imsglobal.org/vocab/lis/v2/course#CourseOffering'
    ],
    'validation_context': null,
    'errors': {
      'errors': {}
    }
  },
  'https://purl.imsglobal.org/spec/lti/claim/tool_platform': {
    'guid': '4MRcxnx6vQbFXxhLb8005m5WXFM2Z2i8lQwhJ1QT:canvas-lms',
    'name': 'Atomic Jolt',
    'version': 'cloud',
    'product_family_code': 'canvas',
    'validation_context': null,
    'errors': {
      'errors': {}
    }
  },
  'https://purl.imsglobal.org/spec/lti/claim/launch_presentation': {
    'document_target': 'iframe',
    'return_url': 'https://atomicjolt.instructure.com/courses/253/external_content/success/external_tool_redirect',
    'locale': 'en',
    'height': 400,
    'width': 800,
    'validation_context': null,
    'errors': {
      'errors': {}
    }
  },
  'locale': 'en',
  'https://purl.imsglobal.org/spec/lti/claim/roles': [
    'http://purl.imsglobal.org/vocab/lis/v2/institution/person#Administrator',
    'http://purl.imsglobal.org/vocab/lis/v2/institution/person#Instructor',
    'http://purl.imsglobal.org/vocab/lis/v2/institution/person#Student',
    'http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor',
    'http://purl.imsglobal.org/vocab/lis/v2/membership#Learner',
    'http://purl.imsglobal.org/vocab/lis/v2/system/person#User'
  ],
  'https://purl.imsglobal.org/spec/lti/claim/custom': {
    'canvas_sis_id': '$Canvas.user.sisid',
    'canvas_user_id': '1',
    'canvas_course_id': '253',
    'canvas_term_name': 'Fall 2022',
    'canvas_account_id': '66',
    'canvas_api_domain': 'atomicjolt.instructure.com',
    'canvas_section_ids': '247',
    'context_id_history': '',
    'canvas_account_name': 'test',
    'canvas_assignment_id': '$Canvas.assignment.id',
    'canvas_user_timezone': 'America/Denver',
    'canvas_root_account_id': '1'
  },
  'https://purl.imsglobal.org/spec/lti/claim/lti11_legacy_user_id': '0340cde37624c04979a6c3fdd0afc2479f8405ad',
  'https://purl.imsglobal.org/spec/lti/claim/lti1p1': {
    'user_id': '0340cde37624c04979a6c3fdd0afc2479f8405ad',
    'validation_context': null,
    'errors': {
      'errors': {}
    }
  },
  'errors': {
    'errors': {}
  },
  'https://purl.imsglobal.org/spec/lti-ags/claim/endpoint': {
    'scope': [
      'https://purl.imsglobal.org/spec/lti-ags/scope/lineitem',
      'https://purl.imsglobal.org/spec/lti-ags/scope/result.readonly',
      'https://purl.imsglobal.org/spec/lti-ags/scope/score',
      'https://purl.imsglobal.org/spec/lti-ags/scope/lineitem.readonly'
    ],
    'lineitems': 'https://atomicjolt.instructure.com/api/lti/courses/253/line_items',
    'validation_context': null,
    'errors': {
      'errors': {}
    }
  },
  'https://purl.imsglobal.org/spec/lti-nrps/claim/namesroleservice': {
    'context_memberships_url': 'https://atomicjolt.instructure.com/api/lti/courses/253/names_and_roles',
    'service_versions': [
      '2.0'
    ],
    'validation_context': null,
    'errors': {
      'errors': {}
    }
  },
  'https://www.instructure.com/placement': 'course_navigation'
}

type JwtPieces = { keySet: KeySet, signed: string; };

export async function genJwt(token: IdToken = test_id_token): Promise<JwtPieces> {
  const keySet = await generateKeySet();
  const pri = await importPKCS8(keySet.privateKey, alg);
  const signed = await signJwtPrivate(pri, token);
  return { keySet, signed };
}

describe('jwt', () => {
  afterEach(async () => {
    await env.JWKS.delete(JWKS_KV_KEY);
  });

  it('calls getJwks to find a valid jwk', async () => {
    const jwks = await getJwks(env.JWKS);
    expect(jwks["keys"][0]["alg"]).toEqual(alg);
  });

  it('signs using signJwtPrivate and then decodes using verifyJwtPublic', async () => {
    const { keySet, signed } = await genJwt();
    const jwks = await keySetsToJwks([keySet]);
    const decodedResult = await verifyJwtPublic(jwks, signed);
    expect(decodedResult.verified).toEqual(true);
  });

  it('fails when the key is incorrect', async () => {
    const { signed } = await genJwt();
    const keySet = await generateKeySet();
    const jwks = await keySetsToJwks([keySet]);
    const decodedResult = await verifyJwtPublic(jwks, signed);
    expect(decodedResult.verified).toEqual(false);
    expect(decodedResult.error).toEqual('JWSSignatureVerificationFailed: signature verification failed');
  });

  it('stores a new public/private key set in KV', async () => {
    await env.JWKS.delete(JWKS_KV_KEY);
    const notThere = await env.JWKS.get(JWKS_KV_KEY);
    expect(notThere).toEqual(null);
    await getKeySets(env.JWKS);
    const there = await env.JWKS.get(JWKS_KV_KEY);
    expect(there?.length).toBeTruthy();
  });

  it('rotates the stored jwk keys', async () => {
    await env.JWKS.delete(JWKS_KV_KEY);

    const keySets = await getKeySets(env.JWKS);
    expect(keySets.length).toEqual(1);

    await rotateKeys(env.JWKS);
    const keySets2 = await getKeySets(env.JWKS);
    expect(keySets2.length).toEqual(2);

    const key1 = keySets[0];
    const key2 = keySets2[0];

    expect(key1.privateKey).toEqual(key2.privateKey);
  });

  it('rotates removes old jwk keys when rotating', async () => {
    await env.JWKS.delete(JWKS_KV_KEY);
    await getKeySets(env.JWKS);
    await rotateKeys(env.JWKS);
    await rotateKeys(env.JWKS);
    await rotateKeys(env.JWKS);
    await rotateKeys(env.JWKS);
    const keySets = await getKeySets(env.JWKS);

    const count = keySets.length;
    expect(count).toEqual(3);
  });
});
