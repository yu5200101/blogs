class ConcurrencyLimiter {
  constructor(maxCount) {
    this.maxCount = maxCount
    this.activeCount = 0
    this.queue = []
  }
  add(fn) {
    return new Promise((resolve, reject) => {
      const runFn = async() => {
        try {
          this.activeCount++
          const res = await fn()
          resolve(res)
        } catch (err) {
          reject(err)
        } finally {
          this.activeCount--
          this.next()
        }
      }
      if (this.activeCount < this.maxCount) {
        runFn()
      } else {
        this.queue.push(runFn)
      }
    })
  }
  next() {
    if (!this.queue.length) return
    while(this.activeCount < this.maxCount && this.queue.length) {
      const runFn = this.queue.shift()
      runFn()
    }
  }
}

const testFn = (id, timeout) => () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const value = `testFn:${id}, timeout:${timeout}`
      resolve(value)
    }, timeout);
  })
}
const concurrencyLimiter = new ConcurrencyLimiter(5)
for(let i = 0; i < 10; i++) {
  concurrencyLimiter.add(testFn(i, 1000)).then((res) => {
    console.log('then', res)
  }).catch(err => {
    console.log('err', err)
  })
}

const len = 6
const result = new Array(len).fill('')
// 顺序请求，顺序输出
for(let i = 0; i < len; i++) {
  testFn(i, (len - i) * 1000)().then(res => {
    result[i] = res
    const isFull = !result.some(item => !item)
    if (isFull) {
      console.log(result)
    }
  })
}