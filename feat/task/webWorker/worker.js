// worker.js
self.onmessage = function(e) {  // 监听主线程消息
  const chunkSize = 5000;       // 每批处理 5000 条数据
  const results = [];
  let processed = 0;

  function processChunk() {
    const start = processed;
    const end = Math.min(processed + chunkSize, e.data.data.length);

    // 执行计算密集型任务（无 DOM 操作）
    for(let i = start; i < end; i++) {
      results.push(e.data.data[i] * 2); // 示例：简单乘法计算
    }

    processed = end;

    if(processed < e.data.data.length) {
      // 使用 setTimeout 释放主线程控制权
      setTimeout(processChunk, 0);
    } else {
      // 将结果返回主线程
      self.postMessage({ result: results });
    }
  }

  processChunk(); // 启动处理
};