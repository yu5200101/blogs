const { parentPort } = require('worker_threads');
for(let i = 0; i < 1000000; i++) {
  console.log(i)
  // 这里执行实际任务
}
parentPort.postMessage('done');