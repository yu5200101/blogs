onmessage = function (e) {
  console.log(e.data);//hello
  postMessage('hi');//向主线程发送消息
}