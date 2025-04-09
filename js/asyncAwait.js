async function foo() {
  const result = await someAsyncTask();
  return result;
}
// 编译后
// async/await 本质上是基于 Generator 和 Promise 的语法糖
function foo() {
  return _asyncToGenerator(function* () {
    const result = yield someAsyncTask();
    return result;
  })();
}

function _asyncToGenerator(fn) {
  return function () {
    const gen = fn.apply(this, arguments);
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        try {
          const { value, done } = gen[key](arg);
          if (done) resolve(value);
          else Promise.resolve(value).then(step.bind(null, "next"), step.bind(null, "throw"));
        } catch (err) {
          reject(err);
        }
      }
      step("next");
    });
  };
}