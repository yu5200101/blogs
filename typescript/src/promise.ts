function retryExecute<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2,
  delay: number = 1000
) {
  return new Promise((resolve, reject) => {
    const execute = (count: number) => {
      fn().then(resolve).catch(err => {
        if (count >= maxRetries) {
          reject(err)
          return
        }
        console.log(`重试:${count}`)
        const timeout = delay * Math.pow(2, count)
        setTimeout(() => {
          execute(count + 1)
        }, timeout);
      })
    }
    execute(0)
  })
}

const mockFn = (count: number) => {
  let calCount = 0
  return () => new Promise<string>((resolve, reject) => {
    calCount++
    console.log(`执行第 ${calCount} 次尝试`);
    if (calCount >= count) {
      resolve('success')
    } else {
      reject('error')
    }
  })
}
// retryExecute(mockFn(3), 4, 1000).then(res => {
//   console.log(res, 'res1')
// }).catch(err => {
//   console.log(err, 'err1')
// })

retryExecute(mockFn(5), 3, 1000).then(res => {
  console.log(res, 'res2')
}).catch(err => {
  console.log(err, 'err2')
})