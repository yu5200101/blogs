/*
微任务：
process.nextTick(node.js)
promise.then(browser/node.js)
mutationObserver(browser)
Object.observe(已废弃，Proxy对象替代，browser)
queueMicroTask(node.js)
宏任务：
timer queue: setTimeout setInterval(node.js)
poll queue: IO事件(node.js)
check queue: setImmediate(node.js)
close queue: close事件(node.js)
script(browser)
setTimeout setInterval(browser)
UI rendering/UI事件(browser)
postMessage、MessageChannel(browser)

执行顺序：
process.nextTick
其他微任务
timer queue: setTimeout setInterval
poll queue: IO事件
check queue: setImmediate
close queue: close事件
*/
async function async1() {
  console.log('async1-start')
  await async2()
  console.log('async1-end')
}
async function async2() {
  console.log('async2')
}
console.log('script-start')

setTimeout(() => {
  console.log('setTimeout-1')
}, 0);

setImmediate(() => {
  console.log('setImmediate1')
})

setTimeout(() => {
  console.log('setTimeout-2')
}, 0);

setImmediate(() => {
  console.log('setImmediate2')
})

process.nextTick(() => {
  console.log('nextTick1')
})

async1()

process.nextTick(() => {
  console.log('nextTick2')
})

new Promise((resolve) => {
  console.log('promise1')
  resolve()
  console.log('promise2')
}).then(() => {
  console.log('promise3')
})

console.log('script-end')

/*
微任务：
nextTick1
nextTick2
async1-end
promise3
宏任务：
setTimeout-1
setTimeout-2
setImmediate1
setImmediate2

输出顺序：
script-start
async1-start
async2
promise1
promise2
script-end
微任务：
nextTick1
nextTick2
async1-end
promise3
宏任务：
setTimeout-1
setTimeout-2
setImmediate1
setImmediate2

*/