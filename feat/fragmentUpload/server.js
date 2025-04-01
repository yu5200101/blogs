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

// 处理分片上传
app.post('/upload', upload.single('file'), (req, res) => {
  const { chunkIndex, filename } = req.body;
  const chunkPath = path.join('uploads', `${filename}-${chunkIndex}`);

  fs.renameSync(req.file.path, chunkPath);
  res.status(200).send('Chunk uploaded');
});

// 合并分片
app.post('/merge', express.json(), async (req, res) => {
  const { filename } = req.body;
  const mergedPath = path.join('uploads', filename);
  const chunkDir = 'uploads';
  const chunks = fs.readdirSync(chunkDir)
    .filter(f => f.startsWith(filename))
    .sort((a, b) => {
      const aIndex = parseInt(a.split('-').pop());
      const bIndex = parseInt(b.split('-').pop());
      return aIndex - bIndex;
    });

  // 合并文件
  for (const chunk of chunks) {
    const chunkPath = path.join(chunkDir, chunk);
    const data = fs.readFileSync(chunkPath);
    fs.appendFileSync(mergedPath, data);
    fs.unlinkSync(chunkPath); // 删除分片
  }

  res.status(200).send('File merged');
});

app.listen(3000, () => {
  console.log('Server running on port http://localhost:3000');
});