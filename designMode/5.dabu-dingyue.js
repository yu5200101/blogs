// 发布订阅模式：一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知
var event = {
  clientList: [],
  listen: function (key, fn) {
    if (!this.clientList[key]) {
      this.clientList[key] = [];
    }
    this.clientList[key].push(fn)
  },
  trigger: function (key) {
    // 订阅的消息添加进缓存列表 var key = Array.prototype.shift.call( arguments ), // (1);
    fns = this.clientList[key];
    if (!fns || fns.length === 0) { // 如果没有绑定对应的消息 return false;
    }
    for (var i = 0, fn; fn = fns[i++];) {
      fn.apply(this, arguments); // (2) // arguments 是 trigger 时带上的参数
    }
  }
};

var installEvent = function (obj) {
  for (var i in event) {
    obj[i] = event[i];
  }
};

var salesOffices = {};
installEvent(salesOffices);
salesOffices.listen('squareMeter88', function (price) {
  console.log('价格= ' + price);
});
salesOffices.listen('squareMeter100', function (price) {
  console.log('价格= ' + price);
  // 小明订阅消息
  // 小红订阅消息
});
salesOffices.trigger('squareMeter88', 2000000); // 输出:2000000
salesOffices.trigger('squareMeter100', 3000000); // 输出:3000000
