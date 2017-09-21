/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* globals should */

'use strict';

const async = require('async');
const brValidator = require('bedrock-ledger-validator-equihash');
const equihashSigs = require('equihash-signature');

const mockData = require('./mock.data');

describe('validateEvent API', () => {
  describe('WebLedgerEvent', () => {
    it('validates a valid proof', done => {
      const testConfig =
        mockData.ledgers.alpha.config.input[0].eventValidator[0];
      async.auto({
        sign: callback => equihashSigs.sign({
          n: testConfig.equihashParameterN,
          k: testConfig.equihashParameterK,
          doc: mockData.events.alpha
        }, callback),
        check: ['sign', (results, callback) => brValidator.validateEvent(
          results.sign,
          testConfig,
          err => {
            should.not.exist(err);
            callback();
          })
        ]
      }, done);
    });
    it('returns ValidationError on an invalid proof', done => {
      const testConfig =
        mockData.ledgers.alpha.config.input[0].eventValidator[0];
      async.auto({
        sign: callback => equihashSigs.sign({
          n: testConfig.equihashParameterN,
          k: testConfig.equihashParameterK,
          doc: mockData.events.alpha
        }, callback),
        check: ['sign', (results, callback) => {
          results.sign.signature.proofValue =
            results.sign.signature.proofValue.replace('A', 'B');
          brValidator.validateEvent(results.sign, testConfig, err => {
            should.exist(err);
            err.name.should.equal('ValidationError');
            err.details.event.should.be.an('object');
            callback();
          });
        }]
      }, done);
    });
    it('returns ValidationError on incorrect equihash parameters', done => {
      const testConfig =
        mockData.ledgers.alpha.config.input[0].eventValidator[0];
      async.auto({
        sign: callback => equihashSigs.sign({
          // deviate from the required parameters
          n: testConfig.equihashParameterN - 1,
          k: testConfig.equihashParameterK,
          doc: mockData.events.alpha
        }, callback),
        check: ['sign', (results, callback) => {
          brValidator.validateEvent(results.sign, testConfig, err => {
            should.exist(err);
            err.name.should.equal('ValidationError');
            err.details.event.should.be.an('object');
            callback();
          });
        }]
      }, done);
    });
  });
});
