// stores/example/index.ts
import { globSync } from 'glob'
import { defineStore } from 'pinia'
import type { DefineStoreOptions } from 'pinia'

// 类型定义
type StoreModule = DefineStoreOptions<string, any, any, any>
type Stores = Record<string, ReturnType<typeof defineStore>>

// 自动加载 modules 目录下的所有 store
const stores: Stores = {}

globSync('./modules/*.ts', {
  cwd: __dirname, // 指定当前目录为基准路径
  absolute: true   // 返回绝对路径
}).forEach((filePath) => {
  // 动态导入模块
  const module = require(filePath)
  // 提取 store 名称 (基于文件名)
  const fileName = filePath.split('/').pop()?.replace('.ts', '')
  if (!fileName) return
  // 获取具名导出的 store
  const storeName = `use${fileName.charAt(0).toUpperCase()}${fileName.slice(1)}Store`
  const store = module[storeName]
  if (store) {
    // 转换为小驼峰作为 key
    const key = `${fileName}Store`
    stores[key] = store
  }
})

// 批量导出所有 stores
export const exampleStores = stores

// 按需导出类型
export type ExampleStores = typeof exampleStores