// 通过 fork()、spawn() 或 exec() 创建独立子进程运行外部脚本，适用于任务隔离。
const { fork } = require('child_process');
const path = require('path');
const numCPUs = require('os').cpus().length;

console.log(`cpu length: ${numCPUs}`);

// 创建子进程
for (let i = 0; i < numCPUs; i++) {
  const child = fork(path.join(__dirname, 'children.js'), {
    // 配置选项（可选）
    stdio: ['pipe', 'pipe', 'pipe', 'ipc'] // 启用 IPC 通信
  });

  // 发送任务数据
  child.send({ taskId: i, input: 40 });

  // 接收子进程消息
  child.on('message', (msg) => {
    console.log(`收到子进程 ${child.pid} 结果: ${msg.result}`);
  });

  // 错误处理
  child.on('error', (err) => {
    console.error(`子进程 ${child.pid} 错误: ${err.message}`);
  });

  // 退出处理
  child.on('exit', (code) => {
    console.log(`子进程 ${child.pid} 退出，状态码: ${code}`);
  });
}