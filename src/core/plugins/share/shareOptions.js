module.exports = function shareOptions(batch) {
  let sharedOptions

  return batch.map((command) => {
    let { config, options } = command
    let sharedOptionsConfig = config && config.sharedOptions

    if (sharedOptions && options) {
      options = options.concat(sharedOptions)
      command = Object.assign({}, command, { options })
    }

    if (sharedOptionsConfig && options) {
      if (sharedOptionsConfig === true) {
        sharedOptions = options
      } else {
        let shareUndefined = sharedOptionsConfig.includes('*')
        sharedOptions = options.filter((option) => {
          if (option.config) {
            return sharedOptionsConfig.includes(option.config.name)
          } else {
            return shareUndefined
          }
        })
      }
    } else {
      sharedOptions = null
    }

    return command
  })
}
