// 4.websocket
/*
websocket是html5的一个持久化协议，它实现了浏览器与服务器的全双工通信，同时也是跨域的一种解决方案
websocket不受同源策略影响，只要服务器端支持，无需任何配置就支持跨域
前端页面在8080的端口
*/
let express = require('express');
let app = express();
let WebSocket = require('ws');
let wss = new WebSocket.Server({port: 3000});
wss.on('connection', function(ws) {
  ws.on('message', function(data){
    console.log(data);
    ws.send('111');
  })
})