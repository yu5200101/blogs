// 节流，每隔一段时间执行一次
// 在规定时间内只会执行一次，执行一次后，只有大于设定的执行周期后才会执行第二次。
/* function throttle (fn, wait) {
  var timer = null;

  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, Array.prototype.slice.call(arguments, 0));
        timer = null;
      }, wait);
    }
  }
} */
// 以下照旧
function showTop () {
  var scrollTop = document.body.scrollTop || document.documentElement.scrollTop
  console.log('滚动条的位置' + scrollTop)
}
// window.onscroll = throttle(showTop, 1000)
window.addEventListener('scroll', throttle(showTop, 1000), false)

/* 
函数节流的应用场景有:
DOM 元素的拖拽功能实现（mousemove）
射击游戏的 mousedown/keydown 事件（单位时间只能发射一颗子弹）
计算鼠标移动的距离（mousemove）
Canvas 模拟画板功能（mousemove）
搜索联想（keyup）
监听滚动事件判断是否到页面底部自动加载更多：给 scroll 加了 debounce 后，只有用户停止滚动后，才会判断是否到了页面底部；如果是 throttle 的话，只要页面滚动就会间隔一段时间判断一次
*/

//利用时间戳实现
/* function throttle(func, delay) {
  var lastTime = 0;
  function throttled() {
    var context = this;
    var args = arguments;
    var nowTime = Date.now();
    if(nowTime > lastTime + delay) {
      func.apply(context, args);
      lastTime = nowTime;
    }
  }
  return throttled;
} */

// 利用定时器实现
/* function throttle (func, delay) {
  var timeout = null;
  function throttled () {
    var context = this;
    var args = arguments;
    if(!timeout) {
      timeout = setTimeout(()=> {
        func.apply(context, args);
        clearTimeout(timeout);
        timeout = null;
      }, delay)
    }
  }
  return throttled;
} */
// 第一种事件会立刻执行，第二种事件会在 n 秒后第一次执行
// 第一种事件停止触发后没有办法再执行事件，第二种事件停止触发后依然会再执行一次事件
// 时间戳和定时器的方式都没有考虑最后一次执行的问题，比如有个按钮点击事件，设置的间隔时间是1s，在第0.5，1.8，2.2s点击，那么只有0.5s和1.8s的两次点击能够触发函数执行，而最后一次的2.2s会被忽略。
// 组合实现，允许设置第一次或者最后一次是否触发函数执行
// leading: false 表示禁用第一次执行
// trailing: false 表示禁用停止触发的回调
// 不能同时设置为false
function throttle (func, wait = 100, options) {
  var timeout, context, args, result;
  var previous = 0;
  if(!options) options = {};
  var later = function () {
    previous = options.leading === false ? 0 : new Date().getTime();
    timeout = null;
    result = func.apply(context, args);
    if(!timeout) context = args = null;
  }
  var throttled = function () {
    var now = Date.now() || new Date().getTime();
    if (!previous && options.leading === false) previous = now;  
    //下次触发 func 剩余的时间
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    // 如果没有剩余的时间了或者你改了系统时间
    // 第一次执行 中间执行
    if(remaining <= 0 || remaining > wait) {
      if(timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if(!timeout) context = args = null;
    } else if(!timeout && options.trailing !== false) {
      // 判断是否设置了定时器和trailing 最后一次执行
      timeout = setTimeout(later, remaining);
    }
    return result;
  }
  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  }
  return throttled;
}
/* 我们要注意 underscore 的实现中有这样一个问题：

那就是 leading：false 和 trailing: false 不能同时设置。

如果同时设置的话，比如当你将鼠标移出的时候，因为 trailing 设置为 false，停止触发的时候不会设置定时器，所以只要再过了设置的时间，再移入的话，就会立刻执行，就违反了 leading: false，bug 就出来了，所以，这个 throttle 只有三种用法： */

/* container.onmousemove = throttle(getUserAction, 1000);
container.onmousemove = throttle(getUserAction, 1000, {
  leading: false
});
container.onmousemove = throttle(getUserAction, 1000, {
  trailing: false
}); */

