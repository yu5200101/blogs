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

const ary = [[1,2], [2,3,[2,3]]]

const result = []
const flatArray = (ary) => {
  if (!Array.isArray(ary)) {
    result.push(ary)
    return
  }
  for(let i = 0; i < ary.length; i++) {
    flatArray(ary[i])
  }
}
flatArray(ary)
console.log(result)