let express = require('express');
let app = express();
app.use(express.static(__dirname));

app.get('/get-data1', (req, res) => {
  res.send('get-data1')
})
// 会阻塞get-data1请求
app.get('/get-data2', (req, res) => {
  for(let i = 0; i < 1000000; i++) {
    console.log(i)
  }
  res.send('get-data2')
})
// 不会阻塞get-data1请求
app.get('/get-data3', (req, res) => {
  let i = 0;
  const max = 1000000;
  const batchSize = 1000; // 每批处理量

  function processBatch() {
    const batchEnd = Math.min(i + batchSize, max);
    for (; i < batchEnd; i++) {
      console.log(i); // 实际项目应移除或减少日志
    }
    if (i < max) {
      setImmediate(processBatch); // 让出事件循环
    } else {
      res.send('get-data3'); // 全部完成后响应
    }
  }

  processBatch(); // 启动处理
});
app.listen(3000, () => {
  console.log('服务器启动', 'http://localhost:3000');
})