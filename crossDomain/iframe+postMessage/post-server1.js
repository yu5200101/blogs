//server1.js
/* 
postMessage是HTML5 XMLHttpRequest Level 2中的API，且是为数不多可以跨域操作的window属性之一，它可用于解决以下方面的问题：

页面和其打开的新窗口的数据传递
多窗口之间消息传递
页面与嵌套的iframe消息传递
上面三个场景的跨域数据传递
postMessage()方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递。

otherWindow.postMessage(message, targetOrigin, [transfer]);
message: 将要发送到其他 window的数据。
targetOrigin: 通过窗口的origin属性来指定哪些窗口能接收到消息事件，其值可以是字符串"*"（表示无限制）或者一个URI。在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配targetOrigin提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送。
transfer(可选) ：是一串和message 同时传递的 Transferable 对象.这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。 
*/
let express = require('express');
let app = express();
app.use(express.static(__dirname));
app.listen(3000);