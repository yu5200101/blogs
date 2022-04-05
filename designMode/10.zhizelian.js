// 职责链模式：降低发起请求的对象和处理请求的对象之间的耦合性。职 责链中的节点数量和顺序是可以自由变化的，我们可以在运行时决定链中包含哪些节点
var order500 = function (orderType, pay, stock) {
  if (orderType === 1 && pay === true) {
    console.log('500 元定金预购，得到 100 优惠券');
  } else {
    return 'nextSuccessor';
  }
};

var order200 = function (orderType, pay, stock) {
  if (orderType === 2 && pay === true) {
    console.log('200 元定金预购，得到 50 优惠券');
  } else {
    return 'nextSuccessor'; // 我不知道下一个节点是谁，反正把请求往后面传递 }
  };
}
var orderNormal = function (orderType, pay, stock) {
  if (stock > 0) {
    console.log('普通购买，无优惠券');
  } else {
    console.log('手机库存不足');
  }
};
var Chain = function (fn) {
  this.fn = fn;
  this.successor = null;
};
Chain.prototype.setNextSuccessor = function (successor) {
  return this.successor = successor;
};
Chain.prototype.passRequest = function () {
  var ret = this.fn.apply(this, arguments);
  if (ret === 'nextSuccessor') {
    return this.successor && this.successor.passRequest.apply(this.successor, arguments);
  }
  var chainOrder500 = new Chain(order500);
  var chainOrder200 = new Chain(order200);
  var chainOrderNormal = new Chain(orderNormal);
  chainOrder500.setNextSuccessor(chainOrder200); chainOrder200.setNextSuccessor(chainOrderNormal)
  chainOrder500.passRequest(1, true, 500);
  chainOrder500.passRequest(2, true, 500);
  chainOrder500.passRequest(3, true, 500)
  chainOrder500.passRequest(1, false, 0);
}
Function.prototype.after = function (fn) {
  var self = this;
  return function () {
    var ret = self.apply(this, arguments);
    if (ret === 'nextSuccessor') {
      return fn.apply(this, arguments);
    }
    return ret;
  }
};
var order = order500.after(order200).after(orderNormal);

order(1, true, 500);
order(2, true, 500);
order(1, false, 500);
// 输出:500 元定金预购，得到 100 优惠券 // 输出:200 元定金预购，得到 50 优惠券 // 输出:普通购买，无优惠券