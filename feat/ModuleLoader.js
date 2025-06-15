const moduleLoader = function() {
  const cache = {}
  const modules = {}
  function define(name, dep, fn) {
    modules[name] = {dep, fn}
  }
  function require(name) {
    // 命中缓存
    if (cache[name]) {
      return cache[name]
    }
    const module = modules[name]
    if (!module) {
      throw new Error('error')
    }
    const depResolve = module.dep.map(item => require(item))
    const result = module.fn.apply(null, depResolve)
    cache[name] = result
    return result
  }

  return {
    define,
    require
  }
}()

const {define, require} = moduleLoader

define('math', [], function() {
  return {
    add(a, b) {
      return a + b
    }
  }
})

define('logger', [], function() {
  return function(value) {
    console.log(`log: ${value}`)
  }
})

define('main', ['math', 'logger'], function(math, logger) {
  const result = math.add(1, 2)
  logger(result)
  return result
})

const result = require('main')
console.log(result)