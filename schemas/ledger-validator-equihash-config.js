/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');

const schema = {
  title: 'Bedrock Ledger Equihash Validator Config',
  required: true,
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['EquihashValidator2018'],
      required: true
    },
    validatorFilter: {
      title: 'Type Filter',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            required: true
          },
          validatorFilterByType: {
            type: 'array',
            items: {
              type: 'string'
            },
            required: true
          }
        },
        additionalProperties: false
      },
      required: false
    },
    equihashParameterK: {
      type: 'integer',
      required: true
    },
    equihashParameterN: {
      type: 'integer',
      required: true
    }
  },
  additionalProperties: false
};

module.exports = extend => {
  if(extend) {
    return bedrock.util.extend(true, bedrock.util.clone(schema), extend);
  }
  return schema;
};
