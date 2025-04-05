const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(express.static(__dirname))
const ERROR_FILE = path.join(__dirname, 'info.json');

// 中间件配置
app.use(cors()); // 处理跨域请求
app.use(bodyParser.json());

// 确保错误文件存在
async function initializeErrorFile() {
  try {
    await fs.access(ERROR_FILE);
  } catch (error) {
    await fs.writeFile(ERROR_FILE, JSON.stringify([]), 'utf8');
  }
}

app.post('/getData', (req, res) =>{
  res.json({
    data: `req:${JSON.stringify(req.body)}-pushData`
  })
})

// 错误上报接口
app.post('/api/send-error', async (req, res) => {
  try {
    const errorData = req.body;
    // 基本数据校验
    if (!errorData || typeof errorData !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid error data format'
      });
    }

    // 添加时间戳
    const errorWithTimestamp = {
      ...errorData,
      receivedAt: new Date().toISOString()
    };

    // 读取现有错误数据
    const existingData = await fs.readFile(ERROR_FILE, 'utf8');
    const errors = JSON.parse(existingData);

    // 添加新错误
    errors.push(errorWithTimestamp);

    // 写入文件
    await fs.writeFile(
      ERROR_FILE,
      JSON.stringify(errors, null, 2),
      'utf8'
    );

    res.json({
      success: true,
      message: 'Error reported successfully'
    });
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({
      success: false,
      error,
      message: 'Internal server error'
    });
  }
});

// 初始化并启动服务
initializeErrorFile()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
      console.log(`Error log file: ${ERROR_FILE}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize error file:', err);
    process.exit(1);
  });