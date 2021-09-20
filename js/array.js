/*var obj = {name:'yuan',age:80};
var ary = [12,23,34];
console.log(ary);*/

/*Array.prototype.aa = 100;
//=>for循环操作
for (var i = 0; i < ary.length; i++) {
    console.log(ary[i]);
}
//=>for in 循环操作
for (var key in obj) {
    //key:属性名（数组中的属性名是索引）
    console.log(obj[key]);
}*/
//for循环只能遍历到数组私有的一些属性
//for in 循环可以把一些自定义的公共属性遍历到
var ary = [12, 6, 25, 18, 49, 21, 80, 46, 90];

//=>ARY.LEMGTH-1：最后一项的后面没有内容了，我们不需要再比较
//=>在for循环中进行j++;去重
/*for (var i = 0; i < ary.length - 1; i++) {
    var cur = ary[i];//=>当前遍历的这一项（索引i）
    //=>把拿出的这一项和后面的每一项进行比较
    //->i+1：把当前项和它后面项比较，当前项索引是i，后一项索引是i+1
    for (var j = i + 1; j < ary.length; j++) {
        //ary[j]：作比较的那一项
        if(cur === ary[j]){
            //=>本次作比较的这一项和当前项相同，我们需要在原有数组中
            // 把作比较的这一项删除掉（作比较这一项的索引是j）
            ary.splice(j,1);
            j--;
        }
    }
}*/
//=>在for循环中不进行j++;去重
/*for (var i = 0; i < ary.length - 1; i++) {
    var cur = ary[i];
    for (var j = i + 1; j < ary.length;) {
        /!*if(cur === ary[j]){
            ary.splice(j,1);
        }else{
            j++;
            //=>数组塌陷问题：我们使用splice删除数组中的某一项后，
            // 删除这一项后面的每一项索引都要向前进一位（在原有索引上-1）
            //此时如果我们j++，循环操作的值累加了，我们通过最新j获取的元素
            // 不是紧挨删除这一项的元素，而是跳过一项获取的元素
            //=>先让j--，然后j++，相当于没加没减，此时j还是原有索引，
            // 再获取的时候就是删除这一项后面紧挨着的这一项
        }*!/
        cur === ary[j] ? ary.splice(j,1):j++;
    }
}*/

//indexOf方法去重
/*for (var i = 0; i < ary.length; i++) {
    var cur = ary[i];//=>当前项
    var curNextAry = ary.slice(i + 1);//=>把当前项后面的那些值以一个新数组返回，
    // 我们需要比较的就是后面的这些项对应的新数组
    if( curNextAry.indexOf(cur) > -1){
        //=>后面项组成的数组中包含当前这一项（当前这一项是重复的），
        // 我们把当前这一项删除掉即可
        ary.splice(i,1);
        i--;
    }
}*/

//使用对象去重
//var obj = {};
//{1:1}
//{1:1,2:2}
// =>每一次存储之前验证一下当前对象中该属性是否存在，
// 如果存在我们则不再存储并且把当前这个重复项删除掉即可:
//如果不存在我们就存储即可
/*for (var i = 0; i < ary.length; i++) {
    var cur = ary[i];
    if(typeof obj[cur] !== 'undefined'){
        //=>对象中已经存在该属性：证明当前项是数组中的重复项
        ary.splice(i,1);
        i--;
        continue;
    }
    obj[cur] = cur;//> obj[1]=1 {}:
}*/
//使用对象去重
/*for (var i = 0; i < ary.length; i++) {
    var cur = ary[i];
    if(typeof obj[cur] !== 'undefined'){
       // ary.splice(i,1);//=>使用splice会导致后面的索引向前进一位，
        // 如果后面偶很多项，消耗的性能很大
        //=>思路：我们把最后一项拿过来替换当前要删除的这一项
        //然后再把最后一项删除
        ary[i] = ary[ary.length-1];
        ary.length--;//ary.splice(ary.length-1,1);
        i--;
        continue;
    }
    obj[cur] = cur;
}*/

