process.on('message', (msg) => {
  // 执行计算任务
  const result = fibonacci(msg.input);
  // 返回结果
  process.send({
    taskId: msg.taskId,
    result: result
  });
});

// 模拟 CPU 密集型任务
function fibonacci(n) {
  return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}