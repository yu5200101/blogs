// http://localhost:3001/axios.js
// http://localhost:3001/api.js
// 访问html
let express = require('express');
let app = express();
app.use(express.static(__dirname));
app.listen(3001, () => {
  console.log('服务已启动: http://localhost:3001');
});