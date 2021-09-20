/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersect = function (nums1, nums2) {
  if (!nums1.length || !nums2.length) return []
  let ary = []
  nums1.sort((a, b) => a - b)
  nums2.sort((a, b) => a - b)
  let i = 0
  let j = 0
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] < nums2[j]) {
      i++
    }
    if (nums2[j] < nums1[i]) {
      j++
    }
    if (nums1[i] === nums2[j]) {
      ary.push(nums1[i])
      i++
      j++
    }
  }
  return ary
};