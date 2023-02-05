const ITERATE_KEY = Symbol()

// 利用scheduler 调度器来控制副作用函数的执行时机和方式、

// 用全局变量存储被注册的副作用函数
let activeEffect

const effectStack = []
const bucket = new WeakMap()

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
  // 禁止追踪时直接返回
  if (!activeEffect || !shouldTrack) return
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
};

// 未triggger函数增加第四个参数，newVal，即新值
function trigger(target, key, type, newVal) {
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
  if (type === 'ADD' || type === 'DELETE' || (
    type === 'SET' && Object.prototype.toString.call(target) === '[object Map]'
  )) {
    // 如果操作类型是SET,并且目标对象是Map类型的数据
    // 也应该触发那些与ITERATE_KEY相关联的副作用函数重新执行
    const iterateEffects = depsMap.get(ITERATE_KEY)
    iterateEffects && iterateEffects.forEach(effectFn => {
      if (effectFn !== activeEffect) {
        effectsToRun.add(effectFn)
      }
    })
  }
  // 如果操作目标是数组，并且修改了数组的length属性
  if (Array.isArray(target) && key === 'length') {
    // 对于索引大于或等于新的length值的元素
    // 需要把所有相关联的副作用函数取出并添加到effectsToRun中待执行
    depsMap.forEach((effects, key) => {
      if (key >= newVal) {
        effects.forEach(effectFn => {
          if (effectFn !== activeEffect) {
            effectsToRun.add(effectFn)
          }
        })
      }
    })
  }
  effectsToRun.forEach(effectFn => {
    if (effectFn.options.scheduler) {
      effectFn.options.scheduler(effectFn)
    } else {
      effectFn()
    }
  })

  // 无限循环执行
  // effects && effects.forEach(fn => fn())
}

const arrayInstrumentations = {}
;['includes', 'indexOf', 'lastIndexOf'].forEach(method => {
  const originMethod = Array.prototype[method]
  arrayInstrumentations[method] = function(...args) {
    // this是代理对象，先在代理对象中查找，将结果存储到res中
    let res = originMethod.apply(this, args)

    if (res === false) {
      // res为false说明没找到，通过this.raw拿到原始数组，再去其中查找并更新res值
      res = originMethod.apply(this.raw, args)
    }
    return res
  }
})

