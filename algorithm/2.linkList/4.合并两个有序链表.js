/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} list1
 * @param {ListNode} list2
 * @return {ListNode}
 */
var mergeTwoLists = function (list1, list2) {
  if (!list1) return list2
  if (!list2) return list1
  let head = new ListNode(-1)
  let curHead = head
  while (list1 && list2) {
    if (list1.val < list2.val) {
      curHead.next = list1
      list1 = list1.next
    } else {
      curHead.next = list2
      list2 = list2.next
    }
    curHead = curHead.next
  }
  curHead.next = list1 ? list1 : list2
  return head.next
};