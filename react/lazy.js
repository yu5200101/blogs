function lazy(load) {
  let status = 'pending'
  let result = null
  const promise = load().then((module) => {
    status = 'fulfilled'
    // 获取默认导出
    result = module.default
  }, (error) => {
    status = 'rejected'
    result = error
  })

  return function () {
    // Suspense 捕获
    if (status === 'pending') return promise
    // Error Boundary 捕获
    if (status === 'rejected') throw result
    // 渲染实际组件
    return <result />
  }
}