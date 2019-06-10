/* iframe流方式是在页面中插入一个隐藏的iframe，利用其src属性在服务器和客户端之间创建一条长连接，服务器向iframe传输数据（通常是HTML，内有负责插入信息的javascript），来实时更新页面。

优点：消息能够实时到达；浏览器兼容好
缺点：服务器维护一个长连接会增加开销；IE、chrome、Firefox会显示加载没有完成，图标会不停旋转。 */

let express = require('express');
let app = express();
app.use(express.static(__dirname))
app.get('/clock', (req, res) => {
  setInterval(() => {
    let date = new Date().toLocaleString();
    res.write(`
    <script type="text/javascript">
      parent.document.getElementById('clock').innerHTML= "${date}"; // 改变父窗口dom元素
    </script>
    `)
  }, 1000)
});
app.listen(8080)