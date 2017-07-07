/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* globals should */

'use strict';

const bedrock = require('bedrock');
const async = require('async');
const brSignatureGuard = require('bedrock-ledger-guard-equihash');
const expect = global.chai.expect;

const mockData = require('./mock.data');

describe('isValid API', () => {
  describe('WebLedgerEvent', () => {
    it('validates a valid proof', done => {
      async.auto({
        generateProof: callback => generateEquihashSolution({
          n: 64,
          k: 3,
          doc: mockData.events.alpha
        }, callback),
        check: ['generateProof', (results, callback) =>
          brSignatureGuard.isValid(results.generateProof,
          mockData.ledgers.alpha.config.input[0].validationEventGuard[0],
          (err, result) => {
            should.not.exist(err);
            expect(result).to.be.a('boolean');
            result.should.be.true;
            callback();
          })
        ]
      }, done);
    });
  });
});

function generateEquihashSolution(options, callback) {
  callback(null, options.doc);
}
