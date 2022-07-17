/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function (nums1, nums2) {
  const m = nums1.length
  const n = nums2.length
  let i = 0
  let j = 0
  let index = 0
  let ary = []
  while (i < m && j < n) {
    if (nums1[i] < nums2[j]) {
      ary[index++] = nums1[i]
      i++
    } else {
      ary[index++] = nums2[j]
      j++
    }
  }
  for (; i < m; i++) {
    ary[index++] = nums1[i]
  }
  for (; j < n; j++) {
    ary[index++] = nums2[j]
  }
  let mid = Math.floor((m + n) / 2)
  let isOu = (m + n) % 2 === 0
  let res = 0
  if (isOu) {
    res = (ary[mid - 1] + ary[mid]) / 2
  } else {
    res = ary[mid]
  }
  return res
};