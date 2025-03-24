// WeakMap只能接受对象作为键名，null除外
// 没有size，无法遍历
const wm = new WeakMap()
const yellowKey = { 'yellowKey': 'yellow' }
const blueKey = { 'blueKey': 'blue' }
console.log(wm.set(yellowKey, 'yellowValue').set(blueKey, 'blueValue'))
console.log(wm.has(yellowKey))
console.log(wm.delete(yellowKey))
console.log(wm.has(yellowKey))
console.log(wm)
const objKey = {key: 1}
let obj = {obj: 1}
wm.set(objKey, obj)
// 健值obj会在WeakMap中产生一个新的引用，修改obj不会影响到内部
obj = null
console.log(wm)
