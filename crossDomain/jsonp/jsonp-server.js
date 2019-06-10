let express = require('express'); 
let app = express();
// 1.jsonp跨域
/* 实现原理:

Step1: 创建 callback 方法

Step2: 插入 script 标签

Step3: 后台接受到请求，解析前端传过去的 callback 方法，返回该方法的调用，并且数据作为参数传入该方法

Step4: 前端执行服务端返回的方法调用

下面代码仅为说明 jsonp 原理，项目中请使用成熟的库。分别看一下前端和服务端的简单实现： */
app.get('/say', (req, res) => {
  let {cb} = req.query; // 获取传来的callback函数名， cb是key
  res.send(`${cb}('hello')`);
});

/* 
OPTIONS请求方法主要有两个用途
1.获取服务器支持的http请求方法
2.检查服务器的性能，例如：AJAX进行跨域请求时的预检，需要向另外一个域名的资源发送一个HTTP OPTIONS请求头，用以判断实际发送的请求是否安全。
*/


app.listen(3000);

