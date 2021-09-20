class Queue {
  constructor() {
    this.size = 0
    this.array = new Array()
  }
  getSize() {
    return this.size
  }
  isEmpty() {
    return this.size === 0
  }
  enqueue(element) {
    this.array.push(element)
    this.size++
  }
  dequeue() {
    if (!this.size) return
    this.size--
    return this.array.shift()
  }
  getFront() {
    if (!this.size) return
    return this.array[0]
  }
  toString() {
    let res = 'Queue:['
    for (let i = 0; i < this.size; i++) {
      res += this.array[i]
      if (i !== this.size - 1) {
        res += ','
      }
    }
    res += ']:top'
    return res
  }
}
// const queue = new Queue()
// console.log(queue.toString())
// queue.enqueue(1)
// queue.enqueue(2)
// console.log(queue.dequeue())
// console.log(queue.toString())

const size = 100000
const queue = new Queue(size)
const startTime = new Date().getTime()
for (let i = 0; i < size; i++) {
  queue.enqueue(i)
}
for (let i = 0; i < size; i++) {
  queue.dequeue(i)
}
const endTime = new Date().getTime()
console.log((endTime - startTime) / 1000)
