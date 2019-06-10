/*

* fn [function] 需要防抖的函数

* delay [number] 毫秒，防抖期限值

*/
// n秒内函数只会执行一次，如果n秒内高频事件再次被触发，则重新计算时间
// 防抖，只执行最后一次
function debounce (fn, delay) {
  let timer = null
  //借助闭包
  return function () {
    if (timer) {
      //进入该分支语句，说明当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
      clearTimeout(timer)
    }
    // 进入该分支说明当前并没有在计时，那么就开始一个计时
    timer = setTimeout(() => fn.apply(this, Array.prototype.slice.call(arguments, 0)), wait);
  }
}
function showTop () {
  var scrollTop = document.body.scrollTop || document.documentElement.scrollTop
  console.log('滚动条的位置' + scrollTop)
}
window.onscroll = debounce(showTop, 1000)

/* 
防抖的应用场景:

每次 resize/scroll 触发统计事件
文本输入的验证（连续输入文字后发送 AJAX 请求进行验证，验证一次就好）

*/
//将数组扁平化并去除其中重复数据，最终得到一个升序且不重复的数组
var arr = [1, [1, [5, 2]], [8, 2], 10];
Array.from(new Set(arr.flat(Infinity))).sort((a, b) => a - b)
Array.from(new Set(arr.toString().split(',').sort((a, b) => a - b).map(Number)))

/* 
这个时候，代码已经很是完善了，但是为了让这个函数更加完善，我们接下来思考一个新的需求。
这个需求就是：
我不希望非要等到事件停止触发后才执行，我希望立刻执行函数，然后等到停止触发 n 秒后，才可以重新触发执行。
想想这个需求也是很有道理的嘛，那我们加个 immediate 参数判断是否是立刻执行。 
*/
function debounce (func, wait, immediate) {
  var timeout, result;

  var debounced = function () {
    var context = this;
    var args = arguments;
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait);
      if (callNow) result = func.apply(context, args);
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
      }, wait);
    }
    return result;
  }
  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
  };
  return debounced;
}