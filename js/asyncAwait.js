function testFn(param) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(param)
    }, 100);
  })
}

async function fn1() {
  const result1 = await testFn('fn11')
  console.log(result1)
  const result2 = await testFn('fn12')
  console.log(result2)
}
// fn1()

function fn2() {
  const main = asyncToGenerator(function *() {
    const result1 = yield testFn('fn21')
    console.log(result1)
    const result2 = yield testFn('fn22')
    console.log(result2)
  })
  main()
}
fn2()
function asyncToGenerator(fn) {
  return function() {
    const gen = fn.apply(this, arguments)
    return new Promise((resolve, reject) => {
      function step(key, arg) {
        try {
          const {value, done} = gen[key](arg)
          if (done) {
            resolve(value)
            return
          }
          Promise.resolve(value).then((val) => {step('next', val)}, (err) => {step('throw', err)})
        } catch (err) {
          reject(err)
        }
      }
      step('next')
    })
  }
}