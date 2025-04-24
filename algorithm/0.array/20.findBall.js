// 8 个外表一样的小球，其中7个球重量相同，1个球为异常球，可能比较重也可能比较轻，利用天平至少需要称重多少次才能确保找出异常球，并且需要知道到底是轻了还是重了。

function findBall(ary) {
  function weight(left, right) {
    // 左重1 平衡0 右重-1
    const leftWeight = left.reduce((total, cur) => total + ary[cur - 1], 0)
    const rightWeight = right.reduce((total, cur) => total + ary[cur - 1], 0)
    if (leftWeight < rightWeight) return -1
    if (leftWeight === rightWeight) return 0
    if (leftWeight > rightWeight) return 1
  }
  const firstTemp = weight([1,2,3], [4,5,6])
  if (firstTemp === 0) {
    // 说明7和8球不正常
    const secTemp = weight([7], [1])
    if (secTemp === 0) {
      // 7正常，8不正常
      const thirdTemp = weight([8], [1])
      return {ball: 8, isHeavy: thirdTemp === 1}
    } else {
      // 7不正常
      return {ball: 7, isHeavy: secTemp === 1}
    }
    // 说明7和8正常 左重右轻
  } else if (firstTemp === 1) {
    // 比较[1,4,5]和[2,6,7]
    const secTemp = weight([1,4,5], [2,6,7])
    if (secTemp === 0) {
      // 3不正常
      const thirdTemp = weight([3], [7])
      return {ball: 3, isHeavy: thirdTemp === 1}
    } else if (secTemp === 1) {
      // 1重或6轻
      const thirdTemp = weight([1], [7])
      if (thirdTemp === 1) {
        // 1重
        return {ball: 1, isHeavy: true}
      } else {
        // 6轻
        return {ball: 6, isHeavy: false}
      }
    } else if (secTemp === -1) {
      // 2重或4轻或5轻
      const fourTemp = weight([4], [7])
      if (fourTemp === -1) {
        return {ball: 4, isHeavy: false}
      }
      const fiveTemp = weight([5], [7])
      if (fiveTemp === -1) {
        return {ball: 5, isHeavy: false}
      }
      return {ball: 2, isHeavy: true}
    }
    // 说明7和8正常 左轻右重
  } else {
    // firstTemp = -1
    // 比较[1,4,5]和[2,6,7]
    const secTemp = weight([1,4,5], [2,6,7])
    if (secTemp === 0) {
      // 3不正常
      const thirdTemp = weight([3], [7])
      return {ball: 3, isHeavy: thirdTemp === 1}
    } else if (secTemp === -1) {
      // 左轻右重 1轻6重
      const thirdTemp = weight([1], [7])
      if (thirdTemp === -1) {
        // 1轻
        return {ball: 1, isHeavy: false}
      } else {
        // 6重
        return {ball: 6, isHeavy: true}
      }
    } else if (secTemp === 1) {
      // 左重右轻
      // 4重或5重或2轻
      const fourTemp = weight([4], [7])
      if (fourTemp === 1) {
        return {ball: 4, isHeavy: true}
      }
      const fiveTemp = weight([5], [7])
      if (fiveTemp === 1) {
        return {ball: 5, isHeavy: true}
      }
      return {ball: 2, isHeavy: false}
    }
  }
}

function findBall2(ary) {
  function weight(left, right) {
    // 左重1 平衡0 右重-1
    const leftWeight = left.reduce((total, cur) => total + ary[cur - 1], 0)
    const rightWeight = right.reduce((total, cur) => total + ary[cur - 1], 0)
    if (leftWeight < rightWeight) return -1
    if (leftWeight === rightWeight) return 0
    if (leftWeight > rightWeight) return 1
  }
  const firstTemp = weight([1,2,3], [4,5,6])
  const isLeftWeight = firstTemp === 1
  if (firstTemp === 0) {
    // 说明7和8球不正常
    const secTemp = weight([7], [1])
    if (secTemp === 0) {
      // 7正常，8不正常
      const thirdTemp = weight([8], [1])
      return {ball: 8, isHeavy: thirdTemp === 1}
    } else {
      // 7不正常
      return {ball: 7, isHeavy: secTemp === 1}
    }
    // 说明7和8正常
  } else {
    // 比较[1,4,5]和[2,6,7]
    const secTemp = weight([1,4,5], [2,6,7])
    if (secTemp === 0) {
      // 3不正常
      const thirdTemp = weight([3], [7])
      return {ball: 3, isHeavy: thirdTemp === 1}
    } else if (secTemp === firstTemp) {
      const thirdTemp = weight([1], [7])
      if (thirdTemp === firstTemp) {
        // 1重
        // 1轻
        return {ball: 1, isHeavy: isLeftWeight}
      } else {
        // 6轻
        // 6重
        return {ball: 6, isHeavy: !isLeftWeight}
      }
    } else if(secTemp === -firstTemp) {
      // 2重或4轻或5轻
      // 4重或5重或2轻
      const fourTemp = weight([4], [7])
      if (fourTemp === -firstTemp) {
        return {ball: 4, isHeavy: !isLeftWeight}
      }
      const fiveTemp = weight([5], [7])
      if (fiveTemp === -firstTemp) {
        return {ball: 5, isHeavy: !isLeftWeight}
      }
      return {ball: 2, isHeavy: isLeftWeight}
    }
  }
}

// 强化测试用例
const testCases = [
  // 首次左重场景
  { input: [2,1,1,1,1,1,1,1], expect: {ball:1, isHeavy:true} }, //1重
  { input: [1,1,1,1,1,0,1,1], expect: {ball:6, isHeavy:false} }, //6轻
  { input: [1,2,1,1,1,1,1,1], expect: {ball:2, isHeavy:true} }, //2重
  { input: [1,1,1,0,1,1,1,1], expect: {ball:4, isHeavy:false} }, //4轻
  { input: [1,1,1,1,0,1,1,1], expect: {ball:5, isHeavy:false} }, //5轻
  // 首次右重场景（即左轻）
  { input: [0,1,1,1,1,1,1,1], expect: {ball:1, isHeavy:false} }, //1轻
  { input: [1,1,1,1,1,2,1,1], expect: {ball:6, isHeavy:true} }, //6重
  { input: [1,0,1,1,1,1,1,1], expect: {ball:2, isHeavy:false} }, //2轻
  { input: [1,1,1,2,1,1,1,1], expect: {ball:4, isHeavy:true} }, //4重
  { input: [1,1,1,1,2,1,1,1], expect: {ball:5, isHeavy:true} }, //5重

  // 第一次不平衡，转换后第二次平衡
  { input: [1,1,2,1,1,1,1,1], expect: {ball:3, isHeavy:true} }, //3重
  { input: [1,1,0,1,1,1,1,1], expect: {ball:3, isHeavy:false} }, //3轻

  // 第一次平衡
  // 边缘情况
  { input: [1,1,1,1,1,1,0,1], expect: {ball:7, isHeavy:false} }, //7轻
  { input: [1,1,1,1,1,1,1,2], expect: {ball:8, isHeavy:true} }, //8重
  // 边缘情况
  { input: [1,1,1,1,1,1,2,1], expect: {ball:7, isHeavy:true} }, //7重
  { input: [1,1,1,1,1,1,1,0], expect: {ball:8, isHeavy:false} }, //8轻
];

testCases.forEach((tc, index) => {
  const result = findBall2(tc.input);
  const pass = result.ball === tc.expect.ball && result.isHeavy === tc.expect.isHeavy;
  console.log(`测试${index+1}: ${pass ? '通过' : '失败'}`, result);
});