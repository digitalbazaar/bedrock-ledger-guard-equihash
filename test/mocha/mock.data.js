/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */

const mock = {};
module.exports = mock;

const ledgers = mock.ledgers = {};
const configs = mock.configs = {};
const events = mock.events = {};

configs.equihash = {
  '@context': 'https://w3id.org/webledger/v1',
  type: 'WebLedgerConfigurationEvent',
  ledgerConfiguration: {
    type: 'WebLedgerConfiguration',
    ledger: 'did:v1:eb8c22dc-bde6-4315-92e2-59bd3f3c7d59',
    consensusMethod: 'UnilateralConsensus2017',
    eventValidator: [{
      type: 'EquihashValidator2017',
      eventFilter: [{
        type: 'EventTypeFilter',
        eventType: ['WebLedgerEvent']
      }],
      equihashParameterN: 64,
      equihashParameterK: 3
    }],
    requireEventValidation: true
  }
};

events.alpha = {
  '@context': 'https://w3id.org/webledger/v1',
  type: 'WebLedgerEvent',
  operation: [{
    '@context': 'https://w3id.org/webledger/v1',
    type: 'CreateWebLedgerRecord',
    record: {
      '@context': 'https://schema.org/',
      value: 'a2035188-372a-4afb-9cf2-7d99baebae88'
    }
  }]
};
