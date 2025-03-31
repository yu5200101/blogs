// 被观察者 (Subject)
class Subject {
  constructor() {
    this.observers = [];
    this.state = null;
  }

  // 添加观察者
  addObserver(observer) {
    this.observers.push(observer);
  }

  // 移除观察者
  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  // 通知所有观察者
  notifyObservers() {
    this.observers.forEach(observer => {
      observer.update(this.state);
    });
  }

  // 修改状态并触发通知
  setState(newState) {
    this.state = newState;
    this.notifyObservers();
  }
}

// 观察者 (Observer)
class Observer {
  constructor(name) {
    this.name = name;
  }

  update(state) {
    console.log(`[${this.name}] 收到新状态:`, state);
  }
}

// 使用示例
const subject = new Subject();
const observerA = new Observer("观察者A");
const observerB = new Observer("观察者B");

subject.addObserver(observerA);
subject.addObserver(observerB);

subject.setState("状态1"); // 两个观察者都会收到通知
subject.removeObserver(observerB);
subject.setState("状态2"); // 只有观察者A收到通知