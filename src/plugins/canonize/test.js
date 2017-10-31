const assert = require('assert')
const { processHandler, canonize } = require('./index?private')
const canonizePlugin = require('./index')


describe('canonize plugin', () => {
  it('hooks the process handler', () => {
    let generator = canonizePlugin()
    let { value } = generator.next()

    assert.deepStrictEqual(value, {
      effect: 'hook',
      event: {
        event: 'process',
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

    it('calls canonize', () => {
      let { value } = generator.next()

      assert.deepStrictEqual(value, {
        effect: 'call',
        fn: canonize,
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

  describe('canonize', () => {
    it('sets the names of the command\'s options to the names defined in their configs', () => {
      let command = {
        fullName: [],
        options: [{
          name: 'foo',
          config: {
            name: 'oof',
          },
        }, {
          name: 'bar',
        }],
      }
      let result = canonize(command)

      assert.deepStrictEqual(result, {
        fullName: [],
        options: [{
          name: 'oof',
          config: {
            name: 'oof',
          },
        }, {
          name: 'bar',
        }],
      })
    })
  })
})
