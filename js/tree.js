'use strict'

var data = [{
    "province": "浙江",
    "city": "杭州",
    "name": "西湖"
}, {
    "province": "四川",
    "city": "成都",
    "name": "锦里"
}, {
    "province": "四川",
    "city": "成都",
    "name": "方所"
}, {
    "province": "四川",
    "city": "阿坝",
    "name": "九寨沟"
}]

var keys = ['province', 'city', 'name']

var transObject = function (tableData, keys) {
    let hashTable = {}, res = []
    for (let i = 0; i < tableData.length; i++) {
        let arr = res, cur = hashTable
        for (let j = 0; j < keys.length; j++) {
            let key = keys[j], field = tableData[i][key]
            if (!cur[field]) {
                let pusher = {
                    value: field
                }, tmp
                if (j !== (keys.length - 1)) {
                    tmp = []
                    pusher.children = tmp
                }
                cur[field] = { $$pos: arr.push(pusher) - 1 }    
                cur = cur[field]      
                arr = tmp
            } else {
                cur = cur[field]
                arr = arr[cur.$$pos].children
            }
        }
    }
    return res
}
console.log(transObject(data, keys))

var input = {
    h3: {
        parent: 'h2',
        name: '副总经理(市场)'
    },
    h1: {
        parent: 'h0',
        name: '公司机构'
    },
    h7: {
        parent: 'h6',
        name: '副总经理(总务)'
    },
    h4: {
        parent: 'h3',
        name: '销售经理'
    },
    h2: {
        parent: 'h1',
        name: '总经理'
    },
    h8: {
        parent: 'h0',
        name: '财务总监'
    },
    h6: {
        parent: 'h4',
        name: '仓管总监'
    },
    h5: {
        parent: 'h4',
        name: '销售代表'
    },
    h0: {
        parent: '',
        name: 'root'
    }
};

var plainTree = function (obj) {
    var key, res 
    for(key in obj) {
        var parent = obj[key].parent
        if(parent === '') {
            res = obj[key]
        } else {
            obj[parent][key] = obj[key]
        }
    }
    return res
}
console.log(plainTree(input));

// 将一个扁平对象，根据 keys 树形化
function toTree (obj, [key, ...rest], result = {}) {
    if (result.value == null) {
        result.value = obj[key]
        if (rest.length) {
            result.children = toTreeList(obj, rest)
        }
    } else if (result.value === obj[key] && rest.length) {
        toTreeList(obj, rest, result.children)
    }
    return result
}

// 将一个扁平对象的树形化产物，不重复地放到 list 里
function toTreeList (obj, keys, list = []) {
    let value = obj[keys[0]]
    let target = list.find(item => item.value === value)
    if (target) {
        toTree(obj, keys, target)
    } else {
        list.push(toTree(obj, keys))
    }
    return list
}

// 将一个扁平化对象组成的列表，变成树形化的列表
function listToTree (list = [], keys = []) {
    return list.reduce(
        (result, obj) => toTreeList(obj, keys, result),
        []
    )
}

console.log('result', listToTree(data, ['province', 'city', 'name', 'area']))

 


