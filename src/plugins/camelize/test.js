const assert = require('assert')
const camelizeBatchOptions = require('./camelizeBatchOptions')
const { handler } = require('./index?private')
const camelizePlugin = require('./index')


describe('camelize plugin', () => {
  it('hooks the handler', () => {
    let generator = camelizePlugin()
    let { value } = generator.next()

    assert.deepStrictEqual(value, {
      effect: 'hook',
      event: {
        event: 'execute',
        goesAfter: ['modifyOption'],
        tags: ['modifyOption'],
      },
      fn: handler,
      routineMode: 'pre',
    })
  })

  describe('handler', () => {
    let config = {}
    let batch = [{}, {}]
    let resultBatch = [{}, {}]
    let generator = handler(config, batch)

    it('calls camelizeBatchOptions for each command in the batch', () => {
      let { value } = generator.next()

      assert.deepStrictEqual(value, {
        effect: 'call',
        fn: camelizeBatchOptions,
        args: [batch[0]],
      })

      value = generator.next(resultBatch[0]).value

      assert.deepStrictEqual(value, {
        effect: 'call',
        fn: camelizeBatchOptions,
        args: [batch[1]],
      })
    })

    it('returns modified args', () => {
      let result = [config, resultBatch]
      let { value, done } = generator.next(resultBatch[1])

      assert.deepStrictEqual(value, result)
      assert(done)
    })
  })

  describe('camelizeBatchOptions', () => {
    it('returns the given command if it has no options', () => {
      let command = {}
      let result = camelizeBatchOptions(command)
      assert(command === result)
    })

    it('converts the command\'s options to camelCase', () => {
      let command = {
        options: [{
          name: 'foo-bar',
        }],
      }
      let result = camelizeBatchOptions(command)

      assert.deepStrictEqual(result, {
        options: [{
          name: 'fooBar',
        }],
      })
    })
  })
})
