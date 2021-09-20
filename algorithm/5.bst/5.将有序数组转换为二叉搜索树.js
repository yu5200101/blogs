/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[]} nums
 * @return {TreeNode}
 */
const helper = (nums, start, end) => {
  if (start > end) return null
  let mid = Math.floor(start + (end - start) / 2)
  let root = new TreeNode(nums[mid])
  root.left = helper(nums, start, mid - 1)
  root.right = helper(nums, mid + 1, end)
  return root
}
var sortedArrayToBST = function (nums) {
  if (!nums.length) return null
  return helper(nums, 0, nums.length - 1)
};