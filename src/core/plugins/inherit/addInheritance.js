const { findOneById, findByIds, mergeConfigs } = require('../../common')


const DEFAULT = Symbol('default')
const UNINHERITABLE_SETTINGS = ['name', 'commands']


function extractInheritableConfig(config, item) {
  let { inheritableSettings, inheritableOptions, options } = item
  let result = {}

  if (inheritableSettings === true) {
    Object.assign(result, item)
    UNINHERITABLE_SETTINGS.forEach((setting) => {
      delete result[setting]
    })
  } else if (inheritableSettings) {
    inheritableSettings.forEach((key) => {
      result[key] = item[key]
    })
  }

  if (inheritableOptions === true) {
    result.options = options
  } else if (inheritableOptions) {
    result.options = result.options ? result.options.slice() : []
    inheritableOptions.forEach((optionId) => {
      if (!result.options.includes(optionId)) {
        result.options.push(optionId)
      }
    })
  }

  if (options && config.options) {
    options = findByIds(config.options, options)
    result.options = result.options ? result.options.slice() : []
    options.forEach((option) => {
      if (option.inheritable && !result.options.includes(option.id)) {
        result.options.push(option.id)
      }
    })
  }

  delete result.extends
  return result
}

// Mutates inheritableConfigs and visitedItems
function buildConfig(
  config, items, item, inheritableConfigs = {}, visitedItems = []
) {
  let { id } = item

  if (visitedItems.includes(id)) {
    throw new Error(`Item "${id}" has cyclic dependencies`)
  }

  let _extends = item.extends || DEFAULT
  let inheritedConfig = inheritableConfigs[_extends]
  visitedItems.push(id)

  if (!inheritedConfig) {
    let parent = findOneById(items, _extends)

    if (!parent) {
      throw new Error(`Item "${id}" tries to extend a non-existent item`)
    }

    parent = buildConfig(
      config, items, parent, inheritableConfigs, visitedItems
    )
    inheritedConfig = extractInheritableConfig(config, parent)
    inheritableConfigs[parent.id] = inheritedConfig
  }

  return mergeConfigs(inheritedConfig, item)
}

module.exports = function addInheritance(schema, config) {
  let { commands, options } = config

  if (commands) {
    let commandSchemaProps = schema.definitions.command.properties
    let commandConfigs = {
      [DEFAULT]: {
        inheritableSettings: commandSchemaProps.inheritableSettings.default,
        inheritableOptions: commandSchemaProps.inheritableOptions.default,
      },
    }
    commands = commands.map((command) => {
      return buildConfig(config, commands, command, commandConfigs)
    })
  }

  if (options) {
    let optionSchemaProps = schema.definitions.option.properties
    let optionConfigs = {
      [DEFAULT]: {
        inheritableSettings: optionSchemaProps.inheritableSettings.default,
      },
    }
    options = options.map((option) => {
      return buildConfig(config, options, option, optionConfigs)
    })
  }

  return Object.assign({}, config, { commands, options })
}
