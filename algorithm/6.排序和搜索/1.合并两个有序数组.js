/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function (nums1, m, nums2, n) {
  let i = 0
  let j = 0
  let index = 0
  let res = []
  while (i < m && j < n) {
    if (nums1[i] <= nums2[j]) {
      res[index++] = nums1[i++]
    } else {
      res[index++] = nums2[j++]
    }
  }
  for (; i < m;) {
    res[index++] = nums1[i++]
  }
  for (; j < n;) {
    res[index++] = nums2[j++]
  }
  for (let k = 0; k < m + n; k++) {
    nums1[k] = res[k]
  }
};