const { assign } = require('../../core/common')


const COMMAND_PROPERTIES = {
  abstract: {
    type: 'boolean',
    default: false,
  },
}


module.exports = function modifySchema(schema) {
  return assign(schema, 'definitions.command.properties', COMMAND_PROPERTIES)
}
