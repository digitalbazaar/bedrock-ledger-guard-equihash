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

describe('validateConfiguration API', () => {
  it('validates a proper config', done => {
    const testConfig =
      mockData.ledgerConfigurations.equihash.operationValidator[0];
    brValidator.validateConfiguration(testConfig, err => {
      should.not.exist(err);
      done();
    });
  });
  it('return ValidationError on missing equihashParameterN', done => {
    const testConfig = bedrock.util.clone(
      mockData.ledgerConfigurations.equihash.operationValidator[0]);
    delete testConfig.equihashParameterN;
    brValidator.validateConfiguration(testConfig, err => {
      should.exist(err);
      err.name.should.equal('ValidationError');
      done();
    });
  });
  it('return ValidationError on missing equihashParameterK', done => {
    const testConfig = bedrock.util.clone(
      mockData.ledgerConfigurations.equihash.operationValidator[0]);
    delete testConfig.equihashParameterK;
    brValidator.validateConfiguration(testConfig, err => {
      should.exist(err);
      err.name.should.equal('ValidationError');
      done();
    });
  });
});
