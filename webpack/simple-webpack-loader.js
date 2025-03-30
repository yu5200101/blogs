// 不能设置箭头函数，里面的this是webpack提供的对象
// 参数source是webpack传递给loader的源文件内容
module.exports = function(source) {
  // 如果loader配置了options对象，那么this.query指向options
  // const options = this.query
  // const options1 = this.getOptions(); // 获取配置参数
  // console.log(options1, options)
  // const from = options.from || 'Hello';
  // const to = options.to || '你好';
  // return source.replace(new RegExp(from, 'g'), to);

   // 1. 获取异步回调函数
  const callback = this.async();
  // 2. 模拟异步操作（例如读取文件、请求接口）
  setTimeout(() => {
    try {
      // 3. 处理源码（这里替换 "Hello" → "你好"）
      const result = source.replace(/Hello/g, '你好');
      // 4. 回调函数参数：
      //   - 第1个参数：error表示错误/null 表示成功error: Error | null
      //   - 第2个参数：处理后的内容 content: string | Buffer
      //   - 第3个参数：可选 sourceMap
      //   - 第4个参数：可选元数据 ast
      callback(null, result);
    } catch (error) {
      // 5. 如果出错，传递错误对象
      callback(error);
    }
   }, 1000); // 延迟 1 秒
}