//Array内置原型方法去重
/*
Array.prototype.myUnique = function myUnique(){
  var obj = {};
    for (var i = 0; i < this.length; i++) {
        var item = this[i];
      if(typeof obj[item] !== 'undefined')  {
          this[i] = this[this.length - 1];
          this.length--;
          i--;
          continue;
      }
          obj[item] = item;
    }
    obj = null;
    return this;
};
//console.log(ary);
console.log(ary.myUnique().sort(function(a,b){
    return a-b;//=>a-b 由小到大 b-a 由大到小
}));*/

//相邻比较法去重：首先给数组进行排序，然后相邻两项比较，相同的话把后一项在数组中去掉
/*function compared(ary){
    ary.sort(function(a,b){
        return a-b;
    });
    for (var i = 0; i < ary.length; i++) {
        if(ary[i] === ary[i+1]){
            ary.splice(i+1,1);
            i--;
        }
    }
    return ary;
}

console.log(compared(ary));*/

//排序
/// /var ary = [12,13,23,14,16,11];
//=>冒泡排序
//原理：让数组中的当前项和后一项进行比较，如果当前项大于后一项，我们让两者交换位置（小->大）
/*
* 第一轮比较
* 12 13 [12,13,23,14,16,11]
* 13 23 [12,13,23,14,16,11]
* 23 14 [12,13,14,23,16,11]
* 23,16 [12,13,14,16,23,11]
* 23,11 [12,13,14,16,11,23]
* 第二轮
* 12 23 [12,13,14,16,11,23]
* 13 14 [12,13,14,16,11,23]
* 14 16 [12,13,14,16,11,23]
* ...
* 每一轮从前到后两两比较，虽然不一定实现最后的排序结果，但是可以把当前最大的放在末尾
* 具体比较的轮数：ary.length-1 数组有多长，我们只需要把总长度-1个数分别放在末尾，即可
* 实现最后的排序
* 第一轮比较5次：一共6个，不需要和自己比较
* 第二轮比较4次：一共6个，不用喝自己比，也不用和第一轮放在末尾的那个最大值比较
* 第三轮比较3次
* ...
* 每一轮比较ary.length-1（不用和自己比）-当前已经执行的轮数（执行一轮向末尾放
* 一个最大值，这些值不需要再比较）
* a = 12
* b = 13
* a和b交换值
* c = a;
* a = b;
* b = c;
*
* a = a + b; 25
* b = a - b; 12
* a = a - b; 13
*/
/*
* bubble:实现冒泡排序
* @paeameter
*   ary:[array]需要实现排序的数组
* @return
*   ary:[array]排序后的数组（升序）
*  by team on 2017/12/17
*/
/*function bubble(ary){
    //->外层循环控制的是比较的轮数
    for (var i = 0; i < ary.length - 1; i++) {
        //里层循环控制每一轮比较的次数
        var flag = true;//进行优化
        for (var j = 0; j < ary.length - 1- i; j++) {
           // ary[j]：当前本次拿出来这一项
            //ary[j+1]：当前项的后一项
            if(ary[j] > ary[j + 1]){
                //->当前这一项比后一项还要大，我们让两者交换位置
                var temp = ary[j];
                ary[j] = ary[j + 1];
                ary[j+1] = temp;
                /!*var a = ary[i] + ary[i+1];
                var b = ary[i] - ary[i+1];
                ary[i] =  (a - b)/2;
                ary[i + 1] = (a + b)/2; *!/
                flag = false;
            }
        }
        if(flag){
        break;
        }
    }
    return ary;
}
//为了实现由大到小可以使用ary.reverse()或者ary[j]<ary[j+1]
console.log(bubble(ary));*/

//=>递归
//函数自己调用自己

/*function fn(num){
    console.log(num);
    if(num === 0){
        return;
    }
    fn(num - 1);
}
fn(10);*/
//=>面试题：1~100之间，把所有能被3并且能被5整除的获取到，然后累加求和
/*var total = null;
for (var i = 0; i <= 100; i++) {
    if( i % 3 === 0 && i % 5 === 0){
        //console.log(i);
        total += i;
    }
}
console.log(total);*/

//=>方案二：递归
/*function fn(num) {
    if(num > 100) {
        return 0;//函数return 后面有内容，那么函数值就是return后面的内容，
        //如果有return ，后面没有跟内容，那么函数默认返回值是undefined;
        //如果没有return ,也是Undefined;
    }
    if( num % 3 !== 0){
        return num + fn(num + 1);
        }
    return fn(num + 1);
}
console.log(fn(1));*/

