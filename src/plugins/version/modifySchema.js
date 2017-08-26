const { assign, push } = require('../../common')


const COMMAND_PROPERTIES = {
  version: {
    type: ['boolean', 'string'],
    default: true,
  },
}


module.exports = function modifySchema(schema) {
  schema = push(schema, 'definitions.command.properties.inheritableSettings.default', 'version')
  return assign(schema, 'definitions.command.properties', COMMAND_PROPERTIES)
}
