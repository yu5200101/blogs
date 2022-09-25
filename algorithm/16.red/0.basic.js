/*
1.每个节点或者是红色的，或者是黑色的
2.根节点是黑色的
3.每一个叶子节点（最后的空节点）是黑色的
4.如果一个节点是红色的，那么他的孩子节点都是黑色的
5.从任意一个节点到叶子节点，经过的黑色节点数是一样的

红黑树保持“黑平衡”的二叉树 黑色节点数的高度差保持不超过1
最大高度2logn 时间复杂度：O(logn)
// 增删改性能佳
*/
const RED = 'red'
const BLACK = 'black'
class Node {
  constructor(key, value) {
    this.key = key
    this.value = value
    this.left = null
    this.right = null
    this.color = RED
  }
}
class RBTree {
  constructor() {
    this.root = null
    this.size = 0
  }
  // 对节点y进行向左旋转操作，返回旋转后新的根节点x
  //    y                             x
  //  /  \                          /   \
  // T1   x      向左旋转 (y)       y     z
  //     / \   - - - - - - - ->   / \   / \
  //   T2  z                     T1 T2 T3 T4
  //      / \
  //     T3 T4
  leftRotate(node) {
    let x = node.right
    node.right = x.left
    x.left = node

    x.color = node.color
    node.color = RED
    return x
  }
  // 颜色翻转
  flipColors(node) {
    node.color = RED
    node.left.color = BLACK
    node.right.color = BLACK
  }
  // 对节点y进行向右旋转操作，返回旋转后新的根节点x
  //        y                              x
  //       / \                           /   \
  //      x   T4     向右旋转 (y)        z     y
  //     / \       - - - - - - - ->    / \   / \
  //    z   T3                       T1  T2 T3 T4
  //   / \
  // T1   T2
  rightRotate(node) {
    let x = node.left
    node.left = x.right
    x.right = node
    x.color = node.color
    node.color = RED
    return x
  }
  add(key, value) {
    this.root = this.addByNode(root, key, value)
    this.root.color = BLACK
  }
  addByNode(node, key, value) {
    if (!node) {
      this.size++
      return new Node(key, value)
    }
    if (key < node.key) {
      node.left = this.addByNode(node.left, key, value)
    } else if (key > node.key) {
      node.right = this.addByNode(node.right, key, value)
    } else {
      node.value = value
    }
    if (this.isRed(node.right) && !this.isRed(node.left)) {
      node = this.leftRotate(node)
    }
    if (this.isRed(node.left) && this.isRed(node.left.left)) {
      node = this.rightRotate(node)
    }
    if (this.isRed(node.left) && this.isRed(node.right)) {
      this.flipColors(node)
    }
    return node
  }
  isRed(node) {
    return node.color === RED
  }
}