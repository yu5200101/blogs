/*
给你一个下标从 0 开始的二维整数数组 flowers ，其中 flowers[i] = [starti, endi] 表示第 i 朵花的 花期 从 starti 到 endi （都 包含）。同时给你一个下标从 0 开始大小为 n 的整数数组 people ，people[i] 是第 i 个人来看花的时间。

请你返回一个大小为 n 的整数数组 answer ，其中 answer[i]是第 i 个人到达时在花期内花的 数目 。
*/
var fullBloomFlowers = function(flowers, people) {
  const starts = flowers.map((item) => item[0]);
  const ends = flowers.map((item) => item[1]);
  starts.sort((a, b) => a - b);
  ends.sort((a, b) => a - b);

  var binarySearch = function(arr, target) {
      let res = arr.length;
      let left = 0, right = arr.length - 1;
      while (left <= right) {
          let mid = (left + right) >> 1;
          if (arr[mid] >= target) {
              res = mid;
              right = mid - 1;
          } else {
              left = mid + 1;
          }
      }
      return res;
  }
  const m = people.length;
  const ans = new Array(m).fill(0);
  for (let i = 0; i < m; i++) {
      const p = people[i];
      ans[i] = binarySearch(starts, p + 1) - binarySearch(ends, p);
  }
  return ans;
};