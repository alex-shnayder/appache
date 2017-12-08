const { assign } = require('../../common')


const COMMAND_PROPERTIES = {
  sharedOptions: {
    type: ['boolean', 'array'],
    items: {
      oneOf: [{
        $ref: '#/definitions/command/properties/name',
      }, {
        type: 'string',
        enum: ['*'],
      }],
    },
    default: [],
  },
}


module.exports = function modifySchema(schema) {
  return assign(schema, 'definitions.command.properties', COMMAND_PROPERTIES)
}
