# 开发注意事

## 开发环境
* 1. `node` 版本 > `v16.0.0`，由于新老项目对`node`版本不一致，[建议使用n来管理你的node版本](https://www.npmjs.com/package/n)

## nginx配置
``` sh
server {
  listen  80;
  listen  443 ssl;
  server_name  www.test.com;

  location /vue3-app {
    proxy_pass  http://127.0.0.1:9015/vue3-app;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}

```

## 编辑器VsCode
建议安装如下插件
* Volar
* TypeScript Vue Plugin(Volar)
* [korofileheader代码注释](https://github.com/OBKoro1/koro1FileHeader)
* Prettier，代码
* Code Spell Checker，单词规则检查

## 基础语言
* [TS中文手册](https://typescript.bootcss.com/)

## 基础框架
* [vue](https://cn.vuejs.org/guide/introduction.html)
* [vue-router](https://router.vuejs.org/zh/guide/)
* [pinia](https://pinia.vuejs.org/zh/)

## 构建相关
* [vite](https://cn.vitejs.dev/config/shared-options.html)

## 三方资源
* [vant](https://vant-ui.github.io/vant/#/zh-CN/home)
* [lodash](https://www.lodashjs.com/)
* [dayjs](https://day.js.org/zh-CN/)
* [axios](https://www.axios-http.cn/docs/intro)
