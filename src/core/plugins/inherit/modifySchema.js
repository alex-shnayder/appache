const { assign } = require('../../common')


const COMMAND_PROPERTIES = {
  extends: {
    $ref: '#/definitions/command/properties/id',
  },
  inheritableSettings: {
    oneOf: [{
      type: 'boolean',
    }, {
      type: 'array',
      items: {
        type: 'string',
      },
    }],
    default: ['inheritableSettings', 'inheritableOptions'],
  },
  inheritableOptions: {
    oneOf: [{
      type: 'boolean',
    }, {
      type: 'array',
      items: {
        $ref: '#/definitions/option/properties/name',
      },
    }],
    default: [],
  },
}
const OPTION_PROPERTIES = {
  extends: {
    $ref: '#/definitions/option/properties/id',
  },
  inheritableSettings: {
    oneOf: [{
      type: 'boolean',
    }, {
      type: 'array',
      items: {
        type: 'string',
      },
    }],
    default: ['inheritableSettings'],
  },
  inheritable: {
    type: 'boolean',
  },
}


module.exports = function modifySchema(schema) {
  schema = assign(schema, 'definitions.command.properties', COMMAND_PROPERTIES)
  return assign(schema, 'definitions.option.properties', OPTION_PROPERTIES)
}
