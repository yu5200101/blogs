// sw.js
// 注册Service Worker时添加版本标识
const SW_VERSION = 'v2.3.0';
const CACHE_NAME = `my-site-cache-${SW_VERSION}`;
const PRE_CACHE = [
  '/index.html'
];
self.addEventListener('install', (event) => {
  console.log('install')
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => cache.addAll(PRE_CACHE))
    .then(() => self.skipWaiting()) // 可选的立即激活
  );
});

self.addEventListener('activate', (event) => {
  console.log('activate')
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // 清理旧缓存
          }
        })
      );
    }).then(() => {
    console.log('activate-then')
      // 通知所有客户端
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'NEW_VERSION_AVAILABLE',
            version: SW_VERSION
          });
        });
      });
    })
  );
});