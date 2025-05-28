const Koa = require('koa');
const Router = require('koa-router');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const jwtKoa = require('koa-jwt');
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const cors = require('@koa/cors');
const path = require('path');

// 配置文件路径
const USERS_FILE = path.join(__dirname, 'user.json');
const SECRET_KEY = 'your_secure_secret_key_here'; // 生产环境建议使用环境变量

const app = new Koa();
const router = new Router();

// 初始化用户文件
function initUserFile() {
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, '[]');
    }
}
initUserFile();

// 密码加密函数（SHA-256 + hex（转成16进制））
function encryptPassword(password) {
    return crypto.createHash('sha256')
        .update(password)
        .digest('hex');
}
// 配置 CORS
app.use(cors({
  origin: ctx => ['http://localhost:1001'].includes(ctx.get('Origin'))
    ? ctx.get('Origin')
    : false,
  allowMethods: ['GET', 'POST'],
  allowHeaders: [
    'authorization',
    'X-Custom-Header',
    'content-type'
  ],
  exposeHeaders: ['X-Response-Time'],
  credentials: true,
  maxAge: 3600
}))

// 处理请求体
app.use(bodyParser());

// 错误处理中间件
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        ctx.body = {
            code: ctx.status,
            message: err.message
        };
    }
});

// JWT 验证中间件
app.use(jwtKoa({
    secret: SECRET_KEY,
    algorithms: ['HS256']
}).unless({
    // 这些路径不需要使用token
    path: [/^\/register/, /^\/login/, /^\//]
}));

// 首页路由
router.get('/', (ctx) => {
  ctx.type = 'html';
  ctx.body = fs.createReadStream(path.join(__dirname, 'index.html'));
});

// 注册接口
router.post('/register', async (ctx) => {
    const { mobile, password } = ctx.request.body;
    // 参数验证
    if (!mobile || !password) {
        ctx.status = 400;
        throw new Error('手机号和密码不能为空');
    }

    // 读取用户数据
    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    // 检查用户是否存在
    if (users.some(user => user.mobile === mobile)) {
        ctx.status = 400;
        throw new Error('手机号已注册');
    }

    // 加密存储密码
    const encryptedPassword = encryptPassword(password);

    // 存储新用户
    const newUser = {
        id: crypto.randomUUID(),
        mobile,
        password: encryptedPassword,
        createTime: new Date().toISOString()
    };
    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    ctx.body = {
        code: 0,
        data: null,
        message: '注册成功'
    };
});

// 登录接口
router.post('/login', async (ctx) => {
    const { mobile, password } = ctx.request.body;

    // 参数验证
    if (!mobile || !password) {
        ctx.status = 400;
        throw new Error('手机号和密码不能为空');
    }

    // 读取用户数据
    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    const encryptedPassword = encryptPassword(password);
    const user = users.find(u =>
        u.mobile === mobile &&
        u.password === encryptedPassword
    );

    if (!user) {
        ctx.status = 401;
        throw new Error('手机号或密码错误');
    }

    // 生成Token
    const token = jwt.sign(
        {
            userId: user.id,
            mobile: user.mobile
        },
        SECRET_KEY,
        { expiresIn: '1h' }
    );

    ctx.body = {
        code: 0,
        data: {token},
        expiresIn: 3600
    };
});

// 用户信息接口保持不变
router.get('/getUserInfo', async (ctx) => {
  try {
    const authorization = ctx.header.authorization
    if (!authorization) {
      ctx.body = {
        code: 1,
        data: null,
        message: 'not-login'
      };
      return
    }
    const token = authorization.replace('Bearer ', '')
    const result = jwt.verify(token, SECRET_KEY)
    ctx.body = {
      code: 0,
      data: result,
      message: 'success'
    };
  } catch (err) {
    ctx.body = {
      code: 1,
      data: null,
      message: err.message
    };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
    console.log('服务已启动: http://localhost:3000');
    console.log('客户端地址: file://' + path.resolve(__dirname, 'index.html'));
});