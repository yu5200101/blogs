// 子线程逻辑
const { workerData, parentPort } = require('worker_threads');

// 模拟 CPU 密集型计算
const result = fibonacci(workerData.input);

// 通过 parentPort 发送结果给主线程
parentPort.postMessage({
  threadId: workerData.taskId,
  result: result
});

// 斐波那契函数（递归实现，故意设计为低效以模拟 CPU 密集型任务）
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}