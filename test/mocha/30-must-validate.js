/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* globals should */

'use strict';

const brValidator = require('bedrock-ledger-validator-equihash');
const mockData = require('./mock.data');

describe('mustValidateEvent API', () => {
  it('should return true on a WebLedgerEvent event', done => {
    const event = mockData.events.alpha;
    const testConfig =
      mockData.configs.equihash.ledgerConfiguration.eventValidator[0];
    brValidator.mustValidateEvent(event, testConfig, (err, result) => {
      should.not.exist(err);
      should.exist(result);
      result.should.be.a('boolean');
      result.should.be.true;
      done();
    });
  });
});
