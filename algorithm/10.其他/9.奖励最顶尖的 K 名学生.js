/*
给你两个字符串数组 positive_feedback 和 negative_feedback ，分别包含表示正面的和负面的词汇。不会 有单词同时是正面的和负面的。

一开始，每位学生分数为 0 。每个正面的单词会给学生的分数 加 3 分，每个负面的词会给学生的分数 减  1 分。

给你 n 个学生的评语，用一个下标从 0 开始的字符串数组 report 和一个下标从 0 开始的整数数组 student_id 表示，其中 student_id[i] 表示这名学生的 ID ，这名学生的评语是 report[i] 。每名学生的 ID 互不相同。

给你一个整数 k ，请你返回按照得分 从高到低 最顶尖的 k 名学生。如果有多名学生分数相同，ID 越小排名越前。

示例 1：

输入：positive_feedback = ["smart","brilliant","studious"], negative_feedback = ["not"], report = ["this student is studious","the student is smart"], student_id = [1,2], k = 2
输出：[1,2]
解释：
两名学生都有 1 个正面词汇，都得到 3 分，学生 1 的 ID 更小所以排名更前。
示例 2：

输入：positive_feedback = ["smart","brilliant","studious"], negative_feedback = ["not"], report = ["this student is not studious","the student is smart"], student_id = [1,2], k = 2
输出：[2,1]
解释：
- ID 为 1 的学生有 1 个正面词汇和 1 个负面词汇，所以得分为 3-1=2 分。
- ID 为 2 的学生有 1 个正面词汇，得分为 3 分。
学生 2 分数更高，所以返回 [2,1] 。
*/
/**
 * @param {string[]} positive_feedback
 * @param {string[]} negative_feedback
 * @param {string[]} report
 * @param {number[]} student_id
 * @param {number} k
 * @return {number[]}
 */

var topStudents = function(positive_feedback, negative_feedback, report, student_id, k) {
  const scoreAry = []
  let resultAry = []
  const words = {}
  for (const word of positive_feedback) {
    words[word] = 3
  }
  for (const word of negative_feedback) {
    words[word] = -1
  }
  report.forEach((item, index) => {
    const ary = item.split(' ')
    let score = 0
    for (const word of ary) {
      score += words[word] || 0
    }
    scoreAry.push({
      id: student_id[index],
      score
    })
  })
  resultAry = scoreAry.sort((a, b) => {
    if (a.score === b.score)  {
      return a.id - b.id
    } else {
      return b.score - a.score
    }
  })
  resultAry.splice(k)
  return resultAry.map(item => item.id)
  };