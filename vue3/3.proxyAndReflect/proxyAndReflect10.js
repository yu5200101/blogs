

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
  if ((type === 'ADD' && !Array.isArray(target)) || type === 'DELETE') {
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
      console.log(123);
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
      // 如果操作的目标对象是数组，并且key存在于arrayInstrumentations上
      // 那么返回定义在arrayInstrumentations上的值
      if (Array.isArray(target) && arrayInstrumentations.hasOwnProperty(key)) {
        return Reflect.get(arrayInstrumentations, key, receiver)
      }
      // 得到原始值结果
      const res = Reflect.get(target, key, receiver)
      // 如果key是symbol类型，则不进行追踪过
      if (!isReadonly && typeof key !== 'symbol') {
        track(target, key)
      }
      // 如果是浅响应，则直接返回原始值
      if (isShallow) {
        return res
      }
      if (typeof res === 'object' && res !== null) {
        // 调用reactive 将结果包装成响应式数据并返回
        return isReadonly ? readonly(res) : reactive(res)
      }
      return res
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

const obj = {}
const arr1 = reactive([obj])
console.log(arr1.includes(arr1[0]));
console.log(arr1.includes(obj));

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

