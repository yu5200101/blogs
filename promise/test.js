const Promise = require('./promise.js');

/* 
thenable 对象的执行加 setTimeout 的原因是最终的结果根据原生Promise对象执行的结果推断，如下的测试代码，原生的执行结果为20 400 30; 为了同样的执行顺序，增加了setTimeout延时。
 */
// Promise.resolve 测试代码 
/* let p = Promise.resolve(20);
p.then((data) => {
    console.log(data);
});

let p2 = Promise.resolve({
    then: function(resolve, reject) {
        resolve(30);
    }
});

p2.then((data)=> {
    console.log(data)
});

let p3 = Promise.resolve(new Promise((resolve, reject) => {
    resolve(400)
}));
p3.then((data) => {
    console.log(data)
});
 */

// Promise.all 测试代码
/* var promise1 = new Promise((resolve, reject) => {
    resolve(3);
})
var promise2 = 42;
var promise3 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then(function(values) {
  console.log(values); //[3, 42, 'foo']
},(err)=>{
    console.log(err)
});

var p = Promise.all([]); // will be immediately resolved
var p2 = Promise.all([1337, "hi"]); // non-promise values will be ignored, but the evaluation will be done asynchronously
console.log(p);
console.log(p2)
setTimeout(function(){
    console.log('the stack is now empty');
    console.log(p2);
}); */
// Promise.race 测试代码

Promise.race([
    new Promise((resolve, reject) => { setTimeout(() => { resolve(100) }, 100) }),
    new Promise((resolve, reject) => { setTimeout(() => { reject(100) }, 1000) })
]).then((data) => {
    console.log('success1', data);
}, (err) => {
    console.log('err1', err);
});

Promise.race([
    new Promise((resolve, reject) => { setTimeout(() => { resolve(100) }, 1000) }),
    new Promise((resolve, reject) => { setTimeout(() => { resolve(200) }, 100) }),
    new Promise((resolve, reject) => { setTimeout(() => { reject(100) }, 200) })
]).then((data) => {
    console.log('success2', data);
}, (err) => {
    console.log('err2', err);
});