import React, { useEffect } from 'react';
import { modalManager } from './modalManager';
import ConfirmationModal from './ConfirmationModal';
import NotificationModal from './NotificationModal';

const OnboardingFlow: React.FC = () => {
  useEffect(() => {
    // 页面加载时添加多个弹窗
    modalManager.addModals([
      {
        component: ConfirmationModal,
        props: {
          title: "1欢迎使用我们的服务",
          message: "感谢您注册我们的平台！"
        },
        priority: 100
      },
      {
        component: ConfirmationModal,
        props: {
          title: "2用户体验调查",
          message: "请花一分钟时间完成我们的用户体验调查"
        },
        priority: 80
      },
      {
        component: NotificationModal,
        props: {
          title: "3订阅更新",
          message: "订阅我们的新闻通讯以获取最新更新"
        },
        priority: 60
      }
    ]);
  }, []);

  return null; // 此组件不渲染任何内容
};

export default OnboardingFlow;