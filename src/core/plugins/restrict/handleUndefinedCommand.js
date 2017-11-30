const { InputError, findByIds } = require('../../common')
const findLevenshtein = require('./findLevenshtein')


const LEVENSHTEIN_THRESHOLD = 3


function suggestCommand(inputCommand, commands) {
  let bestDistance = Infinity
  let suggested

  commands.forEach((command) => {
    let { name, aliases, hidden, hiddenNames } = command
    let names = aliases ? aliases.concat(name) : [name]

    if (!hidden) {
      names.forEach((name) => {
        if (!hiddenNames.includes(name)) {
          let distance = findLevenshtein(inputCommand, name)

          if (distance <= LEVENSHTEIN_THRESHOLD && distance < bestDistance) {
            bestDistance = distance
            suggested = name
          }
        }
      })
    }
  })

  return suggested
}

module.exports = function handleUndefinedCommand(config, parent, command) {
  let { name, inputName } = command
  let siblings = findByIds(config.commands, parent.config.commands)
  let errText = `Undefined command "${inputName}"`

  if (siblings && siblings.length) {
    let suggested = suggestCommand(name, siblings)

    if (suggested) {
      errText += `. Did you mean "${suggested}"?`
    }
  }

  let err = new InputError(errText)
  err.command = parent
  throw err
}
