/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const async = require('async');
const bedrock = require('bedrock');
const brLedger = require('bedrock-ledger');
const crypto = require('crypto');
const equihash = require('equihash')('khovratovich');
const BedrockError = bedrock.util.BedrockError;

require('./config');

bedrock.events.on('bedrock.start', callback => {
  brLedger.use({
    capabilityName: 'EquihashValidator2017',
    capabilityValue: {
      type: 'validator',
      api: api
    }
  }, callback);
});

const api = {};
// NOTE: only exported for tests
module.exports = api;

api.isValid = function(event, guardConfig, callback) {
  if(!guardConfig.eventFilter.some(f =>
    f.type === 'EventTypeFilter' && f.eventType.includes(event.type))) {
    return callback(new BedrockError(
      'Invalid configuration.', 'InvalidConfig', {
        eventType: event.type
      }));
  }

  const unsignedEvent = bedrock.util.clone(event);
  const signature = unsignedEvent.signature;
  delete unsignedEvent.signature;

  async.auto({
    normalize: callback => bedrock.jsonld.normalize(unsignedEvent, {
      algorithm: 'URDNA2015',
      format: 'application/nquads'
    }, callback),
    verify: ['normalize', (results, callback) => {
      const hash =
        crypto.createHash('sha256').update(results.normalize, 'utf8').digest();
      const equihashOptions = {
        n: signature.equihashParameterN,
        k: signature.equihashParameterK,
        nonce: signature.nonce,
        value: Buffer.from(signature.signatureValue, 'base64')
      };
      callback(null, equihash.verify(hash, equihashOptions));
    }]
  }, (err, results) => {
    if(err) {
      return callback(err);
    }
    callback(null, results.verify);
  });
};
