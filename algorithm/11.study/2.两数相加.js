/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
 var addTwoNumbers = function(l1, l2) {
  let head = new ListNode()
  let cur = head
  let carry = 0
  while(l1 || l2) {
      let x = l1 ? l1.val : 0
      let y = l2 ? l2.val : 0
      const total = x + y + carry
      cur.next = new ListNode(total % 10)
      carry = Math.floor(total / 10)
      if (l1) l1 = l1.next
      if (l2) l2 = l2.next
      cur = cur.next
  }
  if (carry) cur.next = new ListNode(carry)
  return head.next
};