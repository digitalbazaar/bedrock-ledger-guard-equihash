/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const mock = {};
module.exports = mock;

const ledgerConfigurations = mock.ledgerConfigurations = {};
const operations = mock.operations = {};

ledgerConfigurations.equihash = {
  '@context': 'https://w3id.org/webledger/v1',
  type: 'WebLedgerConfiguration',
  ledger: 'did:v1:eb8c22dc-bde6-4315-92e2-59bd3f3c7d59',
  consensusMethod: 'UnilateralConsensus2017',
  operationValidator: [{
    type: 'EquihashValidator2018',
    validatorFilter: [{
      type: 'ValidatorFilterByType',
      validatorFilterByType: ['CreateWebLedgerRecord']
    }],
    equihashParameterN: 64,
    equihashParameterK: 3
  }]
};

operations.alpha = {
  '@context': 'https://w3id.org/webledger/v1',
  type: 'CreateWebLedgerRecord',
  record: {
    '@context': 'https://schema.org/',
    value: 'a2035188-372a-4afb-9cf2-7d99baebae88'
  }
};
