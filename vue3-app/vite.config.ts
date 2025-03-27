import { defineConfig, mergeConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import type { UserConfigExport } from 'vite'
import postcssImport from 'postcss-import'
import autoprefixer from 'autoprefixer'
import pxtorem from 'postcss-pxtorem'
import legacy from '@vitejs/plugin-legacy'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import viteStylelint from 'vite-plugin-stylelint'
import viteEslint from 'vite-plugin-eslint'
import { analyzer } from 'vite-bundle-analyzer'

const baseCfg: UserConfigExport = {
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  define: {
    __VUE_PROD_DEVTOOLS__: true,
    'import.meta.env.SSR': JSON.stringify(process.env.SSR || 'false')
  },
  css: {
    postcss: {
      plugins: [
        postcssImport(),
        autoprefixer(),
        pxtorem({
          // 设计稿宽度除以 10，  开头大写的Px 不转换 => height: 100Px, 内联样式不转换，需要 / 75 转成 rem
          rootValue: 75,
          // 计算结果保留 6 位小数
          unitPrecision: 6,
          // 排除，am-开头的class，不进行rem转换
          selectorBlackList: ['unrem-'],
          // 可以从px更改为rem的属性  感叹号开头的不转换
          propList: ['*', '!font-weight', '!letter-spacing'],
          // 转换成 rem 以后，不保留原来的 px 单位属性
          replace: true,
          // 允许在媒体查询中转换px。
          mediaQuery: true,
          // 设置要替换的最小像素值。
          minPixelValue: 0,
          // 排除 node_modules 文件(node_modules 内文件禁止转换)
          exclude: /node_modules/i
        }),
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: atRule => {
              if (atRule.name === 'charset') {
                atRule.remove()
              }
            }
          }
        }
      ]
    },
    preprocessorOptions: {
      scss: {
        charset: false
      }
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => ['wx-open-subscribe', 'wx-open-launch-weapp'].includes(tag)
        }
      }
    }),
    AutoImport({
      resolvers: [VantResolver()]
    }),
    Components({
      resolvers: [VantResolver()]
    }),
    viteEslint({
      cache: false
    }),
    // 省略其它插件
    viteStylelint({
      cache: false
    })
  ],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsxInject: 'import { h, Fragment } from \'vue\''
  }
}

const devCfg: UserConfigExport = {
  server: {
    host: '0.0.0.0',
    // 设置服务启动端口号
    port: 9015,
    // 设置服务启动时是否自动打开浏览器
    open: false,
    // 允许跨域
    cors: true
  }
}

const buildCfg: UserConfigExport = {
  base: 'https://store.test.com/vue3-app/',
  plugins: [
    // 低版本浏览器兼容
    legacy({
      targets: ['chrome < 60', 'edge < 15']
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'vue',
            'vue-router',
            'pinia',
            'axios',
            'vant',
            'lib-flexible',
            'intersection-observer',
            'babel-polyfill'
          ]
        }
      }
    }
  }
}

// 打包依赖分析
const analyzeCfg: UserConfigExport = {
  plugins: [
    // 低版本浏览器兼容
    legacy({
      targets: ['chrome < 60', 'edge < 15']
    }),
    // 打包依赖配置
    analyzer({
      defaultSizes: 'gzip'
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'vue',
            'vue-router',
            'pinia',
            'axios',
            'vant',
            'lib-flexible',
            'intersection-observer',
            'babel-polyfill'
          ]
        }
      }
    }
  }
}


export default defineConfig(({ command, mode }) => {
  if (mode === 'analyze') {
    return mergeConfig(baseCfg, analyzeCfg)
  }

  // 服务模式
  if (command === 'serve') {
    return mergeConfig(baseCfg, devCfg)
  }

  // 构建模式
  return mergeConfig(baseCfg, buildCfg)
})
