// 迭代器模式：提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示
var each = function (ary, callback) {
  for (var i = 0, l = ary.length; i < l; i++) {
    // callback 的执行结果返回 false，提前终止迭代
    if (callback(i, ary[i]) === false) {
      return
      // break
    }
  }
};
each([1, 2, 3, 4, 5], function (i, n) {
  if (n > 3) {
    return false;
  }
  console.log(n);
});
