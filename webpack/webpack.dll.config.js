const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: process.env.NODE_ENV, // 或 'development'
  entry: {
    // 定义要打包的第三方库
    vendor: ['react', 'react-dom'],
  },
  output: {
    path: path.resolve(__dirname, 'dll'), // 输出目录
    filename: '[name].dll.js', // 输出文件名（[name] 对应 entry 的 key）
    library: '[name]_dll', // 全局变量名（供 DllReferencePlugin 使用）
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_dll', // 需与 output.library 一致
      path: path.join(__dirname, 'dll', '[name].manifest.json'), // manifest 文件路径
    }),
  ],
};