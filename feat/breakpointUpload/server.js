// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');
const app = express();

app.use(cors());
app.use(express.static(__dirname));
const upload = multer({ dest: 'uploads/' });
// 新增路由
app.get('/check', (req, res) => {
  const { hash } = req.query;
  const chunkDir = path.join('uploads', hash);
  if (!fs.existsSync(chunkDir)) {
    return res.json({ code: 0, data: [] });
  }

  const chunks = fs.readdirSync(chunkDir)
    .map(name => path.basename(name).split('-')[1])
    .filter(Boolean);

  res.json({ code: 0, data: chunks });
});

// 修改上传处理
app.post('/upload', upload.single('file'), (req, res) => {
  const { hash, chunkIndex } = req.body;
  const chunkDir = path.join('uploads', hash);
  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir);
  }

  const chunkPath = path.join(chunkDir, `${hash}-${chunkIndex}`);
  fs.renameSync(req.file.path, chunkPath);
  res.status(200).send('Chunk uploaded');
});

// 修改合并逻辑
app.post('/merge', express.json(), async (req, res) => {
  const { hash, filename, totalChunks } = req.body;
  const chunkDir = path.join('uploads', hash);
  const mergedPath = path.join('uploads', filename);

  // 验证分片数量
  const chunks = fs.readdirSync(chunkDir);
  if (chunks.length !== totalChunks) {
    return res.status(400).send('分片数量不匹配');
  }

  // 按序号排序
  chunks.sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]));

  // 流式合并
  const writeStream = fs.createWriteStream(mergedPath);
  for (const chunk of chunks) {
    const chunkPath = path.join(chunkDir, chunk);
    const buffer = fs.readFileSync(chunkPath);
    writeStream.write(buffer);
    // 删除临时文件
    fs.unlinkSync(chunkPath);
  }
  writeStream.end();

  // 删除临时目录
  fs.rmdirSync(chunkDir);

  res.status(200).send('合并完成');
});

// 新增校验接口
app.get('/verify', (req, res) => {
  const { filename } = req.query;
  const filePath = path.join('uploads', filename);
  if (!fs.existsSync(filePath)) {
    return res.json({ success: false });
  }

  // 实际生产环境需要计算文件哈希
  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Server running on port http://localhost:3000');
});