const { assign } = require('../../core/common')


const COMMAND_PROPERTIES = {
  requiredOptions: {
    oneOf: [{
      type: 'boolean',
    }, {
      type: 'array',
      items: {
        $ref: '#/definitions/option/properties/name',
      },
    }],
    default: false,
  },
}
const OPTION_PROPERTIES = {
  required: {
    type: 'boolean',
  },
}


module.exports = function modifySchema(schema) {
  schema = assign(schema, 'definitions.command.properties', COMMAND_PROPERTIES)
  return assign(schema, 'definitions.option.properties', OPTION_PROPERTIES)
}
