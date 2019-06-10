var worker = new Worker('./worker.js');//创建一个子线程
worker.postMessage('Hello');
worker.onmessage = function(e) {
  console.log(e.data);
  worker.terminate();//结束线程
}