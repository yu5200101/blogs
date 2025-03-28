const Koa = require('koa');
const Router = require('koa-router');
const multer = require('koa-multer');
const path = require('path');
const fs = require('fs');

const app = new Koa();
const router = new Router();

// 创建上传目录
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 配置 multer 存储引擎
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const safeName = path.basename(file.originalname);
    const ext = path.extname(safeName);
    const baseName = path.basename(safeName, ext);
    const timestamp = Date.now();
    cb(null, `${baseName}_${timestamp}${ext}`) // 防止文件名冲突
  }
});

// 文件过滤（可选）
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('不支持的文件类型'), false);
  }
  cb(null, true);
};

// 初始化 multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 200 * 1024 * 1024 // 200MB
  },
  fileFilter: fileFilter
});

// 错误处理中间件
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: err.message || '服务器内部错误',
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    };
  }
});

// 文件上传路由
router.post('/upload', upload.single('file'), async (ctx) => {
  const file = ctx.req.file; // multer 将文件信息放在 req.file
  if (!file) {
    ctx.status = 400;
    ctx.body = { error: '未接收到有效文件' };
    return;
  }

  ctx.body = {
    originalName: file.originalname,
    savedName: file.filename,
    size: file.size,
    mimeType: file.mimetype,
    downloadUrl: `/download/${encodeURIComponent(file.filename)}`
  };
});

// 文件下载路由
router.get('/download/:filename', async (ctx) => {
  const filename = path.basename(ctx.params.filename);
  const filePath = path.join(uploadDir, filename);

  if (!fs.existsSync(filePath)) {
    ctx.status = 404;
    ctx.body = '文件不存在';
    return;
  }

  ctx.set('Content-Disposition', `attachment; filename="${filename}"`);
  ctx.body = fs.createReadStream(filePath);
});

// 首页路由
router.get('/', (ctx) => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream(path.join(__dirname, 'index.html'));
});

app.use(router.routes());
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});