# bedrock-ledger-guard-equihash

[![Build Status](https://ci.digitalbazaar.com/buildStatus/icon?job=bedrock-ledger-guard-equihash)](https://ci.digitalbazaar.com/job/bedrock-ledger-guard-equihash)

An guard for bedrock-ledger that determines if Equihash solutions
on a document satisfy the requirements defined in the the
ledger's configuration.

## The Ledger Guard Equihash API
- isValid(guardConfig, docWithProof, callback(err, result))

## Configuration
For documentation on configuration, see [config.js](./lib/config.js).

## Usage Example
```javascript
const brGuardEquihash = require('bedrock-ledger-guard-equihash');

const guardConfig = {
  type: 'EquihashGuard2017',
  equihashParameterN: 64,
  equihashParameterK: 3
};

const docWithProof = {
  "@context": "https://w3id.org/webledger/v1",
  "id": "did:v1:c02915fc-672d-4568-8e6e-b12a0b35cbb3/blocks/2",
  "type": "WebLedgerEventBlock",
  "event": ['ni:///sha-256;249bac6ec5d5f9298fe9d3b5c9d6095dde04df2a52cf485b49e3061af8b0b929'],
  "previousBlock": "did:v1:e7adbe7-79f2-425a-9dfb-76a234782f30/blocks/1",
  "previousBlockHash": "ni:///sha-256;09965dfb512bfd1179eed6c3d03ccf9361d3a310a86ae76f54eac3cca49fc6e7",
  "proof": {
    "type": "EquihashProof2017",
    "proofValue": "EXsPuARfjJ...1/PuekmCz7EQ"
  }
}

brGuardEquihash.isValid(guardConfig, docWithProof, (err, result) {
  if(err) {
    throw new Error('An error occurred when validating the block: ' + err.message);
  }
  if(!result) {
    console.log('FAIL: The block was not validated.');
    return;
  }
  console.log('SUCCESS: The block was validated.');
});
```
