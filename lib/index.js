/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const brLedger = require('bedrock-ledger-node');
const jsigs = require('jsonld-signatures')();
const equihashSigs = require('equihash-signature');
const validate = require('bedrock-validation').validate;
const BedrockError = bedrock.util.BedrockError;

require('./config');

bedrock.events.on('bedrock.start', () => {
  jsigs.use('jsonld', bedrock.jsonld);
  equihashSigs.install(jsigs);

  brLedger.use('EquihashValidator2018', {
    type: 'validator',
    api: api
  });
});

const api = {};
module.exports = api;

api.mustValidate = (input, validatorConfig, options, callback) => {
  if(typeof options === 'function') {
    callback = options;
    options = {};
  }
  api.validateConfiguration(validatorConfig, err => {
    if(err) {
      return callback(err);
    }
    if(validatorConfig.validatorFilter &&
      !validatorConfig.validatorFilter.some(f =>
      f.type === 'ValidatorFilterByType' &&
      f.validatorFilterByType.includes(input.type))) {
      return callback(null, false);
    }
    callback(null, true);
  });
};

api.validateConfiguration = (validatorConfig, callback) =>
  validate('ledger-validator-equihash-config', validatorConfig, callback);

api.validate = (input, validatorConfig, callback) => {
  const proofCopy = bedrock.util.clone(input);
  const allProofs = [].concat(proofCopy.proof);
  const eqProofs = allProofs.filter(proof =>
    proof.type === 'EquihashProof2018' &&
    proof.equihashParameterN === validatorConfig.equihashParameterN &&
    proof.equihashParameterK === validatorConfig.equihashParameterK
  );
  if(eqProofs.length === 0) {
    return callback(new BedrockError(
      'No valid Equihash proof was found.', 'ValidationError', {
        httpStatusCode: 400,
        public: true,
        input,
        requiredEquihashParameters: {
          equihashParameterN: validatorConfig.equihashParameterN,
          equihashParameterK: validatorConfig.equihashParameterK
        }
      }));
  }

  proofCopy.proof = eqProofs;

  jsigs.verify(proofCopy, (err, result) => {
    if(err) {
      return callback(err);
    }
    if(!result.verified) {
      return callback(new BedrockError(
        'Equihash proof validation failed.', 'ValidationError', {
          httpStatusCode: 400,
          public: true,
          failedProof: proofCopy,
          input
        }));
    }
    // success
    callback(null, true);
  });
};
