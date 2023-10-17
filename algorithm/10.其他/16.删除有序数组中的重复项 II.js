/*
给你一个有序数组 nums ，请你 原地 删除重复出现的元素，使得出现次数超过两次的元素只出现两次 ，返回删除后数组的新长度。

不要使用额外的数组空间，你必须在 原地 修改输入数组 并在使用 O(1) 额外空间的条件下完成。
*/
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
  let n = nums.length
  let map = new Map()
  let j = 0
  for (let i = 0; i < n; i++) {
      const count = map.get(nums[i]) || 0
      if (count <= 1) {
          nums[j++] = nums[i]
      }
      map.set(nums[i], count + 1)
  }
  return j
};