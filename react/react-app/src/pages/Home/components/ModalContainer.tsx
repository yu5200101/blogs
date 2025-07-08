import React, { useState, useEffect } from 'react';
import { modalManager } from './modalManager';
import type { ModalItem } from './modalTypes';

const ModalContainer: React.FC = () => {
  const [displayedModal, setDisplayedModal] = useState<ModalItem<any> | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const openNextModel = () => {
    // 初始化检查队列
    const nextModal = modalManager.getNextModal();
    if (nextModal) {
      setDisplayedModal(nextModal);
      setIsOpen(true)
      modalManager.setCurrentModalId(nextModal.id);
    }
  }
  useEffect(() => {
    // 初始化检查队列
    openNextModel()
    return () => {
    };
  }, []);
  const handleClose = () => {
    if (!displayedModal) return;
    // 设置关闭状态，触发关闭动画
    modalManager.completeModal(displayedModal.id);
    setIsOpen(false)
    setTimeout(() => {
      openNextModel()
    }, 500);
  };
  if (!displayedModal) return null;
  const { component: ModalComponent, props, id } = displayedModal;
  return (
    <ModalComponent
      key={id}
      {...props}
      open={isOpen} // 控制弹窗开闭状态
      onClose={handleClose}
      className={isOpen ? '' : 'closing'}
    />
  );
};

export default ModalContainer;