// 定义一个对象，将自定义的add方法定义到该对象下
const mutableInstrumentations = {
  add(key) {
    // this仍然指向的是代理对象，通过raw属性获取原始数据对象
    const target = this.raw
    // 先判断值是否已经存在
    const hadKey = target.has(key)
    // 只有在值不存在的情况下，才需要触发响应
    // 通过原始数据对象执行add方法添加具体的值
    // 这里不再需要.bind 因为是直接通过target调用并执行的
    const res = target.add(key)
    if (!hadKey) {
      trigger(target, key, 'ADD')
    }
    // 返回操作结果
    return res
  },
  delete(key) {
    // this仍然指向的是代理对象，通过raw属性获取原始数据对象
    const target = this.raw
    // 先判断值是否已经存在
    const hadKey = target.has(key)
    // 只有在值不存在的情况下，才需要触发响应
    // 通过原始数据对象执行delete方法添加具体的值
    // 这里不再需要.bind 因为是直接通过target调用并执行的
    const res = target.delete(key)
    if (!hadKey) {
      trigger(target, key, 'DELETE')
    }
    // 返回操作结果
    return res
  },
  get(key) {
    // this仍然指向的是代理对象，通过raw属性获取原始数据对象
    const target = this.raw
    // 先判断值是否已经存在
    const hadKey = target.has(key)
    track(target, key)
    if (hadKey) {
      const res = target.get(key)
      return typeof res === 'object' ? reactive(res) : res
    }
  },
  set(key, value) {
    const target = this.raw
    const had = target.has(key)
    const oldValue = target.get(key)
    // 获取原始数据，由于value本身可能已经是原始数据，所以此时value.raw不存在，则直接使用value
    const rawValue = value.raw || value
    target.set(key, rawValue)

    // target.set(key, value)
    if (!had) {
      trigger(target, key, 'ADD')
    } else if (oldValue !== value || (oldValue === oldValue && value === value)) {
      trigger(target, key, 'SET')
    }
  },
  forEach(callback, thisArg) {
    // wrap函数用来把可代理的值转换为响应式数据
    const wrap = (val) => typeof val === 'object' ? reactive(val) : val
    // 取得原始数据对象
    const target = this.raw
    // 与ITERATE_KEY建立响应联系
    track(target, ITERATE_KEY)
    // 通过原始数据对象调用forEach方法，并把callback传递过去
    target.forEach((v, k) => {
      // 手动调用callback,用wrap函数包裹value和key后再传给callback,这样就实现了深响应
      // callback(wrap(v), wrap(k), this)
      callback.call(thisArg, wrap(v), wrap(k), this)
    })
  }
}
// 一个标记变量，代表是否进行追踪。默认值为true，即允许追踪
let shouldTrack = true
// 重写数组的push方法
;['push', 'pop', 'unshift', 'shift', 'splice'].forEach(method => {
  // 取得原始push方法
  const originMethod = Array.prototype[method]
  // 重写
  arrayInstrumentations[method] = function(...args) {
    // 在调用原始方法之前，禁止追踪
    shouldTrack = false
    let res = originMethod.apply(this, args)
    // 在调用原始方法之后，恢复原来的行为，即允许追踪
    shouldTrack = true
    return res
  }
})
// 封装createReactive 函数，接收一个参数isShallow，代表是否为浅响应，默认为false，即非浅响应
// 增加三个参数 isReadonly，代表是否只读，默认为false，即非只读
function createReactive(obj, isShallow = false, isReadonly = false) {
  return new Proxy(obj, {
    ownKeys(target) {
      // 将副作用函数与ITERATE_KEY关联
      // 如果操作目标target是数组，则使用length属性作为key并建立响应联系
      track(target, Array.isArray(target) ? 'length' : ITERATE_KEY)
      return Reflect.ownKeys(target)
    },
    deleteProperty(target, key) {
      if (isReadonly) {
        console.warn(`属性${key}是只读的`)
        return true
      }
      // 检查被操作的属性是否是对象自己的属性
      const hadKey = Object.prototype.hasOwnProperty.call(target, key)
      // 使用Reflect.deleteProperty完成属性的删除
      const res = Reflect.deleteProperty(target, key)
      if (res && hadKey) {
        // 只有当被删除的属性是对象自己的属性并且成功删除时，才触发更新
        trigger(target, key, 'DELETE')
      }
      return res
    },
    has(target, key) {
      track(target, key)
      return Reflect.has(target, key)
    },
    get(target, key, receiver) {
      // 代理对象可以通过raw 属性访问原始数据
      if (key === 'raw') {
        return target
      }
      if (key === 'size') {
        track(target, ITERATE_KEY)
        return Reflect.get(target, key, target)
      }
      return mutableInstrumentations[key]
    },
    set(target, key, newVal, receiver) {
      if (isReadonly) {
        console.warn(`属性${key}是只读的`)
        return true
      }
      // 先获取旧值
      const oldVal = target[key]
      // 如果属性不存在，则说明是在添加新属性，否则是设置已有属性
      let type = ''
      if (Array.isArray(target)) {
        // 如果代理目标是数组，则检测被设置的索引值是否小于数组长度
        // 如果是，则视作SET操作，否则是ADD操作
        type = Number(key) < target.length ? 'SET' : 'ADD'
      } else {
        type = Object.prototype.hasOwnProperty.call(target, key) ? 'SET' : 'ADD'
      }
      // 设置属性值
      const res = Reflect.set(target, key, newVal, receiver)
      // target === receiver.raw 说明 receiver 就是target的代理对象
      if(target === receiver.raw) {
        // 比较新值与旧值，只要当不全等的时候才触发响应
        if (oldVal !== newVal && (oldVal === oldVal || newVal === newVal)) {
          // 将type作为第三个参数传递给trigger函数
          trigger(target, key, type)
        }
      }
      return res
    }
  })
}

function shallowReactive(obj) {
  return createReactive(obj, true)
}

function readonly(obj) {
  return createReactive(obj, false, true)
}

function shallowReadonly(obj) {
  return createReactive(obj, true, true)
}

const reactiveMap = new Map()

function reactive(obj) {
  // 优先通过原始对象obj寻找之前创建的代理对象，如果找到了，直接返回已有的代理对象
  const existionProxy = reactiveMap.get(obj)
  if (existionProxy) return existionProxy
  // 否则创建新的代理对象
  const proxy = createReactive(obj)
  // 存储到Map中，从而避免重复创建
  reactiveMap.set(obj, proxy)
  return proxy
}

const p = reactive(new Map([
  ['key', 1]
]))

effect(() => {
  p.forEach((value, key) => {
    // forEach循环不仅关心集中的键，还关心集合的值
    console.log(value)
  })
})

p.set('key', 2)