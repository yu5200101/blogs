// 模板方法模式:只需使用继承就可以实现的非常简单的模式
// 模板方法模式由两部分结构组成，第一部分是抽象父类，第二部分是具体的实现子类。通常 在抽象父类中封装了子类的算法框架，包括实现一些公共方法以及封装子类中所有方法的执行顺 序。子类通过继承这个抽象类，也继承了整个算法结构，并且可以选择重写父类的方法。


var Beverage = function () { };
Beverage.prototype.boilWater = function () {
  console.log('把水煮沸');
};
Beverage.prototype.brew = function () {
  throw new Error('子类必须重写 brew 方法');
};
Beverage.prototype.pourInCup = function () {
  throw new Error('子类必须重写 pourInCup 方法');
};
Beverage.prototype.addCondiments = function () {
  throw new Error('子类必须重写 addCondiments 方法');
};
Beverage.prototype.customerWantsCondiments = function () {
  return true; // 默认需要调料
};
Beverage.prototype.init = function () {
  this.boilWater();
  this.brew();
  this.pourInCup();
  if (this.customerWantsCondiments()) {
    this.addCondiments();
  }
};

var Coffee = function () { };
Coffee.prototype = new Beverage();
Coffee.prototype.brew = function () {
  console.log('用沸水冲泡咖啡');
};
Coffee.prototype.pourInCup = function () {
  console.log('把咖啡倒进杯子');
}
Coffee.prototype.addCondiments = function () {
  console.log('加糖和牛奶');
};
Coffee.prototype.customerWantsCondiments = function () {
  return console.log('请问需要调料吗?');
};
var Coffee = new Coffee();
Coffee.init();

var Tea = function () { };
Tea.prototype = new Beverage();
Tea.prototype.brew = function () {
  console.log('用沸水浸泡茶叶');
};
Tea.prototype.pourInCup = function () {
  console.log('把茶倒进杯子');
}
Tea.prototype.addCondiments = function () {
  console.log('加柠檬');
};
var Tea = new Tea();
Tea.init();
