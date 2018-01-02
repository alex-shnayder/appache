const { assign } = require('../../core/common')


const OPTION_PROPERTIES = {
  type: {
    default: 'auto',
  },
}


module.exports = function modifySchema(schema) {
  return assign(schema, 'definitions.option.properties', OPTION_PROPERTIES)
}
