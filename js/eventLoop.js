/*
微任务：
promise.then(browser)
mutationObserver(browser)
Object.observe(已废弃，Proxy对象替代，browser)
宏任务：
script(browser)
setTimeout setInterval(browser)
UI rendering/UI事件(browser)
postMessage、MessageChannel(browser)
requestAnimationFrame
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

requestAnimationFrame(() => {
  console.log('requestAnimationFrame')
})

setTimeout(() => {
  console.log('setTimeout-2')
}, 0);

async1()

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
async1-end
promise3
宏任务：
setTimeout-1
setTimeout-2
requestAnimationFrame

输出顺序：
script-start
async1-start
async2
promise1
promise2
script-end
微任务：
async1-end
promise3
宏任务：
setTimeout-1
setTimeout-2
requestAnimationFrame

*/