import type { ModulesMap } from '@/utils/importFind'
import { getImportFindData } from '@/utils/importFind'

const modulesFiles: ModulesMap = import.meta.glob('./modules/*.ts', {
  eager: true
})

const directives: any = getImportFindData(modulesFiles)
export default (app: any) => {
  Object.keys(directives).forEach(key => {
    typeof directives[key] === 'function' && directives[key](app)
  })
}
