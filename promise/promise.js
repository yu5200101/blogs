
/* 
1.new promise 时，需要传递一个executor执行器，执行器立刻执行
2.executor接受两个参数，分别是resolve和reject
3.promise只能从pending到rejected,或者从pending到fulfilled
4.promise的状态一旦确认，就不会再改变
5.promise都有then方法，then接收两个参数，分别是promise成功的回调onFulfilled,和promise失败的回调onRejected
6.如果调用then时，promise已经成功，则执行onFulfilled,并将promise的值作为参数传递进去。
  如果promise已经失败，那么执行onRejected，并将promise失败的原因作为参数传递进去。
  如果promise的状态是pending，需要将onFulfilled和onRejected函数存放起来，等待状态确定后，再依次执行对应的函数执行（发布订阅）
7.then的参数onFulfilled和onRejected可以缺省
8.promise可以then多次，promise的then方法返回一个promise
9.如果then返回的是一个结果，那么就会把这个结果作为参数，传递给下一个then的成功回调（onFulfilled）
10.如果then中抛出了一个异常，那么就会把这个异常作为参数，传递给下一个then的失败的回调(onRejected)
11.如果then返回的是一个promise，那么需要等这个promise执行完，promise如果成功就走下一个then的成功，如果失败，就走下一个then的失败
*/

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
function Promise (executor) {
  let self = this;
  self.status = PENDING;
  self.onFulfilled = []; // 成功的回调
  self.onRejected = []; // 失败的回调
  //promiseA+ 2.1
  function resolve (value) {
    if (self.status === PENDING) {
      self.status = FULFILLED;
      self.value = value;
      self.onFulfilled.forEach(fn => fn());//PromiseA+2.2.6.1
    }
  }
  function reject (value) {
    if (self.status === PENDING) {
      self.status = REJECTED;
      self.value = value;
      self.onRejected.forEach(fn => fn()); //PromiseA+2.2.6.2
    }
  }
  try {
    executor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}
Promise.prototype.then = function (onFulfilled, onRejected) {
  //PromiseA+2.2.1/PromiseA+2.2.5/PromiseA+2.2.7.3/PromiseA+2.2.7.4
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
  onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };
  let self = this;
  //PromiseA+2.2.7
  let promise2 = new Promise((resolve, reject) => {
    if (self.status === FULFILLED) {
      //PromiseA+2.2.2
      //PromiseA+2.2.4 -- setTimeout
      try {
        //PromiseA+2.2.7.1
        let x = onFulfilled(self.value);
        resolvePromise(promise2, x, resolve, reject);
      } catch (e) {
        // PromiseA+ 2.2.7.2
        reject(e);
      }
    } else if (self.status === REJECTED) {
      //PromiseA+ 2.2.3
      setTimeout(() => {
        try {
          let x = onRejected(self.reason);
          resolvePromise(promise2, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      })
    } else if (self.status === PENDING) {
      self.onFulfilled.push(() => {
        setTimeout(() => {
          try {
            let x = onFulfilled(self.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        })
      });
      self.onRejected.push(() => {
        setTimeout(() => {
          try {
            let x = onRejected(self.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        })
      })
    }
  });
  return promise2;
}
function resolvePromise (promise2, x, resolve, reject) {
  let self = this;
  //PromiseA+ 2.3.1
  if (promise2 === x) {
    reject(new TypeError('chaining cycle'));
  }
  if (x && typeof x === 'object' || typeof x === 'function') {
    let used; // PromiseA+ 2.3.3.3.3 只能调用一次
    try {
      let then = x.then;
      if (typeof then === 'function') {
        //PromiseA+ /2.3.3
        then.call(x, (y) => {
          //PromiseA+ 2.3.3.1
          if (used) return;
          used = true;
          resolvePromise(promise2, y, resolve, reject);
        }, (r) => {
          //PromiseA+2.3.3.4
          if (used) return;
          used = true;
          reject(r);
        });
      } else {
        //PromiseA+ 2.3.3.4
        if (used) return;
        used = true;
        resolve(x);
      }
    } catch (e) {
      //PromiseA+ 2.3.3.2
      if (used) return;
      used = true;
      reject(e);
    }
  } else {
    //PromiseA+ 2.3.3.4
    resolve(x);
  }
}
/* 
有专门的测试脚本可以测试所编写的代码是否符合PromiseA+的规范。
首先，在promise实现的代码中，增加以下代码
 */
Promise.defer = Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}
/* 
安装测试脚本 
npm install -g promises-aplus-tests
那么在对应的目录执行以下命令:
promises-aplus-tests promise.js 
*/
/* 
1.onFulfilled和onRejected的调用需要放在serTimeout，因为规范中表示onFulfilled or onRejected must not be called until the execution context stack contains only platform code, 使用setTimeout只是模拟异步，原生Promise并非是这样实现的。
2.在resolvePromise的函数中，为何需要used这个flag，同样是因为规范中表示：if both resolvePromise and rejectPromise are called, or multiple calls to same argument are made, the first call takes precedence, and ant further calls are ignored. 因此我们需要这样的flag 来确保只会执行一次。
3.self.onFulfilled 和 self.onRejected中存储了成功的回调和失败的回调，根据规范2.6显示，当promise从pending态改变的时候，需要按照顺序去指定then对应的回调。
 */

/* 
Promise.resolve(value)返回一个以给定值解析后的Promise对象。
1.如果value是个thenable对象，返回的promise会‘跟随’这个thenable的对象，采用它的最终状态
2.如果传入的value本身就是promise对象，那么Promise.resolve将不做任何修改。原封不动地返回这个promise对象。
3.其他情况，直接返回该值为成功状态的Promie对象
 */
Promise.resolve = function (param) {
  if (param instanceof Promise) {
    return param;
  }
  return new Promise((resolve, reject) => {
    if (param && param.then && typeof param.then === 'function') {
      setTimeout(() => {
        param.then(resolve, reject);
      })
    } else {
      resolve(param);
    }
  })
}


/* 
Promise.reject方法和Promise.resolve不同，Promise.reject()方法的参数，会原封不动地作为reject的理由，变成后续方法的参数
 */
Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  })
}
/* Promise.prototype.catch用于指定出错时的回调，是特殊的then方法，catch之后，可以继续.then */
Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
}
/* Promise.prototype.finally 不管成功还是失败，都会走到finally中，并且finally之后，还可以继续then。并且会将值原封不动的传递给后面的then */
Promise.prototype.finally = function (callback) {
  return this.then((value) => {
    return new Promise.resolve(callback()).then(() => {
      return value;
    })
  }, (err) => {
    return new Promise.resolve(callback()).then(() => {
      throw err;
    })
  })
}
/* 
Promies.all(promises) 返回一个promise对象
1.如果传入的参数是一个空的可迭代对象，那么此promise对象回调完成(resolve),只有此情况，是同步执行的，其他都是异步返回的
2.如果传入的参数不包含任何promise，则返回一个异步完成。
3.promises中所有的promise都‘完成’时或者参数中不包含promise时回调完成。
4.如果参数中有一个promise失败，那么promise.all返回的promise对象失败。
5.在任何情况下，Promise.all返回的promise完成状态的结果都是一个数组。
 */
Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    let index = 0;
    let result = [];
    if (promises.length === 0) {
      resolve(result);
    } else {
      function processValue (i, data) {
        result[i] = data;
        if (++index === promises.length) {
          resolve(result);
        }
      }
      for (let i = 0; i < promises.length; i++) {
        //promise[i] 可能是普通值
        Promise.resolve(promises[i]).then((data) => {
          processValue(i, data);
        }, (err) => {
          reject(err);
          return;
        })
      }
    }
  })
}

/* 
Promise.race函数返回一个Promise，它将与第一个传递的promise以相同的完成方式被完成。它可以是成功(resolve)，也可以是失败（reject）,这要取决于第一个完成的方式是两个中的哪个
如果传的参数数组是空，则返回的promise将永远等待
如果迭代包含一个或多个非promise值/已成功/已失败的promise，则Promise.race将解析为迭代中找到的第一个值。
 */
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    if (promises.length === 0) {
      return;
    } else {
      for (let i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i]).then((data) => {
          resolve(data);
          return;
        }, (err) => {
          reject(err);
          return;
        });
      }
    }
  });
}
module.exports = Promise;
