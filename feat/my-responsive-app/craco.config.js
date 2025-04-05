// craco.config.js

module.exports = {
  webpack: {
    configure: (config) => {
      // 找到原有图片处理规则并禁用
      const imageRule = config.module.rules.find(rule =>
        rule.test && rule.test.toString().includes('png|jpe?g|gif')
      );
      if (imageRule) {
        imageRule.exclude = /\.(jpe?g|png|webp)$/;
      }
      // 添加 responsive-loader 规则
      config.module.rules.push({
        test: /\.(jpe?g|png|webp)$/,
        use: {
          loader: 'responsive-loader',
          options: {
            adapter: require('responsive-loader/sharp'),
            outputPath: 'static/media/',
            publicPath: '/static/media/',
            name: '[name]-[width].[hash:8].[ext]',
            sizes: [320, 640, 960, 1280],
            placeholder: true,        // 必须启用
            placeholderSize: 40,      // 建议 20-40px
            quality: 80,
            format: 'webp',           // 强制输出格式
            esModule: true,           // 关键：确保输出 ES 模块格式
            emitFile: true            // 确保生成文件（默认 true）
          }
        }
      });

      return config;
    }
  }
};