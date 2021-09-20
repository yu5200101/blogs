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
var levelOrder = function (root) {
  if (!root) return []
  let queue = []
  let res = []
  queue.push(root)
  while (queue.length) {
    let curList = []
    let len = queue.length
    for (let i = 0; i < len; i++) {
      let curNode = queue.shift()
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