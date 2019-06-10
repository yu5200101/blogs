// 函数柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。
function curry (fn, args) {
	var length = fn.length;
  args = args || [];
  console.log(args);
	return function () {
		var _args = args.slice(0), arg, i;
		for (i = 0; i < arguments.length; i++) {
			arg = arguments[i];
      _args.push(arg);
      console.log(_args); 
		}
		if (_args.length < length) {
			return curry.call(this, fn, _args);
		} else {
			return fn.apply(this, _args);
		}
	}
}


//es6写法
function curry0 (fn, args) {
  var length = fn.length;
  args = args || [];
  return function () {
    var allArgs = [...args, ...arguments];
    if (allArgs.length < length) {
      return curry0.call(this, fn, allArgs);
    } else {
      return fn.apply(this, allArgs);
    }
  }
}

var fn = curry(function(a, b, c) {
	console.log(a, b, c);
})

fn(1)(2)(3)
//函数柯理化  其本质是降低通用性，提高适用性，其实是对闭包的极致应用
//原理：利用闭包保存一部分参数，返回一个包含了一部分参数的闭包。
//适用场景： ...

function connect (a, b, c, d, e, f, g) {
  console.log(`${a}-${b}-${c}-${d}-${e}-${f}-${g}`);
}

//在闭包中，A闭包 由 B函数生成
//使用闭包可以引用函数的变量对象这一性质
//把闭包中存的变量和闭包接受的实参组合起来，传入目标函数
//简易版
function simpleCurry (fn) {
  let args = [].slice.call(arguments, 1);
  return function () {
    fn.apply(this, args.concat([].slice.call(arguments)))
  }
}

//只可以分成两步，如果要可以分成任意层，就得用递归了
// simpleCurry(connect, 1, 2,5,67,8,4)(3);
// simpleCurry(connect, 1)(2, 3,4,5,6, 28);

//完整版，接受N层闭包，由于层数不定，递归也必须用到
//递归的过程中不断的 聚集参数，直到参数达到目标函数需要的个数，就执行函数
//如何知道函数接受的理想参数个数  fn.length
function curry1 (fn, args) {
  let length = fn.length; //目标函数理想的参数个数
  let allArgs = args || [];
  return function () {
    let _args = [].slice.apply(arguments);
    let _allArgs = allArgs.concat(_args)
    //未达到理想参数个数就继续聚集参数， 达到了参数的个数，就可以运行目标函数
    if (_allArgs.length < length) {
      //聚集参数的过程
      return curry1.call(this, fn, _allArgs)
    }
    else {
      fn.apply(this, _allArgs);
    }
  }
}

curry1(connect)(2, 3, 4, 5)(6, 1)(2);

//如果不想按顺序传入，则可以先用占位符，后面再填入数据
//比如
/**
 * 
let fn = curry(function(a, b, c) {
    console.log([a, b, c]);
});

fn("a", _, "c")("b") // ["a", "b", "c"]
 * 
 * 
 */
let _;
function curry2 (fn, args) {
  let allArgs = args || [];
  let length = fn.length;
  return function () {
    let _args = [].slice.call(arguments);
    let _allArgs = [].slice.call(allArgs);
    //在这里来调整参数的位置， 如果前面有占位符就向前补位

    if (_args.indexOf(_) !== -1) {
      //有占位符  就直接concat
      _allArgs = _allArgs.concat(_args);
    }
    else {
      //没有占位符，说明这段参数可以向前补位
      _allArgs.forEach((v, i) => {
        if (v === _ && _args.length != 0) {
          _allArgs.splice(i, 1, _args.shift());
        }
      })
      //剩下的还是添加进参数里面
      if (_args.length != 0) {
        _allArgs = _allArgs.concat(_args);
      }
    }
    //是否达到理想参数个数  以及是否还含有空位
    if (_allArgs.length < length || _allArgs.indexOf(_) !== -1) {
      //继续聚集参数
      return curry2.call(this, fn, _allArgs);
    }
    else {
      fn.apply(this, _allArgs);
    }
  }
}

// hole为传入的占位符
function curry3 (fn) {
  const __len = fn.length
  let args = [];
  return function h () {
    // 先把参数放入args数组
    args = [...args, ...Array.from(arguments)]
    // 如果长度超过原有函数参数列表长度，表示有占位
    let holeNum = args.length - __len
    // 第一个占位符对应的肯定是__len位置的变量，循环将所有占位符替换
    for (let i = 0; i < holeNum; i++) {
      args[args.indexOf(_)] = args[__len]
      args.splice(__len, 1)
    }
    // 如果没有占位符且参数数目已经够了
    if (args.length < __len || args.indexOf(_) > -1) {
      return h
    } else {
      fn.apply(null, args)
      return args = []
    }
  }
}
curry2(connect)(2, _, 4, 5)(_, 1)(_)("占位1", "占位2")("占位3");
curry3(connect)(2, _, 4, 5)(_, 1)(_)("占位1", "占位2")("占位3");