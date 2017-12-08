const { assign } = require('../../common')


const COMMAND_PROPERTIES = {
  inheritableSettings: {
    type: 'array',
    items: {
      type: 'string',
    },
    default: ['inheritableSettings', 'inheritableOptions'],
  },
  inheritableOptions: {
    type: 'array',
    items: {
      $ref: '#/definitions/option/properties/name',
    },
    default: [],
  },
}


module.exports = function modifySchema(schema) {
  return assign(schema, 'definitions.command.properties', COMMAND_PROPERTIES)
}
