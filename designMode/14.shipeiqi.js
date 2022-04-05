// 适配器模式：用来解决两个已有接口之间不匹配的问题，不考虑这些接口是怎样实现的，也不考虑它们将来可能会如何演化，不需要改变已有的接口，就能够使他们协同

var guangdongCity = {
  shenzhen: 11,
  guangzhou: 12,
  zhuhai: 13
};
var getGuangdongCity = function () {
  var guangdongCity = [
    {
      name: 'shenzhen', id: 11,
    }, {
      name: 'guangzhou', id: 12,
    }
  ];
  return guangdongCity
};
var render = function (fn) {
  console.log('开始渲染广东省地图');
  console.log(JSON.stringify(fn()));
}
var addressAdapter = function (oldAddressFn) {
  var address = {},
    oldAddress = oldAddressFn();
  for (var i = 0, c; c = oldAddress[i++];) {
    address[c.name] = c.id;
  }
  return function () {
    return address;
  }
};
render(addressAdapter(getGuangdongCity))

