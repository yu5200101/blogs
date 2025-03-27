import type { ModulesMap } from '@/utils/importFind'
import { getImportFindData } from '@/utils/importFind'

const modulesFiles: ModulesMap = import.meta.glob('./modules/*.ts', {
  eager: true
})
const store: any = getImportFindData(modulesFiles)

export default store