//=>需求：1~10以内的所有偶数乘积
/*function fn(num){
    if(num > 6){
        return 1;
    }
    if(num % 2 == 0){
        return num * fn(num + 1);
    }
    return fn(num + 1);
}

console.log(fn(1));*/

//=>快速排序
//=>先找中间这一项14
//=>把剩余项中间的每一个值和中间项进行比较，比他小的放在左边（新数组），比他大的放在右边（新数组）

/*
function quick(ary){
    //->如果传递进来的数组只有一项或者是空的，我们则不再继续取中间项进行拆分
    if(ary.length <= 1){
        return ary;
    }
    //->获取中间项的索引：把中间项的值获取到，在原有数组中删除中间项
    var centerIndex = Math.floor(ary.length/2),
        centerValue = ary.splice(centerIndex,1)[0];//->splice返回的是一个数组，数组中包含了删除的内容
    //->用剩余数组中的每一项和中间项进行比较，比中间项大的放在右边，比他小的放在左边（左右两边都是新数组）
    var aryLeft = [],
        aryRight = [];
    for(var i = 0; i < ary.length; i++){
        var cur = ary[i];
        cur < centerValue ? aryLeft.push(cur) : aryRight.push(cur);
    }
    return quick(aryLeft).concat(centerValue,quick(aryRight));
}
console.log(quick(ary));
*/

//=>插入排序
//在桌面上新抓一张牌A，我们用A和我们手里已经抓的牌进行比较（个人习惯从右向左比），
// 如果A比手里当前要比较的这张牌小，则继续向左比较...一直遇到比手里当前要比较的这张牌大，
//我们把A放在当前手里这张牌的后面如果新抓的牌A比手里所有牌都要小，我们把它放在最前面即可

function insert (array) {
  //->先抓一张牌（一般都抓第一张）
  var handAry = [];//->存储的是手里已经抓取的牌
  handAry.push(array[0]);
  //->依次循环抓取后面的牌
  for (var i = 1; i < array.length; i++) {
    var item = array[i];//->本次新抓的这张牌
    //->拿新抓的牌和手里现有的牌比较
    //->从大到小
    /*for (var j = handAry.length - 1; j >= 0; j--) {
        //handAry[j]:当前比较的手里的这张牌
        //->新抓的牌比当前比较的这张牌大了，
        // 我们把新抓的牌放在它的后面就可以了
        if(item > handAry[j]){
            handAry.splice(j + 1,0,item);
            break;
        }
        if(j === 0){
            //->新抓的牌是最小的，我们把新抓的牌放在最开始的位置
            handAry.unshift(item);
        }
    }*/
    //从小到大
    for (var j = 0; j < handAry.length;) {
      if (item < handAry[j]) {
        handAry.splice(j, 0, item);
        break;
      } else {
        j++;
        if (j === handAry.length) {
          handAry.push(item);
          break;
        }
      }
    }
  }
  return handAry;
}

console.log(insert(ary));

// 提取改成编号形如
// ["1-1", "1-2", "2-1", "2-2", "2-3", "3-1", "3-2", "3-3"]
// 设置编号
const setViolationNo = function (data, idList) {
  /**
   * data: [{
   * id: 12,
   * ....
   * }, {
   * id: 12,
   * ....
   * }, {
   * id: 23
   * ....
   * }]
   * idList: [12, 13]
   * 最后
   * data: [{
   * id: 12,
   * newNo: 1-1
   * ....
   * }, {
   * id: 12,
   * newNo: 1-2
   * ....
   * }, {
   * id: 13
   * newNo: 2-1
   * ....
   * }]
   */
  let secNo = 1
  let cuId = ''
  data.forEach(item => {
    const firstNo = idList.findIndex(id => id === item.id)
    if (firstNo === -1) return
    if (cuId !== item.id) {
      cuId = item.id
      secNo = 1
      item.newNo = `${firstNo + 1}-${secNo}`
      return
    }
    secNo++
    item.newNo = `${firstNo + 1}-${secNo}`
  })
}
// 扁平化数组
const flatten = arr => arr.reduce((item, next) => item.concat(Array.isArray(next) ? flatten(next) : next, []))