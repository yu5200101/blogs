// worker_threads 模块允许创建轻量级线程，适用于 CPU 密集型任务（如计算、数据处理），线程间可共享内存。
const { Worker, isMainThread } = require('worker_threads');
const path = require('path');
const numCPUs = require('os').cpus().length;

if (isMainThread) {
  // 主线程逻辑
  console.log(`主线程 PID: ${process.pid}`);

  // 创建与 CPU 核心数相同的子线程
  for (let i = 0; i < numCPUs; i++) {
    // 通过 workerData 传递任务参数
    const worker = new Worker(path.resolve(__filename), {
      workerData: {
        taskId: i + 1,
        input: 40  // 假设需要计算斐波那契数列的第40项
      }
    });

    // 监听子线程的消息
    worker.on('message', (msg) => {
      console.log(`收到子线程 ${msg.threadId} 的结果: ${msg.result}`);
    });

    // 监听子线程的错误
    worker.on('error', (err) => {
      console.error(`子线程错误: ${err.message}`);
    });

    // 监听子线程退出
    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`子线程异常退出，错误码: ${code}`);
      }
    });
  }

} else {
  require('./children.js');
}