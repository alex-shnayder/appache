const { preHook } = require('hooter/effects')
const modifySchema = require('./modifySchema')


module.exports = function* defaultValues() {
  yield preHook({
    event: 'schema',
    tags: ['modifySchema'],
  }, (schema) => [modifySchema(schema)])

  yield preHook({
    event: 'process',
    tags: ['modifyOption'],
    goesBefore: ['modifyOption'],
  }, (_, command, ...args) => {
    let config = command.config

    if (!config || !config.options || !config.options.length) {
      return [_, command, ...args]
    }

    let options = command.options.slice()

    config.options.forEach((optionConfig) => {
      if (typeof optionConfig.defaultValue === 'undefined') {
        return
      }

      let optionIndex = options.findIndex((o) => {
        return o.config && o.config.id === optionConfig.id
      })
      let option = options[optionIndex]

      if (option && typeof option.value === 'undefined') {
        options[optionIndex] = Object.assign({}, option, {
          value: optionConfig.defaultValue,
        })
      } else if (!option) {
        options.push({
          name: optionConfig.name,
          inputName: optionConfig.name,
          value: optionConfig.defaultValue,
          config: optionConfig,
        })
      }
    })

    command = Object.assign({}, command, { options })
    return [_, command, ...args]
  })
}
