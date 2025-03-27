/*
 * @Name: api集合
 * @Description: 这里使用 import.meta.glob动态引入，将在调用API时，失去ts提示
 */

interface APIMap {
  [propName: string]: any
}

const modulesFiles: APIMap = import.meta.glob('./modules/*.ts', {
  eager: true
})
const api: any = {}

for (const path in modulesFiles) {
  if (Object.prototype.hasOwnProperty.call(modulesFiles, path)) {
    Object.assign(api, modulesFiles[path])
  }
}
export default api
