/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const bedrock = require('bedrock');
const brLedger = require('bedrock-ledger');
const BedrockError = bedrock.util.BedrockError;

require('./config');

bedrock.events.on('bedrock.start', callback => {
  brLedger.use({
    capabilityName: 'EquihashGuard2017',
    capabilityValue: {
      type: 'guard',
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
        eventType: event.type,
        supportedEventType: guardConfig.supportedEventType
      }));
  }

  // FIXME: Implement
  callback(null, true);
};
