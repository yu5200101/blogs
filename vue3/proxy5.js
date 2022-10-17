// 用全局变量存储被注册的副作用函数
let activeEffect
const effectStack = []
const bucket = new WeakMap()

const data = {foo: 1}

const obj = new Proxy(data, {
  get(target, key) {
    track(target, key)
    return target[key]
  },
  set(target, key, newVal) {
    target[key] = newVal
    trigger(target, key)
  }
})

function cleanup(effectFn) {
  for(let i = 0; i < effectFn.deps.length; i++) {
    // deps是依赖集合
    const deps = effectFn.deps[i]
    // 将effectFn从依赖集合中移除
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}
// 用于注册副作用函数
function effect(fn) {
  const effectFn = () => {
    // 调用cleanup函数完成清除工作
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
  }
  // 用来存储所有与该副作用函数相关联的依赖集合
  effectFn.deps = []
  effectFn()
}

function track(target, key) {
  if (!activeEffect) return
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  // 把当前激活的副作用函数添加到依赖集合deps中
  deps.add(activeEffect)
  // deps就是一个与当前副作用函数存在联系的依赖集合
  activeEffect.deps.push(deps)
}

function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)

  // 重新构造一个set集合并遍历它，防止无限循环执行
  const effectsToRun = new Set()
  effects && effects.forEach(effectFn => {
    // 如果trigger触发执行的副作用函数与当前正在执行的副作用函数相同，则不触发执行
    if (effectFn !== activeEffect) {
      effectsToRun.add(effectFn)
    }
  })
  effectsToRun.forEach(effectFn => effectFn())

  // 无限循环执行
  // effects && effects.forEach(fn => fn())
}


effect(() => {
  obj.foo = obj.foo + 1
})