//server2.js
// 2.cors跨域
/* 
jsonp 只能支持 get 请求，cors 可以支持多种请求。cors 并不需要前端做什么工作。
只要服务器设置的Access-Control-Allow-Origin Header和请求来源匹配，浏览器就允许跨域

1.请求的方法是get，head或者post。
2.Content-Type是application/x-www-form-urlencoded, multipart/form-data 或 text/plain中的一个值，或者不设置也可以，一般默认就是application/x-www-form-urlencoded。
3.请求中没有自定义的HTTP头部，如x-token。(应该是这几种头部 Accept，Accept-Language，Content-Language，Last-Event-ID，Content-Type）
*/
// 简单跨域请求
/* app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'xxx');
}) */
// 带预检（Preflighted）的跨域请求
// 不满足简单跨域请求的，即是带预检的跨域请求。服务端需要设置Access-Control-Allow-Origin(允许跨域资源请求的域)。Acceess-Control-Allow-Methods(允许的请求方法)和Access-Control-Allow-Headers(允许的请求头)
/* app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'XXX');
  res.setHeader('Access-Control-Allow-Headers', 'XXX');// 允许返回的头
  res.setHeader('Access-Control-Allow-Methods', 'XXX');// 允许使用put方法请求接口
  res.setHeader('Access-Control-Max-Age', 6); // 预检的存活时间
  if (req.method === 'OPTIONS') {
    res.end();//如果method是OPTIONS,不做处理
  }
}) */
let express = require('express')
let app = express()
let whitList = ['http://localhost:3000'] //设置白名单
app.use(function (req, res, next) {
  let origin = req.headers.origin
  if (whitList.includes(origin)) {
    // 设置哪个源可以访问我
    res.setHeader('Access-Control-Allow-Origin', origin)
    // 允许携带哪个头访问我
    res.setHeader('Access-Control-Allow-Headers', 'name')
    // 允许哪个方法访问我
    res.setHeader('Access-Control-Allow-Methods', 'PUT')
    // 允许携带cookie
    res.setHeader('Access-Control-Allow-Credentials', true)
    // 预检的存活时间
    res.setHeader('Access-Control-Max-Age', 6)
    // 允许返回的头
    res.setHeader('Access-Control-Expose-Headers', 'name')
    if (req.method === 'OPTIONS') {
      res.end() // OPTIONS请求不做任何处理
    }
  }
  next()
})
app.put('/getData', function (req, res) {
  console.log(req.headers)
  res.setHeader('name', 'jw') //返回一个响应头，后台需设置
  res.end('我不爱你')
})
app.get('/getData', function (req, res) {
  console.log(req.headers)
  res.end('我不爱你')
})
app.use(express.static(__dirname))
app.listen(4000)