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
        mockData.configs.equihash.ledgerConfiguration.eventValidator[0];
      async.auto({
        sign: callback => equihashSigs.sign({
          n: testConfig.equihashParameterN,
          k: testConfig.equihashParameterK,
          doc: mockData.events.alpha.operation[0]
        }, callback),
        build: ['sign', (results, callback) =>
          callback(null, {
            '@context': 'https://w3id.org/webledger/v1',
            type: 'WebLedgerEvent',
            operation: [results.sign]
        })],
        check: ['build', (results, callback) => brValidator.validateEvent(
          results.build,
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
        mockData.configs.equihash.ledgerConfiguration.eventValidator[0];
      async.auto({
        sign: callback => equihashSigs.sign({
          n: testConfig.equihashParameterN,
          k: testConfig.equihashParameterK,
          doc: mockData.events.alpha
        }, callback),
        build: ['sign', (results, callback) => 
          callback(null, {
            '@context': 'https://w3id.org/webledger/v1',
            type: 'WebLedgerEvent',
            operation: [results.sign]
        })],
        check: ['build', (results, callback) => {
          results.sign.signature.proofValue =
            results.sign.signature.proofValue.replace('A', 'B');
          brValidator.validateEvent(results.build, testConfig, err => {
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
        mockData.configs.equihash.ledgerConfiguration.eventValidator[0];
      async.auto({
        sign: callback => equihashSigs.sign({
          // deviate from the required parameters
          n: testConfig.equihashParameterN - 1,
          k: testConfig.equihashParameterK,
          doc: mockData.events.alpha
        }, callback),
        build: ['sign', (results, callback) => 
          callback(null, {
            '@context': 'https://w3id.org/webledger/v1',
            type: 'WebLedgerEvent',
            operation: [results.sign]
        })],
        check: ['build', (results, callback) => {
          brValidator.validateEvent(results.build, testConfig, err => {
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
