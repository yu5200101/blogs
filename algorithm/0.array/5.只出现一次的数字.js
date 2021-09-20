/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function (nums) {
  let single = 0
  for (i = 0; i < nums.length; i++) {
    single ^= nums[i]
  }
  return single

};