const { assign } = require('../../common')


const OPTION_PROPERTIES = {
  required: {
    type: 'boolean',
    default: false,
  },
}


module.exports = function modifySchema(schema) {
  schema = assign(schema, 'definitions.option.properties', OPTION_PROPERTIES)
  return schema
}
