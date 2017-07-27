/*!
 * Copyright (c) 2017 Digital Bazaar, Inc. All rights reserved.
 */
const bedrock = require('bedrock');

const schema = {
  title: 'Bedrock Ledger Signature Validator Config',
  required: true,
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: ['EquihashValidator2017'],
      required: true
    },
    eventFilter: {
      title: 'Event Filter',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            required: true
          },
          eventType: {
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
