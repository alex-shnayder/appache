const { assign, push } = require('../../common')


const COMMAND_PROPERTIES = {
  strict: {
    type: 'boolean',
    default: true,
  },
}


module.exports = function modifySchema(schema) {
  schema = assign(schema, 'definitions.command.properties', COMMAND_PROPERTIES)
  schema = push(schema, 'definitions.command.properties.inheritableSettings.default', 'strict')
  return schema
}
