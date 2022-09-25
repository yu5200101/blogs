class SegmentTree {
  constructor(ary) {
    this.data = []
    for (let i = 0; i < ary.length; i++) {
      this.data[i] = ary[i]
    }
    this.tree = new Array(4 * this.data.length)
    this.buildSegmentTree(0, 0, this.data.length - 1)
  }
  getIndex(index) {
    if (index < 0 || index >= this.data.length) {
      return new Error('not exit')
    }
    return this.data[index]
  }
  getSize() {
    return this.data.length
  }
  leftChild(index) {
    return  2 * index + 1
  }
  rightChild(index) {
    return 2 * index + 2
  }
  // 在treeIndex的位置创建表示区间[l...r]的线段树
  buildSegmentTree(treeIndex, l, r) {
    if (l === r) {
      this.tree[treeIndex] = this.data[l]
      return
    }
    let leftChildIndex = this.leftChild(treeIndex)
    let rightChildIndex = this.rightChild(treeIndex)
    let mid = l + (r - l) / 2
    this.buildSegmentTree(leftChildIndex, l, mid)
    this.buildSegmentTree(rightChildIndex, mid + 1, r)
    this.tree[treeIndex] = this.tree[leftChildIndex] + this.tree[rightChildIndex]
  }
  toString() {
    let res = '['
    for(let i = 0; i < this.tree.length; i++) {
      if (this.tree[i] !== null) {
        res += this.tree[i]
      } else {
        res += 'null'
      }
    }
    return res
  }
  query(l, r) {
    if (l < 0 || l >= this.data.length || r < 0 || r >= this.data.length || l < r) {
      return new Error('error')
    }
    return queryIndex(0, 0, this.data.length - 1, l, r)
  }
  queryIndex(treeIndex, l, r, queryL, queryR) {
    if (l === queryL && r === queryR) {
      return this.tree[treeIndex]
    }
    let mid = l + (r - l) / 2
    let leftChildIndex = this.leftChild(treeIndex)
    let rightChildIndex = this.rightChild(treeIndex)
    if (queryL >= mid + 1) {
      return this.queryIndex(rightChildIndex, mid + 1, r, queryL, queryR)
    } else if (queryR <= mid) {
      return this.queryIndex(leftChildIndex, l, mid, queryL, queryR)
    }
    let leftResult = this.queryIndex(leftChildIndex, l, mid, queryL, mid)
    let rightResult = this.queryIndex(rightChildIndex, mid + 1, r, mid + 1, queryR)
    return leftResult + rightResult
  }
  set(index, e) {
    if (index < 0 || index >= this.data.length) {
      return new Error('error')
    }
    this.setIndex(0, 0, this.data.length - 1, index, e)
  }
  setIndex(treeIndex, l, r, index, e) {
    if (l === r) {
      this.tree[treeIndex] = e
      return
    }
    let mid = l + (r - l) / 2
    let leftChildIndex = this.leftChild(treeIndex)
    let rightChildIndex = this.rightChild(treeIndex)
    if (index >= mid + 1) {
      this.setIndex(rightChildIndex, mid + 1, r, index, e)
    } else {
      this.setIndex(leftChildIndex, l, mid, index, e)
    }
    this.tree[treeIndex] = this.tree[leftChildIndex] + this.tree[rightChildIndex]
  }
}
const ary = [1, 2, 3, 4]
const seg1 = new SegmentTree(ary)
console.log(seg1.toString())
console.log(seq.query(0, 2))