const os = require('os')
const {rss, heapUsed, heapTotal} = process.memoryUsage()
const sysFree = os.freemem()
const sysTotal = os.totalmem()

const systemMemory = {
  // 系统内存占用率
  sys: 1 - sysFree / sysTotal,
  // Node堆内存占用率
  heap: heapUsed / heapTotal,
  // Node占用系统内存的比率
  node: rss / sysTotal
}

console.log(systemMemory)