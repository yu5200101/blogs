import { StrictMode} from 'react'
import { createRoot, type Root} from 'react-dom/client'
import './index.css'
import {
  RouterProvider
} from 'react-router'
import router from '@/router'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

let root: Root
const render = (props: { container?: HTMLElement }) => {
  root = createRoot(props.container || document.getElementById('root')!)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
};

interface GlobalState {
  theme: 'light' | 'dark';
  language: 'en' | 'zh';
}

renderWithQiankun({
  mount(props) {
    props.onGlobalStateChange((state: GlobalState, prev: GlobalState) => {
      console.log('子应用收到状态变更：', state.theme);
    }, true); // true 表示立即触发一次回调
    props.setGlobalState({ theme: 'dark' });
    render(props);
  },
  bootstrap() { console.log('子应用启动'); },
  unmount() { root.unmount(); },
  update() { console.log('子应用更新'); } // 补全update方法
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({}); // 独立运行
}
