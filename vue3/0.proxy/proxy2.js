// 用全局变量存储被注册的副作用函数
let activeEffect
const bucket = new WeakMap()

const data = { text: 'hello world'}

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
// 用于注册副作用函数
function effect(fn) {
  activeEffect = fn
  fn()
}

function track(target, key) {
  if (!activeEffect) return target[key]
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
}

function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  effects && effects.forEach(fn => fn())
}

effect(() => {
  console.log('effect on');
  document.body.innerText = obj.text
})

setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)

setTimeout(() => {
  obj.notExist = 'hello vue3'
}, 1000)