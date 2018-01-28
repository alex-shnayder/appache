module.exports = function removeDuplicateOptions(batch) {
  return batch.map((command) => {
    let { options } = command

    // In case there are options with the same id,
    // prefer the one with a higher index
    options = options.filter((option, i) => {
      let { id, default: isDefault } = option.config

      if (isDefault) {
        return true
      }

      for (let j = options.length - 1; j > i; j--) {
        let { id: jId, default: jIsDefault } = options[j].config

        if (!jIsDefault && id === jId) {
          return false
        }
      }

      return true
    })

    return Object.assign({}, command, { options })
  })
}
