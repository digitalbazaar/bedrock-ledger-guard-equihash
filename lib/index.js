/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const brLedger = require('bedrock-ledger-node');
const equihashSigs = require('equihash-signature');
const validate = require('bedrock-validation').validate;
const BedrockError = bedrock.util.BedrockError;

require('./config');

bedrock.events.on('bedrock.start', () => brLedger.use('EquihashValidator2017', {
  type: 'validator',
  api: api
}));

const api = {};
// NOTE: only exported for tests
module.exports = api;

api.mustValidateEvent = (event, validatorConfig, options, callback) => {
  if(typeof options === 'function') {
    callback = options;
    options = {};
  }
  api.validateConfiguration(validatorConfig, err => {
    if(err) {
      return callback(err);
    }
    if(validatorConfig.eventFilter && !validatorConfig.eventFilter.some(f =>
      f.type === 'EventTypeFilter' && f.eventType.includes(event.type))) {
      return callback(null, false);
    }
    callback(null, true);
  });
};

api.validateConfiguration = (validatorConfig, callback) =>
  validate('ledger-validator-equihash-config', validatorConfig, callback);

api.validateEvent = (event, validatorConfig, callback) => {
  const eventCopy = bedrock.util.clone(event);
  const allSigs = [].concat(eventCopy.signature);
  const eqSigs = allSigs.filter(s =>
    s.type === 'EquihashProof2017' &&
    s.equihashParameterN === validatorConfig.equihashParameterN &&
    s.equihashParameterK === validatorConfig.equihashParameterK
  );
  if(eqSigs.length === 0) {
    return callback(new BedrockError(
      'No valid Equihash proof was found.', 'ValidationError', {
        httpStatusCode: 400,
        public: true,
        event,
        requiredEquihashParameters: {
          equihashParameterN: validatorConfig.equihashParameterN,
          equihashParameterK: validatorConfig.equihashParameterK
        }
      }));
  }
  eventCopy.signature = eqSigs[0];

  equihashSigs.verify(eventCopy, (err, result) => {
    if(err) {
      return callback(err);
    }
    if(!result) {
      return callback(new BedrockError(
        'Equihash signature validation failed.', 'ValidationError', {
          httpStatusCode: 400,
          public: true,
          event
        }));
    }
    // success
    callback();
  });

};
