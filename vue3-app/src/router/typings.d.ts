import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // 是否显示在菜单栏中
    showInMenu?: boolean
    // 需要登录
    requireAuth?: boolean
    // 是否需要绑定手机号
    checkIsBindMobile?: boolean
    outsideNotAuth?: boolean
    // 是否校验登录
    checkLogin?: boolean
    title?: string
    dataPageId?: string
  }
}
