/*
 * @Name: api集合
 * @Description: 这里使用 import.meta.glob动态引入，将在调用API时，失去ts提示
 */
import * as base from './modules/base'
// interface APIMap {
//   [propName: string]: any
// }
// const modulesFiles: APIMap = require.context('./modules/*.ts', false, /\.ts$/)
// const api: any = {}

// console.log(modulesFiles, 'modulesFiles')
// for (const path in modulesFiles) {
//   if (Object.prototype.hasOwnProperty.call(modulesFiles, path)) {
//     Object.assign(api, modulesFiles[path])
//   }
// }
export default {
  ...base
}
