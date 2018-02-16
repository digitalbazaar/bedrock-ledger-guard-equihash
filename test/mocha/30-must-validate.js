/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
/* globals should */

'use strict';

const bedrock = require('bedrock');
const brValidator = require('bedrock-ledger-validator-equihash');
const equihashSigs = require('equihash-signature');
const jsigs = require('jsonld-signatures');
jsigs.use('jsonld', bedrock.jsonld);
equihashSigs.install(jsigs);

const mockData = require('./mock.data');

describe('mustValidate API', () => {
  it('should return true on an operation', done => {
    const operation = mockData.operations.alpha;
    const testConfig =
      mockData.ledgerConfigurations.equihash.operationValidator[0];
    brValidator.mustValidate(operation, testConfig, (err, result) => {
      should.not.exist(err);
      should.exist(result);
      result.should.be.a('boolean');
      result.should.be.true;
      done();
    });
  });
});
