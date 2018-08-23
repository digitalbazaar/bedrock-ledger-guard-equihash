/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const brLedgerNode = require('bedrock-ledger-node');
const jsigs = require('jsonld-signatures')();
const equihashSigs = require('equihash-signature');
const {promisify} = require('util');
const validate = promisify(require('bedrock-validation').validate);
const {callbackify, BedrockError} = bedrock.util;

require('./config');

bedrock.events.on('bedrock.start', () => {
  jsigs.use('jsonld', bedrock.jsonld);
  equihashSigs.install(jsigs);

  brLedgerNode.use('EquihashValidator2018', {
    type: 'validator',
    api: api
  });
});

const api = {};
module.exports = api;

// TODO: callbackify can be removed when the test suite is updated
api.mustValidate = callbackify(async (input, validatorConfig, options) => {
  await api.validateConfiguration(validatorConfig);
  if(validatorConfig.validatorFilter &&
    !validatorConfig.validatorFilter.some(f =>
      f.type === 'ValidatorFilterByType' &&
    f.validatorFilterByType.includes(input.type))) {
    return false;
  }
  return true;
});

// TODO: callbackify can be removed when the test suite is updated
api.validateConfiguration = callbackify(async (validatorConfig, options) => {
  return validate('ledger-validator-equihash-config', validatorConfig);
});

// TODO: callbackify can be removed when the test suite is updated
api.validate = callbackify(async (input, validatorConfig, options) => {
  const proofCopy = bedrock.util.clone(input);
  const allProofs = [].concat(proofCopy.proof);
  const eqProofs = allProofs.filter(proof =>
    proof.type === 'EquihashProof2018' &&
    proof.equihashParameterN === validatorConfig.equihashParameterN &&
    proof.equihashParameterK === validatorConfig.equihashParameterK);
  if(eqProofs.length === 0) {
    throw new BedrockError(
      'No valid Equihash proof was found.', 'ValidationError', {
        httpStatusCode: 400,
        public: true,
        input,
        requiredEquihashParameters: {
          equihashParameterN: validatorConfig.equihashParameterN,
          equihashParameterK: validatorConfig.equihashParameterK
        }
      });
  }

  proofCopy.proof = eqProofs;

  const result = await jsigs.verify(proofCopy);
  if(!result.verified) {
    throw new BedrockError(
      'Equihash proof validation failed.', 'ValidationError', {
        httpStatusCode: 400,
        public: true,
        failedProof: proofCopy,
        input
      });
  }
  // success
  return true;
});
