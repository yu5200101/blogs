class EventEmitter {
  constructor() {
    this._events = Object.create(null); // 使用无原型的对象存储事件
  }

  on(eventName, listener) {
    if (!this._events[eventName]) {
      this._events[eventName] = [];
    }
    this._events[eventName].push(listener);
    return this;
  }

  addListener(eventName, listener) {
    return this.on(eventName, listener);
  }

  prependListener(eventName, listener) {
    if (!this._events[eventName]) {
      this._events[eventName] = [];
    }
    this._events[eventName].unshift(listener);
    return this;
  }

  emit(eventName, ...args) {
    const listeners = this._events[eventName];
    if (!listeners || listeners.length === 0) return false;

    listeners.forEach(fn => {
      Reflect.apply(fn, this, args)
    })
    return true
  }

  off(eventName, listener) {
    const listeners = this._events[eventName];
    if (!listeners) return this;

    // 从后往前查找匹配的监听器
    let index = -1;
    for (let i = listeners.length - 1; i >= 0; i--) {
      const current = listeners[i];
      if (current === listener || current._origin === listener) {
        index = i;
        break;
      }
    }

    if (index !== -1) {
      listeners.splice(index, 1);
      // 如果事件无监听器，删除事件属性
      if (listeners.length === 0) {
        delete this._events[eventName];
      }
    }

    return this;
  }

  removeListener(eventName, listener) {
    return this.off(eventName, listener);
  }

  once(eventName, listener) {
    this.on(eventName, this.onceWrap(eventName, listener, this));
    return this;
  }
  onceWrap(eventName, listener, target) {
    const state = { flag: false, eventName, listener, target }
    const lastFn = this.onceWrapper.bind(state)
    state.lastFn = lastFn
    return lastFn
  }
  onceWrapper(...args) {
    if (!this.flag) {
      this.flag = true
      Reflect.apply(this.listener, this.target, args)
      this.target.off(this.eventName, this.lastFn)
    }
  }

  removeAllListeners(eventName) {
    if (eventName !== undefined) {
      delete this._events[eventName];
    } else {
      this._events = Object.create(null); // 清空所有事件
    }
    return this;
  }
}

const emitter = new EventEmitter();

// 添加普通监听器
emitter.on('data', (data) => {
  console.log('Received data:', data);
});

// 添加一次性监听器
emitter.once('end', () => {
  console.log('Process ended');
});

// 触发事件
emitter.emit('data', 'Hello World'); // 输出: Received data: Hello World
emitter.emit('end'); // 输出: Process ended
emitter.emit('end'); // 无输出

// 移除监听器
const listener = () => console.log('Listener removed');
emitter.on('remove', listener);
emitter.emit('remove');
emitter.off('remove', listener);
emitter.emit('remove');
