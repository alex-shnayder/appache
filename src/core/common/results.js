function Result(value, command) {
  let result = Object.create(Result.prototype)
  result.value = value
  result.command = command
  return result
}

function Help(command) {
  let help = Object.create(Help.prototype)
  help.command = command
  return help
}

Help.prototype = Object.create(Result.prototype)


module.exports = { Result, Help }
