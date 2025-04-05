// 子进程逻辑：计算斐波那契数列
process.on('message', (msg) => {
  const result = fibonacci(msg.number);
  process.send({ result: result });
});

function fibonacci(n) {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}