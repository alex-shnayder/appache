function finalizeConfig(schema, config) {
  config = Object.assign({}, config)
  config.final = true
  return config
}


module.exports = finalizeConfig
