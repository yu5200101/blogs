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

function computed(getter) {
  // value 用来缓存上一次计算的值
  let value
  // dirty标志，用来标识是否需要重新计算值，为true则意味着“脏”，需要重新计算
  let dirty = true
  // 把getter作为副作用函数，创建一个lazy的effect
  const effectFn = effect(getter, {
    lazy: true,
    // 添加 若未加以下代码sumRes.value 打印两次3
    // 加了以下代码 sumRes.value 打印3 4
    scheduler() {
      dirty = true
      // 当计算属性依赖的响应式数据变化时，手动调用trigger函数触发响应
      trigger(obj, 'value')
    }
  })

  const obj = {
    // 当读取value时才执行effectFn
    get value() {
      // 只有“脏”时才计算值，并将得到的值缓存到value中
      if (dirty) {
        value = effectFn()
        // 将dirty设置为false，下一次访问直接使用缓存到value中的值
        dirty = false
      }
      // 当读取value时，手动调用track函数进行跟踪
      track(obj, 'value')
      return value
    }
  }
  return obj
}

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

const sumRes = computed(() => obj.foo + obj.bar)
console.log(sumRes.value, 1)
effect(() => {
  // 在副作用函数中读取sumRes.value
  console.log(sumRes.value, 2)
})
// 修改obj.foo
obj.foo++

console.log(sumRes.value, 3)
