/*
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
/* globals should */

'use strict';

const bedrock = require('bedrock');
const async = require('async');
const brSignatureGuard = require('bedrock-ledger-guard-equihash');
const crypto = require('crypto');
const equihash = require('equihash')('khovratovich');
const expect = global.chai.expect;

const mockData = require('./mock.data');

describe('isValid API', () => {
  describe('WebLedgerEvent', () => {
    it('validates a valid proof', done => {
      async.auto({
        sign: callback => equihashSignature({
          n: 90,
          k: 5,
          doc: mockData.events.alpha
        }, callback),
        check: ['sign', (results, callback) =>
          brSignatureGuard.isValid(
            results.sign,
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
    it('fails to validate an invalid proof', done => {
      async.auto({
        sign: callback => equihashSignature({
          n: 90,
          k: 5,
          doc: mockData.events.alpha
        }, callback),
        check: ['sign', (results, callback) => {
          results.sign.signature.signatureValue =
            results.sign.signature.signatureValue.replace('A', 'B');
          brSignatureGuard.isValid(
            results.sign,
            mockData.ledgers.alpha.config.input[0].validationEventGuard[0],
            (err, result) => {
              should.not.exist(err);
              expect(result).to.be.a('boolean');
              result.should.be.false;
              callback();
            });
        }]
      }, done);
    });
  });
});

function equihashSignature(options, callback) {
  async.auto({
    normalize: callback => bedrock.jsonld.normalize(options.doc, {
      algorithm: 'URDNA2015',
      format: 'application/nquads'
    }, callback),
    proof: ['normalize', (results, callback) => {
      const hash =
        crypto.createHash('sha256').update(results.normalize, 'utf8').digest();
      const equihashOptions = {
        n: options.n,
        k: options.k
      };
      equihash.solve(hash, equihashOptions, callback);
    }],
    sign: ['proof', (results, callback) => {
      const signed = bedrock.util.clone(options.doc);
      signed.signature = {
        type: 'EquihashSignature2017',
        equihashParameterN: results.proof.n,
        equihashParameterK: results.proof.k,
        nonce: results.proof.nonce,
        signatureValue: Buffer.from(results.proof.value).toString('base64')
      };
      callback(null, signed);
    }]
  }, (err, results) => {
    if(err) {
      return callback(err);
    }
    callback(null, results.sign);
  });
}
