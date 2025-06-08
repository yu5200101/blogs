const path = require('path');
const webpack = require('webpack');
const SimpleWebpackPlugin = require('./simple-webpack-plugin.js')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
  entry: './src/main.tsx',
  output: {
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    // 静态资源路径
    publicPath: '/'
  },
  externals: isProduction ? {
    // 将大型库标记为外部依赖，通过CDN引入
    'react': 'React',
    'react-dom': 'ReactDOM'
  } : {},
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'], // 添加TypeScript扩展
    alias: {
      // 添加路径别名以匹配tsconfig.json中的设置
      '@': path.resolve(__dirname, 'src')
    }
  },
  // ...其他配置
  devtool: 'eval-cheap-module-source-map', // 开发环境source map
  devServer: {
    static: path.join(__dirname, 'public'), // 服务静态文件目录
    port: 3000,                            // 端口
    open: false,                            // 自动打开浏览器
    hot: true,                             // 热更新（HMR）
    historyApiFallback: true,               // 支持 React Router
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  cache: {
    type: 'filesystem', // 使用文件系统缓存
  },
  module: {
    rules: [
      // TypeScript/TSX 文件处理
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-react',
                '@babel/preset-typescript'
              ],
              plugins: [
                isProduction && ['babel-plugin-transform-remove-console', { exclude: ['error', 'warn'] }]
              ].filter(Boolean)
            }
          },
          // 多线程处理器
          'thread-loader',
          {
            loader: 'ts-loader', // 使用ts-loader处理TypeScript
            options: {
              transpileOnly: true, // 只转译不进行类型检查
              happyPackMode: true  // 启用对多线程处理工具
            }
          },
          {
            loader: path.resolve(__dirname, 'simple-webpack-loader.js'),
            options: { from: 'Hello', to: 'Hi' }
          }
        ]
      },
      {
        test: /\.(js|jsx)$/,      // 匹配 JS/JSX 文件
        exclude: /node_modules/,
        use: 'babel-loader',       // 使用 Babel 转换
      },
      {
        test: /\.(css|scss)$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                localIdentName: isProduction
                  ? '[hash:base64:8]'
                  : '[path][name]__[local]'
              }
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        // webpack5自带的
        type: 'asset',
        generator: {
          filename: 'images/[name].[contenthash:8][ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024 // 8kb以下图片转base64
          }
        },
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[contenthash:8][ext]'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({ // 另一个使用 webpack 的地方
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new SimpleWebpackPlugin({
      version: '2.0.0' // 传递自定义参数
    }),
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, 'dll', 'vendor.manifest.json'), // 指向 manifest 文件
    }),
    new HtmlWebpackPlugin({
      title: '我的应用',
      templateParameters: {
        isProduction
      },
      inject: true,
      minify: isProduction ? {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      } : false,
      filename: 'index.html',
      // chunks: ['app'],
      template: './public/index.html'  // 基于此模板生成 HTML
    }),
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, 'dll/vendor.dll.js'),
      publicPath: './', // 可选，文件在输出目录中的路径
    }),
    // ts类型检查
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
        mode: 'write-references',
      },
      async: true, // 异步检查不影响构建速度
    })
  ],
  optimization: {
    sideEffects: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true, // 生产环境移除console
            drop_debugger: true // 移除debugger
          },
          output: {
            comments: false // 移除注释
          }
        }
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: 'all', // 分离 node_modules 到单独文件
      minSize: 20000, // 生成 chunk 的最小体积（20KB）
      maxSize: 250000, // 最大文件大小（250KB）
      minChunks: 1, // 模块被引用次数阈值
      maxAsyncRequests: 30, // 异步加载时的最大并行请求数
      maxInitialRequests: 30, // 入口点的最大并行请求数
      automaticNameDelimiter: '_', // 名称分隔符
      cacheGroups: {
        // 分离 React 相关库
        reactCore: {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
          name: 'react-core',
          chunks: 'all',
          priority: 20,
          enforce: true
        },
        // 分离其他第三方库
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          maxSize: 250000,
          chunks: 'all',
          name: 'vendors',
          priority: 10,
        },
        styles: {
          test: /\.(css|scss)$/,
          name: 'styles',
          chunks: 'all',
          enforce: true
        },
        // 分离公共代码
        common: {
          name: 'common',
          // 被2个及以上入口引用就拆分
          minChunks: 2,
          // 数值越大优先级越高，先命中优先级高的组，默认值0，
          priority: 5,
          // 'initial' - 只处理初始 chunks
          // 'async' - 只处理异步 chunks
          // 'all' - 处理所有 chunks（最常用）
          chunks: 'all',
           // 重用已存在的 chunk，避免重复打包相同模块
          reuseExistingChunk: true,
          // 强制生成 chunk（忽略 minSize 等限制）
          enforce: true
        },
        utils: {
          chunks: 'all',
          test: /[\\/]src[\\/]utils[\\/]/, // 匹配 utils 目录
          name: 'utils', // 带 hash 的文件名
          minSize: 0 // 强制小文件也拆分
        }
      }
    },
    // 运行时文件分离，长缓存优化
    runtimeChunk: {
      name: 'runtime'
    }
  },
  performance: {
    hints: isProduction ? 'warning': false,
    maxAssetSize: 500 * 1024, // 提高警告阈值至500KB
    maxEntrypointSize: 500 * 1024
  }
}

// 4. 仅在生产环境添加 BundleAnalyzerPlugin
if (isProduction) {
  const list = [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static', // 生成静态HTML报告
      reportFilename: 'bundle-report.html', // 报告文件名
      openAnalyzer: false, // 不自动打开浏览器
      generateStatsFile: true, // 生成stats.json文件
      statsFilename: 'stats.json', // stats文件名
      logLevel: 'info', // 日志级别
      stats: {
        chunks: true,
        chunkModules: true
      }
    })
  ]
  config.plugins.push(...list);
}
if (isProduction) {
  const list = [
    // 每次构建前清空 dist/
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[id].[contenthash:8].css'
    }),
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10 * 1024,
      minRatio: 0.8,
    }),
  ]
  config.plugins.push(...list);
}
module.exports = config