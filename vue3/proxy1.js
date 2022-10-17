// 用全局变量存储被注册的副作用函数
let activeEffect
const bucket = new Set()

const data = { text: 'hello world'}

const obj = new Proxy(data, {
  get(target, key) {
    if (activeEffect) {
      bucket.add(activeEffect)
    }
    return target[key]
  },
  set(target, key, newVal) {
    target[key] = newVal
    bucket.forEach(fn => fn())
    return true
  }
})
// 用于注册副作用函数
function effect(fn) {
  activeEffect = fn
  fn()
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