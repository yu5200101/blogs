module.exports = {
  // 注册 stylelint 的 prettier 插件
  plugins: ['stylelint-prettier'],
  // 继承一系列规则集合
  extends: [
    "stylelint-config-standard-scss",
    "stylelint-config-recommended-vue/scss",
    // 接入 Prettier 规则
    'stylelint-config-prettier',
    'stylelint-prettier/recommended'
  ],
  // 配置 rules
  rules: {
    // 开启 Prettier 自动格式化功能
    'prettier/prettier': true,
    // 支持
    'color-function-notation': 'legacy',
    'alpha-value-notation': 'number',
    'color-hex-length': 'long',
    'selector-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,
    'property-no-vendor-prefix': null,
    "selector-pseudo-class-no-unknown": [
      true,
      {
        "ignorePseudoClasses": ["deep"]
      }
    ],
    "font-family-no-missing-generic-family-keyword": null,
    "selector-class-pattern": null
  }
}
