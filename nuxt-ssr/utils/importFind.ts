export interface ModulesMap {
  [propName: string]: any
}
// 批量设置导入的模块
export const getImportFindData = (
  modulesFiles: ModulesMap
) => {
  const process: any = {}
  for (const path in modulesFiles) {
    if (Object.prototype.hasOwnProperty.call(modulesFiles, path)) {
      // 去除路径开头的 '/' 或 './'
      const cleanedPath = path.replace(/^\.?\//, '')

      // 使用正则表达式匹配最后一个'.'之后的所有内容，或者如果没有'.'，则匹配整个字符串
      // (?:\.[^/.]*$)? 是一个非捕获组，用于匹配可选的'.'及其后的字符直到字符串结束
      // |^[^/.]*$ 匹配没有'.'或'/'的整个字符串
      const fileName = cleanedPath.replace(/^(?:[^/.]*\/)*([^/.]+)(?:\.[^/.]*)?$/, '$1')

      Object.assign(process, {
        [fileName]: modulesFiles[path].default
      })
    }
  }
  return process
}