
// 实现事件总线类
class EventBus implements IEventBus {
  listeners: Record<string, EventCallback[]> = {};

  // 触发事件
  emit<T>(event: string, data?: T): void {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(data));
  }

  // 订阅事件
  on<T>(event: string, callback: EventCallback<T>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  // 取消订阅（可选实现）
  off<T>(event: string, callback?: EventCallback<T>): void {
    if (!this.listeners[event]) return;
    if (!callback) {
      delete this.listeners[event]; // 移除所有该事件的监听器
    } else {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }
}

// 创建全局单例（可选）
const EVENT_BUS = new EventBus();
window.EVENT_BUS = EVENT_BUS; // 挂载到全局
window.EVENT_BUS.on('user-login', (user) => console.log(user));
export default EVENT_BUS;