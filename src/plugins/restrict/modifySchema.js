const { assign, push } = require('../../core/common')


const COMMAND_PROPERTIES = {
  restrictCommands: {
    type: 'boolean',
    default: true,
  },
  restrictOptions: {
    type: 'boolean',
    default: true,
  },
}


module.exports = function modifySchema(schema) {
  schema = assign(schema, 'definitions.command.properties', COMMAND_PROPERTIES)
  schema = push(schema, 'definitions.command.properties.inheritableSettings.default', 'restrictCommands')
  schema = push(schema, 'definitions.command.properties.inheritableSettings.default', 'restrictOptions')
  return schema
}
