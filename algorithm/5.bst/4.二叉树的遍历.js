/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */

// 先序遍历
function preOrderTraversalIterative(root) {
  const result = [];
  if (!root) return result;
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    result.push(node.val);
    // 右子节点先入栈，左子节点后入栈，保证弹出顺序为根-左-右
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return result;
}

// 中序遍历
function inOrderTraversalIterative(root) {
  const result = [];
  const stack = [];
  let curr = root;
  while (curr || stack.length) {
    // 将左子节点全部入栈
    while (curr) {
      stack.push(curr);
      curr = curr.left;
    }
    curr = stack.pop();
    result.push(curr.val); // 访问节点
    curr = curr.right;    // 转向右子树
  }
  return result;
}
// 后序遍历
function postOrderTraversalIterative(root) {
  const result = [];
  if (!root) return result;
  const stack = [root];
  while (stack.length) {
      const node = stack.pop();
      result.push(node.val);
      // 左子节点先入栈，右子节点后入栈，弹出顺序为根-右-左
      if (node.left) stack.push(node.left);
      if (node.right) stack.push(node.right);
  }
  return result.reverse(); // 反转后变为左-右-根
}
// 层序遍历
var levelOrder = function (root) {
  if (!root) return []
  const queue = []
  const res = []
  queue.push(root)
  while(queue.length) {
    const curList = []
    const len = queue.length
    for (let i = 0; i < len; i++) {
      const curNode = queue.shift()
      curList.push(curNode.val)
      if (curNode.left) {
        queue.push(curNode.left)
      }
      if (curNode.right) {
        queue.push(curNode.right)
      }
    }
    res.push(curList)
  }
  return res
};