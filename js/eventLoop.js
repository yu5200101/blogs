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

function Counter() {
  const start = Date.now()
  // new Counter()的时候this 指向counter
  // Counter()的时候 this指向window
  console.log(this, 'counter');
  this.num = 0

  this.timer1 = setInterval(function() {
    console.log(this, 'this');
    this.num++
    const gap = Date.now() - start
    console.log('timer1', this.num , gap)
  }, 1000);

  this.timer2 = setTimeout(function() {
    this.num++
    const gap = Date.now() - start
    console.log('timer2', this.num , gap)
  }, 0);
}

// this指向window
// const counter = new Counter()
// this指向window
// Counter()
