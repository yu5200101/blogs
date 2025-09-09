// 定义事件回调函数类型
type EventCallback<T = any> = (data: T) => void;

// 定义事件总线接口
interface IEventBus {
  listeners: Record<string, EventCallback[]>;
  emit<T>(event: string, data?: T): void;
  on<T>(event: string, callback: EventCallback<T>): void;
  off<T>(event: string, callback?: EventCallback<T>): void;
}

interface Window {
  EVENT_BUS?: IEventBus
}
