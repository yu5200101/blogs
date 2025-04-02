//server1.js 通过http://localhost:3000/browser/index.html
// 访问html
let express = require('express');
let app = express();
app.use(express.static(__dirname));
app.listen(3000, () => {
  console.log('服务器启动', 'http://localhost:3000');
})