// 利用scheduler 调度器来控制副作用函数的执行时机和方式、

// 用全局变量存储被注册的副作用函数
let activeEffect
// 定义一个任务队列
const jobQueue = new Set()
// 使用Promise.resolve()创建一个promise实例，我们用它将一个任务添加到微任务队列
const p = Promise.resolve()

// 一个标志代表是否正在刷新队列
let isFlushing = false
function flushJob() {
  console.log(isFlushing, 'isFlushing')
  // 如果队列正在刷新，则什么都不做
  if (isFlushing) return
  // 设置为true 代表正在刷新
  isFlushing = true
  // 在微任务队列中刷新jobQueue队列
  p.then(() => {
    jobQueue.forEach(job => {
      job()
    })
  }).finally(() => {
    // 结束后重置isFlushing
    isFlushing = false
  })
}
const effectStack = []
const bucket = new WeakMap()

const data = {foo: 1, bar: 2}

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
function effect(fn, options = {}) {
  const effectFn = () => {
    // 调用cleanup函数完成清除工作
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    // 将fn的执行结果存储到res中
    const res = fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
    return res
  }
  // 讲options挂载到effectFn上
  effectFn.options = options
  // 用来存储所有与该副作用函数相关联的依赖集合
  effectFn.deps = []
  // 只有非lazy的时候，才执行
  if (!options.lazy) {
    // 执行副作用函数
    effectFn()
  }
  // 将副作用函数作为返回值返回
  return effectFn
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
  effectsToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      console.log(123);
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })

  // 无限循环执行
  // effects && effects.forEach(fn => fn())
}

// watch接收两个参数， source是响应式数据，cb是回调函数
function watch(source, cb) {
  effect(
    // 触发读取操作，从而建立联系
    () => source.foo,
    {
      scheduler() {
        // 当数据变化时，调用回调函数cb
        cb()
      }
    }
    )
}

watch(obj, () => {
  console.log('数据变了')
})

// 修改响应数据的值，会导致回调函数执行
obj.foo++