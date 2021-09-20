// 复制公用函数
function copyValue (val) {
  // 如果这里换为 input 则不支持换行
  const temp = document.createElement('textarea')
  temp.value = val
  document.body.appendChild(temp)
  temp.select() // 选择对象
  document.execCommand('Copy') // 执行浏览器复制命令
  temp.style.display = 'none'
  document.body.removeChild(temp)
  this.$message.success('复制成功')
}
