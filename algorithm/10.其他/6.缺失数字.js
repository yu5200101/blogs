/**
 * @param {number[]} nums
 * @return {number}
 */
 var missingNumber = function(nums) {
  let res = 0
  for (i = 0; i < nums.length; i++) {
      res ^= nums[i] ^ i
  }
  return res^nums.length
};