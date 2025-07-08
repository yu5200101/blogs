import type { ModalItem } from './modalTypes';

class ModalManager {
  private queue: ModalItem<any>[] = [];
  private updateListeners: (() => void)[] = [];
  private currentModalId: string | null = null;

  // 添加弹窗到队列
  addModal(modal: {
    component: React.ComponentType<any>;
    props: Record<string, any>;
    priority?: number;
  }): ModalItem<any> {
    const modalId = Math.random().toString(36).substring(2, 11);
    const modalItem: ModalItem<any> = {
      id: modalId,
      component: modal.component,
      props: modal.props,
      priority: modal.priority || 0,
    };
    this.notifyUpdate();
    return modalItem
  }
  // 添加多个弹窗
  addModals(modals: Parameters<typeof this.addModal>[0][]) {
    this.queue = modals.map(modal => this.addModal(modal));
    this.queue.sort((a, b) => b.priority - a.priority);

  }
  // 获取下一个要显示的弹窗（排除当前正在显示的）
  getNextModal(): ModalItem<any> | null {
    if (this.queue.length === 0) return null;
    // 如果当前没有弹窗显示，返回队列中第一个
    if (!this.currentModalId) {
      return this.queue[0];
    }
    // 如果当前弹窗还在队列中，返回当前弹窗
    const currentIndex = this.queue.findIndex(m => m.id === this.currentModalId);
    if (currentIndex >= 0) {
      return this.queue[currentIndex];
    }
    // 否则返回队列中第一个
    return this.queue[0];
  }
  // 设置当前显示的弹窗ID
  setCurrentModalId(id: string | null) {
    this.currentModalId = id;
  }
  // 完成当前弹窗（关闭后调用）
  completeModal(modalId: string) {
    // 从队列中移除该弹窗
    this.queue = this.queue.filter(modal => modal.id !== modalId);
    // 如果移除的是当前显示的弹窗，清空当前ID
    if (this.currentModalId === modalId) {
      this.currentModalId = null;
    }
    this.notifyUpdate();
  }
  // 注册更新监听器
  addUpdateListener(listener: () => void) {
    this.updateListeners.push(listener);
    return () => {
      this.updateListeners = this.updateListeners.filter(l => l !== listener);
    };
  }
  // 通知所有监听器
  private notifyUpdate() {
    this.updateListeners.forEach(listener => listener());
  }
  // 清空队列
  clearQueue() {
    this.queue = [];
    this.currentModalId = null;
    this.notifyUpdate();
  }
  // 获取队列状态
  getQueue() {
    return [...this.queue];
  }
}

export const modalManager = new ModalManager();