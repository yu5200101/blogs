const express = require('express');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const USER_FILE = path.join(__dirname, 'user.json');
const QR_EXPIRES = 5 * 60 * 1000; // 5分钟有效期
// 添加内存缓存（可选）
let userDataCache = null;

// 初始化user.json文件
async function initUserFile() {
  try {
    await fs.access(USER_FILE);
  } catch (err) {
    await fs.writeFile(USER_FILE, JSON.stringify({ tokens: {} }));
  }
}

// 读取用户数据
async function readUserData() {
  if (userDataCache) return userDataCache;
  try {
    const data = await fs.readFile(USER_FILE, 'utf8');
    userDataCache = data;
    return JSON.parse(data);
  } catch (err) {
    console.error('读取用户数据失败:', err);
    return { tokens: {} };
  }
}

// 保存用户数据（带自动清理过期token）
async function saveUserData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('无效的用户数据格式');
  }
  userDataCache = data;
  const now = Date.now();
  // 清理过期token
  data.tokens = Object.fromEntries(
    Object.entries(data.tokens).filter(([_, t]) => now - t.initTime <= QR_EXPIRES)
  );

  try {
    await fs.writeFile(USER_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('保存用户数据失败:', err);
  }
}

// 添加统一错误处理中间件
app.use((err, req, res, next) => {
  console.error('系统错误:', err);
  res.status(500).json({ error: '系统内部错误' });
});

// 生成二维码接口
app.get('/api/qrcode', async (req, res) => {
  const token = uuidv4();
  const userId = crypto.randomUUID()
  const userData = await readUserData();
  userData.tokens[token] = {
    initTime: Date.now(),
    status: 'waiting',
    userId
  };

  await saveUserData(userData);

  const url = `https://localhost:3000/code?token=${token}&userId=${userId}`;
  // 需要设置成实际的访问连接，此时不能设置，设置会出问题
  // const url = `https://localhost:3000/confirm?token=${token}&userId=${userId}`;
  // 生成二维码
  const qrDataUrl = await QRCode.toDataURL(url);

  res.json({
    token,
    userId,
    qrcode: qrDataUrl,
    expiresIn: QR_EXPIRES / 1000
  });
});

// 确认登录接口
app.post('/api/see-confirm', async (req, res) => {
  const { token, userId } = req.body;
  const userData = await readUserData();
  const tokenData = userData.tokens[token];

  // 验证有效性
  if (!tokenData || Date.now() - tokenData.initTime > QR_EXPIRES) {
    return res.status(400).json({ error: '二维码已过期' });
  }

  // 更新状态
  tokenData.status = 'see';
  tokenData.userId = userId;
  await saveUserData(userData);

  res.json({ success: true });
});

// 确认登录接口
app.post('/api/confirm-login', async (req, res) => {
  const { token, userId } = req.body;
  const userData = await readUserData();
  const tokenData = userData.tokens[token];

  // 验证有效性
  if (!tokenData || Date.now() - tokenData.initTime > QR_EXPIRES) {
    return res.status(400).json({ error: '二维码已过期' });
  }

  // 更新状态
  tokenData.status = 'confirmed';
  tokenData.userId = userId;
  await saveUserData(userData);

  res.json({ success: true });
});

// 检查登录状态接口
app.get('/api/check-login', async (req, res) => {
  const { token } = req.query;
  const userData = await readUserData();
  const tokenData = userData.tokens[token];

  // 检查过期
  if (!tokenData || Date.now() - tokenData.initTime > QR_EXPIRES) {
    return res.json({ status: 'expired' });
  }

  // 处理已确认状态
  if (tokenData.status === 'confirmed') {
    const confirmedToken = { ...tokenData };
    // 删除已使用的token
    delete userData.tokens[token];
    await saveUserData(userData);

    return res.json({
      status: 'confirmed',
      user: { id: confirmedToken.userId } // 根据实际情况获取用户信息
    });
  }

  res.json({ status: tokenData.status });
});

// 手机端访问链接
app.get('/confirm', async (req, res) => {
  const dirName = path.join(__dirname, 'confirm')
  res.send(fs.createReadStream(path.join(dirName, 'index.html')))
})

// 启动服务
initUserFile().then(() => {
  app.listen(3000, () => {
    console.log('Server running on port http://localhost:3000');
  });
});