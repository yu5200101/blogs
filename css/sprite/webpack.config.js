const path = require('path');
const SpritesmithPlugin = require('webpack-spritesmith');
module.exports = {
  plugins: [
    new SpritesmithPlugin({
      // 源图片路径
      src: {
        cwd: path.resolve(__dirname, 'src/assets/icons'), // 图标目录
        glob: '*.png', // 匹配图标文件
      },
      // 输出配置
      target: {
        image: path.resolve(__dirname, 'dist/images/sprite.png'), // 雪碧图输出路径
        css: path.resolve(__dirname, 'dist/images/sprite.css'), // 生成的 CSS 路径
      },
      // 自定义 CSS 模板（可选）
      apiOptions: {
        cssImageRef: 'images/sprite.png', // CSS 中引用的图片路径
      }
      // 视网膜屏支持（可选）
      // retina: '@2x', // 生成双倍尺寸的雪碧图
    })
  ]
}