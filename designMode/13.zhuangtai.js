// 状态模式：允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类
// OffLightState:
var OffLightState = function (light) {
  this.light = light;
};
OffLightState.prototype.buttonWasPressed = function () {
  console.log('弱光'); // offLightState 对应的行为
  this.light.setState(this.light.weakLightState);
};
// WeakLightState:
var WeakLightState = function (light) {
  this.light = light;
};
WeakLightState.prototype.buttonWasPressed = function () {
  console.log('强光'); // weakLightState 对应的行为
  this.light.setState(this.light.strongLightState);
};
// StrongLightState:
var StrongLightState = function (light) {
  this.light = light;
};
StrongLightState.prototype.buttonWasPressed = function () {
  console.log('关灯'); // strongLightState 对应的行为
  this.light.setState(this.light.offLightState); // 切换状态到 offLightState
};
var Light = function () {
  this.offLightState = new OffLightState(this);
  this.weakLightState = new WeakLightState(this);
  this.strongLightState = new StrongLightState(this);
  this.button = null;
};


Light.prototype.init = function () {
  var button = document.createElement('button'),
    self = this;
  this.button = document.body.appendChild(button);
  this.button.innerHTML = '开关';
  this.currState = this.offLightState;
  this.button.onclick = function () {
    self.currState.buttonWasPressed();
  }
};
// 设置当前状态