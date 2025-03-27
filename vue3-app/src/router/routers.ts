
import type { RouteRecordRaw } from 'vue-router'

interface RouterMap {
  [propName: string]: RouteRecordRaw
}

const modulesFiles: RouterMap = import.meta.glob('./modules/*.ts', {
  eager: true,
  import: 'default'
})

let allRouters: RouteRecordRaw[] = []

for (const path in modulesFiles) {
  if (Object.prototype.hasOwnProperty.call(modulesFiles, path)) {
    allRouters = allRouters.concat(modulesFiles[path])
  }
}
export default allRouters
