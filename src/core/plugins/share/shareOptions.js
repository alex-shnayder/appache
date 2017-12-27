module.exports = function shareOptions(batch) {
  let sharedOptions = batch.reduce((sharedOptions, command) => {
    let { config, options } = command
    let commandShares = config.sharedOptions || []

    options.forEach((option) => {
      let { shared, name } = option.config

      if (shared || commandShares === true || commandShares.includes(name)) {
        sharedOptions.push(option)
      }
    })

    return sharedOptions
  }, [])

  if (!sharedOptions.length) {
    return batch
  }

  return batch.map((command) => {
    let options = command.options || []
    command = Object.assign({}, command)
    command.options = sharedOptions.concat(options)
    return command
  })
}
