/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */

const mock = {};
module.exports = mock;

const ledgers = mock.ledgers = {};
const events = mock.events = {};

ledgers.alpha = {
  config: {
    '@context': 'https://w3id.org/webledger/v1',
    type: 'WebLedgerConfigurationEvent',
    operation: 'Config',
    input: [{
      type: 'WebLedgerConfiguration',
      ledger: 'did:v1:c02915fc-672d-4568-8e6e-b12a0b35cbb3',
      consensusMethod: 'UnilateralConsensus2017',
      eventValidator: [{
        type: 'EquihashValidator2017',
        eventFilter: [{
          type: 'EventTypeFilter',
          eventType: ['WebLedgerEvent']
        }],
        equihashParameterN: 64,
        equihashParameterK: 3
      }]
    }]
  }
};

events.alpha = {
  '@context': 'https://w3id.org/webledger/v1',
  type: 'WebLedgerEvent',
  operation: 'Create',
  input: [{
    '@context': 'https://schema.org/',
    value: 'a2035188-372a-4afb-9cf2-7d99baebae88'
  }]
};
