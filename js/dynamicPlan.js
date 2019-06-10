function getNum () {
    return parseInt(Math.random() * 100 + 1)
}

function getArr (size) {
    let arr = []
    for (let i = 0; i < size; i++) {
        arr.push(getNum())
    }
    return arr
}
let pack = 100000
let num = 100
let weight = getArr(num)
let val = getArr(num)

function knapSack (weight, val, num, pack) {
    let startTime = new Date().getTime()
    var T = []
    for (let i = 0; i < num; i++) {
        T[i] = []
        for (let j = 0; j <= pack; j++) {
            if (j === 0) {
                T[i][j] = 0
                continue;
            }
            if (j < weight[i]) {
                if (i === 0) {
                    T[i][j] = 0
                } else {
                    T[i][j] = T[i - 1][j]
                }
            } else {
                if (i === 0) {
                    T[i][j] = val[i]
                } else {
                    T[i][j] = Math.max((val[i] + T[i - 1][j - weight[i]]), (T[i - 1][j]))
                }
            }
        }
    }
    let endTime = new Date().getTime()
    console.log(endTime - startTime)
    findValue(weight, val, num, pack, T)
}

function ccc (wight, value, all) {
    var startTime = new Date().getTime();
    var returnList = [];
    var returnList_prev = [];
    var flag = true;
    for (var i = 0; i < wight.length; i++) {
        for (var j = 0; j < all; j++) {
            var nowW = j + 1;//此时背包重量
            var nowW_ = wight[i];//此时物品重量
            var nowV = value[i];//此时的价值
            var lastW = nowW - nowW_;//此时背包重量减去此时要添加的物品后的重量
            //考虑过两个数组相互赋值，但是数组是引用类型，两个会干扰，如果深拷贝那就更影响速度，所以想到这种两个数组相互使用相互覆盖的方式来避免构建庞大的二维数组
            if (flag) {
                var fV = lastW >= 0 ? nowV : 0;
                fV = fV + (i > 0 && returnList_prev[lastW - 1] ? returnList_prev[lastW - 1] : 0);
                var nV = i > 0 && returnList_prev[j] ? returnList_prev[j] : 0;
                returnList[j] = Math.max(fV, nV);
            } else {
                var fV = lastW >= 0 ? nowV : 0;
                fV = fV + (i > 0 && returnList[lastW - 1] ? returnList[lastW - 1] : 0);
                var nV = i > 0 && returnList[j] ? returnList[j] : 0;
                returnList_prev[j] = Math.max(fV, nV);
            }

        }
        flag = !flag;
    }
    var endTime = new Date().getTime();
    console.log(endTime - startTime)
}
function bbb (weight, val, num, pack) {
    let startTime = new Date().getTime()
    var T = []
    for (let i = 0; i < num; i++) {
        T[i] = []
        for (let j = 0; j <= pack; j++) {
            var lastW = j - weight[i]
            var fV = lastW >= 0 ? val[i] : 0;
            fV = fV + (i > 0 && T[i - 1][lastW] ? T[i - 1][lastW] : 0);
            var nV = i > 0 && T[i - 1][j] ? T[i - 1][j] : 0;
            T[i][j] = Math.max(fV, nV);
        }
    }
    let endTime = new Date().getTime()
    console.log(endTime - startTime)
    findValue(weight, val, num, pack, T)
}
// 找到需要的物品
function findValue (weight, val, num, pack, T) {
    let arr = []
    let obj = {}
    var i = num - 1, j = pack
    while (i > 0 && j > 0) {
        if (T[i][j] !== T[i - 1][j]) {
            obj = {
                name: i,
                val: val[i],
                weight: weight[i]
            }
            arr.push(obj)
            j = j - weight[i]
            i--
        } else {
            i--
        }
    }
    if (i === 0) {
        if (T[i][j] !== 0) {
            obj = {
                name: i,
                val: i,
                weight: weight[i]
            }
            arr.push(obj)
        }
    }
    console.log(arr)
}
knapSack(weight, val, num, pack)
bbb(weight, val, num, pack)
ccc(weight, val, pack)