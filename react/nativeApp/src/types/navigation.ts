export type HomeTabList = {
  Main: {},
  Mine: {}
}
export type HomeTabKey = keyof HomeTabList
export type RootStackParamList = {
  Home: {}
  Login: {
    fromScreen: string
  },
  Details: {
    id: string       // 必传参数
    title?: string   // 可选参数
    data?: any       // 复杂数据
  }
  // 其他屏幕...
}