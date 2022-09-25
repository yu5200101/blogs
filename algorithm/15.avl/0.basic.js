// 平衡二叉树
// 任意一个节点左子树和右子树的层级数相差不超过1
// 查询性能佳
class Node {
  constructor(key, value) {
    this.key = key
    this.value = value
    this.left = null
    this.right = null
    this.height = 1
  }
}

class AVLTree {
  constructor() {
    this.root = null
    this.size = 0
  }
  getSize() {
    return this.size
  }
  getHeight(node) {
    if (!node) return 0
    return node.height
  }
  getBalanceFactor(node) {
    if (!node) return 0
    return this.getHeight(node.left) - this.getHeight(node.right)
  }
  isEmpty() {
    return this.size === 0
  }
  add(key, value) {
    this.root = this.addByNode(this.root, key, value)
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
    return this.setBalance(node)
  }
  setBalance(node) {
    // 更新height
    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right))
    const balanceFactor = this.getBalanceFactor(node)
    if (Math.abs(balanceFactor) > 1) {
      console.log('not balance', balanceFactor)
    }
    // 平衡维护
    // LL
    if (balanceFactor > 1 && this.getBalanceFactor(node.left) >= 0) {
      return this.rightRotate(node)
    }
    // RR
    if (balanceFactor < -1 && this.getBalanceFactor(node.right) <= 0) {
      return this.leftRotate(node)
    }
    // LR
    if (balanceFactor > 1 && this.getBalanceFactor(node.left) < 0) {
      node.left = this.leftRotate(node.left)
      return this.rightRotate(node)
    }
    // RL
    if (balanceFactor < -1 && this.getBalanceFactor(node.right) > 0) {
      node.right = this.rightRotate(node.right)
      return this.leftRotate(node)
    }
    return node
  }
  contains(key) {
    return !!this.getNode(this.root, key)
  }
  getNode(node, key) {
    if (!node) return null
    if (key === node.key) {
      return node
    }
    if (key < node.key) {
      return this.getNode(node.left, key)
    }
    return this.getNode(node.right, key)
  }
  isBst() {
    const keys = new Array()
    this.inOrder(this.root, keys)
    for (let i = 1; i < keys.length; i++) {
      if (keys[i - 1] > keys[i]) {
        return false
      }
    }
    return true
  }
  inOrder(node, keys) {
    if (!node) return
    this.inOrder(node.left, keys)
    keys.push(node.key)
    this.inOrder(node.right, keys)
  }
  isBalanced() {
    return this.isBalancedByNode(this.root)
  }
  isBalancedByNode(node) {
    if (!node) return true
    let balanceFactor = Math.abs(this.getBalanceFactor(node))
    if (balanceFactor > 1) return false
    return this.isBalancedByNode(node.left) && this.isBalancedByNode(node.right)
  }
  // 对节点y进行向右旋转操作，返回旋转后新的根节点x
  //        y                              x
  //       / \                           /   \
  //      x   T4     向右旋转 (y)        z     y
  //     / \       - - - - - - - ->    / \   / \
  //    z   T3                       T1  T2 T3 T4
  //   / \
  // T1   T2
  rightRotate(y) {
    let x = y.left
    let T3 = x.right
    x.right = y
    y.left = T3
    // 更新height
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1
    return x
  }
  // 对节点y进行向左旋转操作，返回旋转后新的根节点x
  //    y                             x
  //  /  \                          /   \
  // T1   x      向左旋转 (y)       y     z
  //     / \   - - - - - - - ->   / \   / \
  //   T2  z                     T1 T2 T3 T4
  //      / \
  //     T3 T4
  leftRotate(y) {
    let x = y.right
    let T2 = x.left
    x.left = y
    y.right = T2
    // 更新height
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1
    return x
  }
  remove(key) {
    let node = this.getNode(this.root, key)
    if (!node) {
      this.root = this.removeByNode(this.root, key)
      return node.value
    }
    return null
  }
  removeByNode(node, key) {
    if (!node) {
      return null
    }
    let retNode = null
    if (key < node.key) {
      node.left = this.removeByNode(node.left, key)
      retNode = node
    } else if (key > node.key) {
      node.right = this.removeByNode(node.right, key)
      retNode = node
    } else {
      // 左子树为空
      if (!node.left) {
        let temp = node.right
        node.right = null
        this.size--
        retNode = temp
      } else if (!node.right) {
        // 右子树为空
        let temp = node.left
        node.left = null
        this.size--
        retNode = temp
      } else {
        let successor = this.minimumByNode(node.right)
        successor.right = this.removeByNode(node.right, successor.key)
        successor.left = node.left
        node.left = node.right = null
        retNode = successor
      }
    }
    if (!retNode) return retNode
    return this.setBalance(retNode)
  }
  minimumByNode(node) {
    if (!node.left) {
      return node
    }
    return this.minimumByNode(node.left)
  }
}
