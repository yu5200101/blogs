// 归并排序
// 时间复杂度：始终为 O(n log n)，适用于大规模数据。

// 空间复杂度：O(n)，需要额外空间存储临时数组。

// 分治法的典型应用
// 归并排序的基本思想是将一个大数组分解成多个小数组，直到每个小数组只有一个元素，这时候这些小数组自然是有序的。然后再将这些有序的小数组合并成一个大的有序数组。这过程应该是递归进行的。

// 代码说明：
// 归并排序主函数 (mergeSort):

// 终止条件：当数组长度 ≤ 1 时直接返回（已有序）。

// 分割数组：计算中间位置 mid，将数组拆分为左右两部分。

// 递归排序：对左右子数组递归调用 mergeSort，最终合并排序后的子数组。

// 合并函数 (merge):

// 双指针遍历：使用指针 i 和 j 分别遍历左右数组，选择较小的元素加入结果数组。

// 处理剩余元素：将未遍历完的子数组的剩余元素直接追加到结果数组末尾。
function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  // 添加左数组剩余元素
  while (i < left.length) {
    result.push(left[i]);
    i++;
  }

  // 添加右数组剩余元素
  while (j < right.length) {
    result.push(right[j]);
    j++;
  }

  return result;
}

// 示例使用
var ary = [12, 6, 25, 18, 49, 21, 80, 46, 90];
//  [6, 12, 18, 21, 25, 46, 49, 80, 90]
console.log(mergeSort(ary));