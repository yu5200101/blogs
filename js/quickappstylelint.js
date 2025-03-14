module.exports = {
  // 注册 stylelint 的 prettier 插件
  plugins: ['stylelint-prettier'],
  // 继承一系列规则集合
  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-recommended-vue/scss",
    // 样式属性顺序规则
    'stylelint-config-recess-order',
    // 接入 Prettier 规则
    'stylelint-config-prettier',
    'stylelint-prettier/recommended'
  ],
  customSyntax: "postcss-html",
  // 配置 rules
  rules: {
    // 开启 Prettier 自动格式化功能
    'prettier/prettier': true,
    // 支持
    'color-function-notation': 'legacy',
    'alpha-value-notation': 'number',
    'color-hex-length': 'long'
  }
}
