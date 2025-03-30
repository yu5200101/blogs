// simple-webpack-plugin.js
class SimpleWebpackPlugin {
  // 构造函数（可接收配置参数）
  constructor(options = {}) {
    this.options = {
      version: '1.0.0',
      ...options
    };
  }

  // 必须实现 apply 方法
  apply(compiler) {
    // 挂载到 Webpack 的 "emit" 钩子（生成资源到输出目录前）
    compiler.hooks.emit.tap('SimpleWebpackPlugin', (compilation) => {
      // 获取输出目录路径
      const outputPath = compilation.outputOptions.path;
      // 生成文件内容
      const content = `Version: ${this.options.version}\nBuild Time: ${new Date().toISOString()}\noutputPath:${outputPath}`;
      // 将文件内容添加到 Webpack 的输出资源中
      compilation.assets['version.txt'] = {
        source: () => content,
        size: () => content.length
      };
    });
    /* hooks常用有：
      compile	编译开始前	准备编译环境
      emit	生成资源到输出目录前	修改最终资源（推荐）
      done	构建完成时	完成通知、后处理
      afterEmit	资源写入磁盘后	清理临时文件
    */
  }
}

module.exports = SimpleWebpackPlugin;