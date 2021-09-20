class Node {
  constructor(e) {
    this.e = e
    this.left = null
    this.right = null
  }
}
class Stack {
  constructor() {
    this.size = 0
    this.array = new Array()
  }
  getLength() {
    return this.size
  }

  isEmpty() {
    return this.size === 0
  }
  push(element) {
    this.array[this.size++] = element
  }
  pop() {
    if (!this.size) return
    this.size--
    return this.array[this.size]
  }
  peek() {
    if (!this.size) return
    return this.array[this.size - 1]
  }
  toString() {
    let res = 'Stack:['
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

class Bst {
  constructor() {
    this.root = null
    this.size = 0
  }
  isEmpty() {
    return this.size === 0
  }
  add1(element) {
    if (!this.root) {
      this.root = new Node(element)
      this.size++
    } else {
      addByNode(this.root, element)
    }
  }
  addByNode1(node, element) {
    if (node.e === element) return
    if (element < node.e && !node.left) {
      node.left = new Node(element)
      this.size++
      return
    }
    if (element > node.e && !node.right) {
      node.right = new Node(element)
      this.size++
      return
    }
    if (element < node.e) {
      this.addByNode1(node.left, element)
      return
    }
    this.addByNode1(node.right, element)
  }
  add(element) {
    this.root = this.addByNode(this.root, element)
  }
  addByNode(node, element) {
    if (!node) {
      this.size++
      return new Node(element)
    }
    if (element < node.e) {
      node.left = this.addByNode(node.left, element)
    }
    if (element > node.e) {
      node.right = this.addByNode(node.right, element)
    }
    return node
  }
  contains(element) {
    return this.containsByNode(this.root, element)
  }
  containsByNode(node, element) {
    if (!node) return null
    if (element === node.e) {
      return true
    }
    if (element < node.e) {
      return this.containsByNode(node.left, element)
    }
    return this.containsByNode(node.right, element)
  }
  preOrder() {
    this.preOrderByNode(this.root)
  }
  preOrderByNode(node) {
    if (!node) return
    console.log(node.e)
    this.preOrderByNode(node.left)
    this.preOrderByNode(node.right)
  }
  preOrderNR() {
    let stack = new Stack()
    stack.push(this.root)
    while(!stack.isEmpty()) {
      let curNode = stack.pop()
      console.log(curNode.e)
      if (curNode.right) {
        stack.push(curNode.right)
      }
      if (curNode.left) {
        stack.push(curNode.left)
      }
    }
  }
  inOrder() {
    this.inOrderByNode(this.root)
  }
  inOrderByNode(node) {
    if (!node) return
    this.inOrderByNode(node.left)
    console.log(node.e)
    this.inOrderByNode(node.right)
  }
  afterOrder() {
    this.afterOrderByNode(this.root)
  }
  afterOrderByNode(node) {
    if (!node) return
    this.afterOrderByNode(node.left)
    this.afterOrderByNode(node.right)
    console.log(node.e)
  }
  toString() {
    let res = ''
    this.generateBSTString(this.root, 0, res)
    return res
  }
  generateBSTString(node, depth, res) {
    if (!node) {
      res += this.generateDepthString(depth) + 'null' + '\n'
      return
    }
    res += this.generateDepthString(depth) + node.e + '\n'
    this.generateBSTString(node.left, depth + 1, res)
    this.generateBSTString(node.right, depth + 1, res)
  }
  generateDepthString(depth) {
    let res = ''
    for(let i = 0; i < depth; i++) {
      res += '--'
    }
    return res
  }
  // 层序遍历
  leverOrder() {
    let queue = new Queue()
    queue.enqueue(this.root)
    while(!queue.isEmpty()) {
      let curNode = queue.dequeue()
      console.log(curNode.e)
      if (curNode.left) {
        queue.enqueue(curNode.left)
      }
      if (curNode.right) {
        queue.enqueue(curNode.right)
      }
    }
  }
  minimum() {
    if (!this.size) {
      throw new Error('error')
    }
    return this.minimumByNode(this.root).e
  }
  minimumByNode(node) {
    if (!node.left) {
      return node
    }
    return this.minimumByNode(node.left)
  }
  maximum() {
    if (!this.size) {
      throw new Error('error')
    }
    return this.maximumByNode(this.root).e
  }
  maximumByNode(node) {
    if (!node.right) {
      return node
    }
    return this.maximumByNode(node.right)
  }
  removeMin() {
    let ret = this.minimum()
    this.root = this.removeMinByNode(this.root)
    return ret
  }
  removeMinByNode(node) {
    if (!node.left) {
      let temp = node.right
      node.right = null
      this.size--
      return temp
    }
    node.left = this.removeMinByNode(node.left)
    return node
  }
  removeMax() {
    let ret = this.maximum()
    this.root = this.removeMaxByNode(this.root)
    return ret
  }
  removeMaxByNode(node) {
    if (!node.right) {
      let temp = node.left
      node.left = null
      this.size--
      return temp
    }
    node.right = this.removeMaxByNode(node.right)
    return node
  }
  remove(e) {
    this.root = this.removeByNode(this.root, e)
  }
  removeByNode(node, e) {
    if (!node) {
      return null
    }
    if (e < node.e) {
      this.removeByNode(node.left, e)
      return node
    }
    if (e > node.e) {
      this.removeByNode(node.right, e)
      return node
    }
    // 左子树为空
    if (!node.left) {
      let temp = node.right
      node.right = null
      this.size--
      return temp
    }
    // 右子树为空
    if (!node.right) {
      let temp = node.left
      node.left = null
      this.size--
      return temp
    }
    let successor = this.minimumByNode(node.right)
    successor.right = this.removeMinByNode(node.right)
    successor.left = node.left
    node.left = node.right = null
    return successor
  }
}
// let ary = [5, 3, 6, 8, 4, 2]
// let bst = new Bst()
// for (let value of ary) {
//   bst.add(value)
// }
// bst.preOrder()
// console.log('-----')
// bst.preOrderNR()
// // bst.inOrder()
// console.log('-----')
// // bst.afterOrder()
// bst.leverOrder()

let bst = new Bst()
const n = 1000
for(let i = 0; i < n; i++) {
  bst.add(Math.round(Math.random() * 9 + 1))
}
// let ary1= new Array()
// while(!bst.isEmpty()) {
//   ary1.push(bst.removeMin())
// }
// console.log(ary1)
let ary2 = new Array()
while(!bst.isEmpty()) {
  ary2.push(bst.removeMax())
}
console.log(ary2)