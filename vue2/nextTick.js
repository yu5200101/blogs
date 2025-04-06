// Vue 中的 nextTick的核心就是利用JavaScript的事件循环机制，将回调延迟到DOM更新之后执行
// Vue 的响应式数据更新是 异步批量处理 的。当数据变化时，Vue 不会立即更新 DOM，而是将需要更新的 Watcher（依赖）推入一个队列，并在同一事件循环（Event Loop）中批量执行更新

// 简化的核心逻辑
let callbacks = [];
let pending = false;

function flushCallbacks() {
  pending = false;
  const copies = callbacks.slice(0);
  callbacks.length = 0;
  for (let i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

function nextTick(cb, ctx) {
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    }
  });
  // Promise.then > MutationObserver > setImmediate > setTimeout
  if (!pending) {
    pending = true;
    // 选择异步策略
    if (typeof Promise !== 'undefined') {
      const p = Promise.resolve();
      p.then(flushCallbacks);
    } else if (typeof MutationObserver !== 'undefined') {
      // 使用 MutationObserver
    } else if (typeof setImmediate !== 'undefined') {
      setImmediate(flushCallbacks, 0);
    } else {
      setTimeout(flushCallbacks, 0);
    }
  }
}
// 在 Vue 3 中，nextTick 的实现更加简洁，默认直接使用 Promise.then（无需降级处理）。