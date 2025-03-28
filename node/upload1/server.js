const Koa = require('koa');
const Router = require('koa-router');
const path = require('path');
const { koaBody } = require('koa-body');
const fs = require('fs');

const app = new Koa();
const router = new Router();

// 创建上传目录
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // 使用 recursive 更安全
}

// 配置koa-body中间件
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: uploadDir,
        keepExtensions: true,
        maxFileSize: 200 * 1024 * 1024,
        filename: (name, ext, part) => { // 自定义安全文件名
            const timestamp = Date.now();
            const safeName = path.basename(name);
            return `${safeName}_${timestamp}${ext}`;
        }
    }
}));

// 错误处理中间件
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.error('全局捕获错误:', err);
        ctx.status = 500;
        ctx.body = { error: '服务器处理请求失败' };
    }
});

// 文件上传路由
router.post('/upload', async (ctx) => {
    const file = ctx.request.files?.file;
    if (!file) {
        ctx.status = 400;
        ctx.body = { error: '未接收到文件' };
        return;
    }

    // 自动保存的文件信息
    ctx.body = {
        originalName: file.originalFilename,
        savedName: file.newFilename,
        downloadUrl: `/download/${file.newFilename}`,
        size: file.size,
        mimeType: file.mimetype
    };
});

// 文件下载路由（新增）
router.get('/download/:filename', async (ctx) => {
    const filename = path.basename(ctx.params.filename);
    const filePath = path.join(uploadDir, filename);
    if (!fs.existsSync(filePath)) {
        ctx.status = 404;
        ctx.body = '文件不存在';
        return;
    }

    ctx.type = path.extname(filename);
    ctx.body = fs.createReadStream(filePath);
});

// 首页路由
router.get('/', (ctx) => {
    ctx.type = 'html';
    ctx.body = fs.createReadStream(path.join(__dirname, 'index.html'));
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3001, () => {
    console.log('服务器运行在 http://localhost:3000');
    console.log('上传目录:', uploadDir);
});