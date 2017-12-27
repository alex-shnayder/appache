const { assign } = require('../../common')


const COMMAND_PROPERTIES = {
  sharedOptions: {
    type: ['boolean', 'array'],
    items: {
      $ref: '#/definitions/option/properties/name',
    },
    default: [],
  },
}
const OPTION_PROPERTIES = {
  shared: {
    type: 'boolean',
  },
}


module.exports = function modifySchema(schema) {
  schema = assign(schema, 'definitions.command.properties', COMMAND_PROPERTIES)
  return assign(schema, 'definitions.option.properties', OPTION_PROPERTIES)
}
