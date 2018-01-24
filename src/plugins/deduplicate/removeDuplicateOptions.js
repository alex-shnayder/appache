module.exports = function removeDuplicateOptions(batch) {
  return batch.map((command) => {
    let { options } = command

    // In case there are options with the same id,
    // prefer the one with a higher index
    options = options.filter((option, i) => {
      let { id } = option.config

      for (let j = options.length - 1; j > i; j--) {
        if (id === options[j].config.id) {
          return false
        }
      }

      return true
    })

    return Object.assign({}, command, { options })
  })
}
