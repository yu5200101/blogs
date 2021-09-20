class LoopQueue {
  constructor(capacity) {
    this.front = 0
    this.tail = 0
    this.size = 0
    this.data = new Array(capacity + 1)
  }
  getCapacity() {
    return this.data.length - 1
  }
  isEmpty() {
    return this.front === this.tail
  }
  getSize() {
    return this.size
  }
  enqueue(element) {
    if ((this.tail + 1) % this.data.length === this.front) {
      this.resize(this.getCapacity() * 2)
    }
    this.data[this.tail] = element
    this.tail = (this.tail + 1) % this.data.length
    this.size++
  }
  getFront() {
    if (this.isEmpty()) {
      throw Error('not')
    }
    return this.data[this.front]
  }
  dequeue() {
    if (this.isEmpty()) {
      throw Error('not')
    }
    let ret = this.data[this.front]
    this.data[this.front] = null
    this.front = (this.front + 1) % this.data.length
    this.size--
    if (this.size <= this.data.length / 2) {
      this.resize(Math.floor(this.data.length / 2))
    }
    return ret
  }
  resize(capacity) {
    let newData = new Array(capacity + 1)
    for (let i = 0; i < this.size; i++) {
      newData[i] = this.data[(i + this.front) % this.data.length]
    }
    this.data = newData
    this.front = 0
    this.tail = this.size
  }
  toString() {
    let res = 'loop Queue front :['
    for (let i = this.front; i !== this.tail; i = (i + 1) % this.data.length) {
      res += this.data[i]
      if ((i + 1) % this.data.length !== this.tail) {
        res += ','
      }
    }
    res += ']:tail '
    return res + 'size:' + this.size + ' ' + 'capacity:' + this.getCapacity()
  }
}

// const size = 100000
// const loopQueue = new LoopQueue(size)
// const startTime = new Date().getTime()
// for (let i = 0; i < size; i++) {
//   loopQueue.enqueue(i)
// }
// for (let i = 0; i < size; i++) {
//   loopQueue.dequeue(i)
// }
// const endTime = new Date().getTime()
// console.log((endTime - startTime) / 1000)


const loopQueue = new LoopQueue(5)
for(let i = 0; i < 10; i++) {
  loopQueue.enqueue(i)
  console.log('en', loopQueue.toString())
  if (i % 3 === 2) {
    loopQueue.dequeue(i)
    console.log('de1', loopQueue.toString())
  }
}
for (let i = 0; i < 10; i++) {
  loopQueue.dequeue(i)
  console.log('de2', loopQueue.toString())
}