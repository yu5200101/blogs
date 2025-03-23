import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    // 立即执行
    format: 'iife',
    // 全局变量名
    name: 'MyBundle',
  },
  plugins: [
    resolve(), // 解析第三方模块
    commonjs(), // 转换 CommonJS 模块
    babel({
      // 使用 bundled 模式
      babelHelpers: 'bundled',
      // 排除 node_modules
      exclude: 'node_modules/**',
    })
    // terser(), // 压缩代码
  ],
};