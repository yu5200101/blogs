// cluster 模块允许创建多个子进程（Worker）共享同一个端口，每个进程运行在独立的 CPU 核心上，适用于 I/O 密集型场景（如 Web 服务器）。
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isPrimary) {
  console.log(`cpu length: ${numCPUs}`);
  // 主进程：创建与 CPU 核心数相同的子进程
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    // 向子进程发送任务
    worker.send({ number: 40 }); // 计算斐波那契(40)
  }
  // 监听子进程退出事件并重启
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died, restarting...`);
    cluster.fork();
  });
  // 监听子进程的回复
  cluster.on('message', (worker, msg) => {
    console.log(`子进程 ${worker.process.pid} 计算结果: ${msg.result}`);
  });
} else {
  require('./children.js');
}