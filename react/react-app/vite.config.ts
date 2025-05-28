import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import postcssPxToRem from 'postcss-pxtorem'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    // 设置服务启动端口号
    port: 1001,
    // 设置服务启动时是否自动打开浏览器
    open: false,
    // 允许跨域
    cors: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    postcss: {
      plugins: [
        postcssPxToRem({
          rootValue: 75,               // 对应设计稿的 1rem = 100px
          propList: ['*'],              // 转换所有 CSS 属性
          selectorBlackList: [/^html$/, /^ant-/, /^un-rem-/],
          // 允许在媒体查询中转换px。
          mediaQuery: true
        })
      ]
    }
  },
  build: {
    target: ['es2015', 'edge12', 'firefox60', 'chrome50', 'safari10']
  }
})
