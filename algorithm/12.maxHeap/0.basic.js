// 完全二叉树：把元素顺序排列成树的形状，排不满也可
// 满二叉树：同一层级要么都有叶子节点，要么都没有叶子节点
// 二叉堆最大堆：堆中某个节点的值总是不大于其父节点的值
// 二叉堆最小堆：堆中某个节点的值总是不小于其父节点的值

// 最大堆
class MaxHeap {
  constructor(capacity = 0) {
    this.data = new Array(capacity)
    this.size = capacity
  }
  getSize() {
    return this.size
  }
  isEmpty() {
    return this.size === 0
  }
  getParentIndex(index) {
    if (index === 0) {
      return new Error('not exist')
    }
    return (index - 1) / 2
  }
  getLeftIndex(index) {
    return index * 2 + 1
  }
  getRightIndex(index) {
    return index * 2 + 2
  }
  add(e) {
    this.data.push(e)
    this.size++
    this.siftUp(this.size - 1)
  }
  removeLast() {
    this.data.pop()
    this.size--
  }
  swap(i, j) {
    if (i < 0 || i >= this.size || j < 0 || j >= this.size) {
      new Error('max size')
    }
    const temp = this.data[i]
    this.data[i] = this.data[j]
    this.data[j] = temp
  }
  siftUp(index) {
    while (index > 0 && this.data[index] > this.data[this.getParentIndex(index)]) {
      this.swap(index, this.getParentIndex(index))
      index = this.getParentIndex(index)
    }
  }
  findMax() {
    if (this.size === 0) {
      return new Error('not exist')
    }
    return this.data[0]
  }
  // 取出堆中的最大元素
  extractMax() {
    let max = this.findMax()
    this.swap(0, this.size - 1)
    this.removeLast()
    this.siftDown(0)
    return max
  }
  siftDown(index) {
    while (this.getLeftIndex(index) < this.size) {
      let l = this.getLeftIndex(index)
      if (l + 1 < this.size && this.data[l + 1] > this.data[l]) {
        l = this.getRightIndex(index)
        // this.data[l] 是leftChild 和 rightChild中的最大值
      }
      if (this.data[index] >= this.data[l]) break;
      this.swap(index, l)
      index = l
    }
  }
  replace(e) {
    let ret = this.findMax()
    this.data[0] = e
    this.siftDown(0)
    return ret
  }
  heapify(ary) {
    this.data = ary
    for (let i = this.getParentIndex(this.data.length - 1); i >= 0; i--) {
      this.siftDown(i)
    }
  }
}

const n = 10
const maxHeap = new MaxHeap()
const ary = new Array()
for (let i = 0; i < n; i++) {
  ary.push(Math.round(Math.random() * n))
}
maxHeap.heapify(maxHeap)
console.log(maxHeap)
// const ary = new Array(n)
// for (let i = 0; i < n; i++) {
//   ary[i] = maxHeap.extractMax()
// }
// for (let i = 1; i < n; i++) {
//   if (ary[i - 1] < ary[i]) {
//     console.log('error')
//   }
// }

class PriorityQueue {
  constructor() {
    this.maxHeap = new MaxHeap()
  }
  getSize() {
    return this.maxHeap.getSize()
  }
  isEmpty() {
    return this.maxHeap.isEmpty()
  }
  getFront() {
    return this.maxHeap.findMax()
  }
  enqueue(e) {
    this.maxHeap.add(e)
  }
  dequeue() {
    return this.maxHeap.extractMax()
  }
}