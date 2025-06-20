let express = require('express');
const path = require('path');
let app = express();
app.use(express.static(__dirname));

const { Worker } = require('worker_threads');

app.get('/get-data1', (req, res) => {
  res.send('get-data1')
})

app.get('/get-data2', (req, res) => {
  const worker = new Worker(path.resolve('./child.js'), { workerData: {} });

  worker.on('message', () => {
    res.send('get-data2');
  });
});
app.listen(3001, () => {
  console.log('服务器启动', 'http://localhost:3001');
})