// 并查集 设置元素的id
class unionFind1 {
  constructor(size) {
    this.id = new Array(size)
    for (let i = 0; i < this.id.length; i++) {
      this.id[i] = i
    }
  }
  getSize() {
    return this.id.length
  }
  // 查找p元素对应的元素编号
  find(p) {
    if (p < 0 && p >= this.id.length) {
      new Error('error')
    }
    return this.id[p]
  }
  // 查看元素p 和元素q 是否所属一个集合
  isConnected(p, q) {
    return this.find(p) === this.find(q)
  }
  unionElements(p, q) {
    let pId = this.find(p)
    let qId = this.find(q)

    if (pId === qId) return
    for (let i = 0; i < this.id.length; i++) {
      if (this.id[i] === pId) {
        this.id[i] = qId
      }
    }
  }
}

class unionFind2 {
  constructor(size) {
    this.parent = new Array(size)
    for (let i = 0; i < size; i++) {
      this.parent[i] = i
    }
  }
  getSize() {
    return this.parent.length
  }
  find(p) {
    if (p < 0 || p >= this.parent.length) {
      new Error('error')
    }
    while(p !== this.parent[p]) {
      p = this.parent[p]
    }
    return p
  }
  isConnected(p, q) {
    return this.find(p) === this.find(q)
  }
  unionElements(p, q) {
    let pRoot = this.find(p)
    let qRoot = this.find(q)
    if (pRoot === qRoot) return
    this.parent[pRoot] = qRoot
  }
}

class unionFind3 {
  constructor(size) {
    this.parent = new Array(size)
    // this.size[i] 表示以i为根的集合中元素个数
    this.size = new Array(size)
    for (let i = 0; i < size; i++) {
      this.parent[i] = i
      this.size[i] = 1
    }
  }
  getSize() {
    return this.parent.length
  }
  find(p) {
    if (p < 0 || p >= this.parent.length) {
      new Error('error')
    }
    while (p !== this.parent[p]) {
      p = this.parent[p]
    }
    return p
  }
  isConnected(p, q) {
    return this.find(p) === this.find(q)
  }
  unionElements(p, q) {
    let pRoot = this.find(p)
    let qRoot = this.find(q)
    if (pRoot === qRoot) return
    // 设置size少的根节点
    if (this.size[pRoot] < this.size[qRoot]) {
      this.parent[pRoot] = qRoot
      this.size[qRoot] += this.size[pRoot]
    } else {
      this.parent[qRoot] = pRoot
      this.size[pRoot] += this.size[qRoot]
    }
  }
}

class unionFind4 {
  constructor(size) {
    this.parent = new Array(size)
    // this.rank[i] 表示以i为根的集合所表示的树的层级
    this.rank = new Array(size)
    for (let i = 0; i < size; i++) {
      this.parent[i] = i
      this.rank[i] = 1
    }
  }
  getSize() {
    return this.parent.length
  }
  find(p) {
    if (p < 0 || p >= this.parent.length) {
      new Error('error')
    }
    while (p !== this.parent[p]) {
      p = this.parent[p]
    }
    return p
  }
  isConnected(p, q) {
    return this.find(p) === this.find(q)
  }
  unionElements(p, q) {
    let pRoot = this.find(p)
    let qRoot = this.find(q)
    if (pRoot === qRoot) return
    // 根据两个元素所在树的rank不同判断合并方向
    // 将rank低的集合合并到rank高的级别上
    if (this.rank[pRoot] < this.rank[qRoot]) {
      this.parent[pRoot] = qRoot
    } else if (this.rank[qRoot] < this.rank[pRoot]){
      this.parent[qRoot] = pRoot
    } else {
      // this.rank[qRoot] === this.rank[pRoot]
      this.parent[qRoot] = pRoot
      this.rank[pRoot] += 1
    }
  }
}

// 路径压缩
class unionFind5 {
  constructor(size) {
    this.parent = new Array(size)
    // this.rank[i] 表示以i为根的集合所表示的树的层级
    this.rank = new Array(size)
    for (let i = 0; i < size; i++) {
      this.parent[i] = i
      this.rank[i] = 1
    }
  }
  getSize() {
    return this.parent.length
  }
  find(p) {
    if (p < 0 || p >= this.parent.length) {
      new Error('error')
    }
    while (p !== this.parent[p]) {
      this.parent[p] = this.parent[this.parent[p]]
      p = this.parent[p]
    }
    return p
  }
  isConnected(p, q) {
    return this.find(p) === this.find(q)
  }
  unionElements(p, q) {
    let pRoot = this.find(p)
    let qRoot = this.find(q)
    if (pRoot === qRoot) return
    // 根据两个元素所在树的rank不同判断合并方向
    // 将rank低的集合合并到rank高的级别上
    if (this.rank[pRoot] < this.rank[qRoot]) {
      this.parent[pRoot] = qRoot
    } else if (this.rank[qRoot] < this.rank[pRoot]) {
      this.parent[qRoot] = pRoot
    } else {
      // this.rank[qRoot] === this.rank[pRoot]
      this.parent[qRoot] = pRoot
      this.rank[pRoot] += 1
    }
  }
}

// 路径压缩2
class unionFind6 {
  constructor(size) {
    this.parent = new Array(size)
    // this.rank[i] 表示以i为根的集合所表示的树的层级
    this.rank = new Array(size)
    for (let i = 0; i < size; i++) {
      this.parent[i] = i
      this.rank[i] = 1
    }
  }
  getSize() {
    return this.parent.length
  }
  find(p) {
    if (p < 0 || p >= this.parent.length) {
      new Error('error')
    }
    if (p !== this.parent[p]) {
      this.parent[p] = this.find(this.parent[p])
    }
    return this.parent[p]
  }
  isConnected(p, q) {
    return this.find(p) === this.find(q)
  }
  unionElements(p, q) {
    let pRoot = this.find(p)
    let qRoot = this.find(q)
    if (pRoot === qRoot) return
    // 根据两个元素所在树的rank不同判断合并方向
    // 将rank低的集合合并到rank高的级别上
    if (this.rank[pRoot] < this.rank[qRoot]) {
      this.parent[pRoot] = qRoot
    } else if (this.rank[qRoot] < this.rank[pRoot]) {
      this.parent[qRoot] = pRoot
    } else {
      // this.rank[qRoot] === this.rank[pRoot]
      this.parent[qRoot] = pRoot
      this.rank[pRoot] += 1
    }
  }
}

const testFn = (union, m) => {
  let startTime = Date.now()
  for (let i = 0; i < m; i++) {
    let a = Math.round(Math.random() * m)
    let b = Math.round(Math.random() * m)
    union.unionElements(a, b)
  }
  for (let i = 0; i < m; i++) {
    let a = Math.round(Math.random() * m)
    let b = Math.round(Math.random() * m)
    union.isConnected(a, b)
  }
  let endTime = Date.now()
  return (endTime - startTime) / 1000000000
}
let size = 1000000
let m = 1000000
let union1 = new unionFind1(size)
// console.log(`1---${testFn(union1, m)}`)
// let union2 = new unionFind2(size)
// console.log(`2---${testFn(union2, m)}`)
let union3 = new unionFind3(size)
console.log(`3---${testFn(union3, m)}`)
let union4 = new unionFind4(size)
console.log(`4---${testFn(union4, m)}`)
let union5 = new unionFind5(size)
console.log(`5---${testFn(union5, m)}`)
let union6 = new unionFind6(size)
console.log(`6---${testFn(union6, m)}`)

