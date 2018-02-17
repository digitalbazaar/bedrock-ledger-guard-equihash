/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const async = require('async');
const bedrock = require('bedrock');
const brValidator = require('bedrock-ledger-validator-equihash');
const equihashSigs = require('equihash-signature');
const jsigs = require('jsonld-signatures');
jsigs.use('jsonld', bedrock.jsonld);
equihashSigs.install(jsigs);

const mockData = require('./mock.data');

describe('validate API', () => {
  describe('operationValidator', () => {
    it('validates a valid proof', done => {
      const testConfig =
        mockData.ledgerConfigurations.equihash.operationValidator[0];
      async.auto({
        sign: callback => jsigs.sign(
          mockData.operations.alpha, {
            algorithm: 'EquihashProof2018',
            parameters: {
              n: testConfig.equihashParameterN,
              k: testConfig.equihashParameterK
            }
          }, callback),
        check: ['sign', (results, callback) => brValidator.validate(
          results.sign,
          testConfig,
          err => {
            assertNoError(err);
            callback();
          })
        ]
      }, done);
    });
    it('returns ValidationError on an invalid proof', done => {
      const testConfig =
        mockData.ledgerConfigurations.equihash.operationValidator[0];
      async.auto({
        sign: callback => jsigs.sign(
          mockData.operations.alpha, {
            algorithm: 'EquihashProof2018',
            parameters: {
              n: testConfig.equihashParameterN,
              k: testConfig.equihashParameterK
            }
          }, callback),
        check: ['sign', (results, callback) => {
          results.sign.proof.proofValue =
            results.sign.proof.proofValue.replace('A', 'B');
          brValidator.validate(results.sign, testConfig, err => {
            should.exist(err);
            err.name.should.equal('ValidationError');
            err.details.input.should.be.an('object');
            callback();
          });
        }]
      }, done);
    });
    it('returns ValidationError on incorrect equihash parameters', done => {
      const testConfig =
        mockData.ledgerConfigurations.equihash.operationValidator[0];
      async.auto({
        sign: callback => jsigs.sign(
          mockData.operations.alpha, {
            algorithm: 'EquihashProof2018',
            parameters: {
              // deviate from the required parameters
              n: testConfig.equihashParameterN - 1,
              k: testConfig.equihashParameterK
            }
          }, callback),
        check: ['sign', (results, callback) => {
          brValidator.validate(results.sign, testConfig, err => {
            should.exist(err);
            err.name.should.equal('ValidationError');
            err.details.input.should.be.an('object');
            callback();
          });
        }]
      }, done);
    });
  });
});
