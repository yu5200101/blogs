// worker.js（SharedWorker代码）
const ports = [];
onconnect = (e) => {
  const port = e.ports[0];
  ports.push(port);
  port.onmessage = (e) => {
    ports.forEach(p => {
      if(p !== port) p.postMessage(e.data);
    });
  };
};