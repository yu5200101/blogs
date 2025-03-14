const path = require('path')

const webpack = require('webpack')

module.exports = {
  // 采用webpack编译时的配置
  webpack: {
    resolve: {
      extensions: ['.uxtest'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000
              }
            }
          ]
        }
      ]
    },
    plugins: [
      // 自动替换代码中的变量
      new webpack.DefinePlugin({
        ENV_TYPE: process.env.type
      })
    ]
  }
}
