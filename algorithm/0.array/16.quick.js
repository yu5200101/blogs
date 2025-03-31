//=>快速排序 时间复杂度：O(nlogn) 空间复杂度O(logn)
//=>先找中间这一项14
//=>把剩余项中间的每一个值和中间项进行比较，比他小的放在左边（新数组），比他大的放在右边（新数组）

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
