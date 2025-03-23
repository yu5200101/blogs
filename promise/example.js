const p1 = new Promise((resolve, reject) => {
  resolve('hello')
})
.then(result => {
  console.log('p1-result', result)
  return result
})
.catch(e => {
  console.log('p1-error', e);
  return e
})
const p2 = new Promise((resolve, reject) => {
  throw new Error('报错啦')
})
.then(result => {
  console.log('p2-result', result)
  return result
})
// 有catch方法会触发Promise.all的then方法
// 无catch方法会触发Promise.all的catch方法
.catch(e => {
  console.log('p2-error', e);
  return e
})

Promise.all([p1, p2])
.then(result => {
  console.log('all-then', result)
})
.catch(e => {
  console.log('all-error', e)
})
