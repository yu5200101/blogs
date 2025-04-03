// sw.js（Service Worker代码）
self.addEventListener('message', (event) => {
  event.waitUntil(
    clients.matchAll().then(clients => {
      clients.forEach(client => {
        if(client.id !== event.source.id) {
          client.postMessage(event.data);
        }
      });
    })
  );
});