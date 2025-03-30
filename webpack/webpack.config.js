const path = require('path');
const SimpleWebpackPlugin = require('./simple-webpack-plugin.js')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 匹配所有 .js 文件
        use: [
          {
            loader: path.resolve(__dirname, 'simple-webpack-loader.js'),
            options: { from: 'Hello', to: 'Hi' }
          }
        ]
      }
    ]
  },
  plugins: [
    new SimpleWebpackPlugin({
      version: '2.0.0' // 传递自定义参数
    })
  ]
}