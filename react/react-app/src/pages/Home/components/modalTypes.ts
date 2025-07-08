// 弹窗组件接口
export interface ModalComponentProps<TResult = any> {
  open: boolean;
  onClose: (result?: TResult) => void;
  [key: string]: any;
}

// 弹窗队列项
export interface ModalItem<TProps extends ModalComponentProps> {
  id: string;
  component: React.ComponentType<TProps>;
  props: Omit<TProps, 'open' | 'onClose'>;
  priority: number
}

export interface ModalProps {
  open: boolean;
  title: string;
  message: string;
  className: string;
  onClose: (confirmed?: boolean) => void;
}
