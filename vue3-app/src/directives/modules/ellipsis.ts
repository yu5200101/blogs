export default (app:any) => {
  app.directive('ellipsis', {
    mounted(el:any) {
      el.style.textOverflow = 'ellipsis'
      el.style.overflow = 'hidden'
      el.style.whiteSpace = 'nowrap'
    }
  })
}
