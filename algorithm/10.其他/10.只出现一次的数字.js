/*
给你一个整数数组 nums ，除某个元素仅出现 一次 外，其余每个元素都恰出现 三次 。请你找出并返回那个只出现了一次的元素。

你必须设计并实现线性时间复杂度的算法且使用常数级空间来解决此问题。



示例 1：

输入：nums = [2,2,3,2]
输出：3
示例 2：

输入：nums = [0,1,0,1,0,1,99]
输出：99
*/
/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function (nums) {
  let map = new Map()
  nums.forEach((item) => {
    if (!map.has(item)) {
      map.set(item, 1)
    } else {
      map.set(item, 3)
    }
  })
  let result = ''
  for (const [key, value] of map) {
    if (value === 1) {
      result = key
      break;
    }
  }
  return result
};