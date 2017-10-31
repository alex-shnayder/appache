const assert = require('assert')
const { processHandler, camelizeOptions } = require('./index?private')
const camelizePlugin = require('./index')


describe('camelize plugin', () => {
  it('hooks the process handler', () => {
    let generator = camelizePlugin()
    let { value } = generator.next()

    assert.deepStrictEqual(value, {
      effect: 'hook',
      event: {
        event: 'process',
        goesAfter: ['modifyOption'],
        tags: ['modifyOption'],
      },
      fn: processHandler,
      routineMode: 'pre',
    })
  })

  describe('process handler', () => {
    let config = {}
    let command = {}
    let generator = processHandler(config, command)

    it('calls camelizeOptions', () => {
      let { value } = generator.next()

      assert.deepStrictEqual(value, {
        effect: 'call',
        fn: camelizeOptions,
        args: [command],
      })
    })

    it('returns the modified args', () => {
      let newCommand = {}
      let result = [config, newCommand]
      let { value, done } = generator.next(newCommand)

      assert.deepStrictEqual(value, result)
      assert(done)
    })
  })

  describe('camelizeOptions', () => {
    it('returns the given command if it has no options', () => {
      let command = {}
      let result = camelizeOptions(command)
      assert(command === result)
    })

    it('converts the command\'s options to camelCase', () => {
      let command = {
        options: [{
          name: 'foo-bar',
        }],
      }
      let result = camelizeOptions(command)

      assert.deepStrictEqual(result, {
        options: [{
          name: 'fooBar',
        }],
      })
    })
  })
})
