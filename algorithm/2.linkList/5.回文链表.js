/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
const reverse = (head) => {
  let newHead = null
  while (head) {
    let temp = head.next
    head.next = newHead
    newHead = head
    head = temp
  }
  return newHead
}
var isPalindrome = function (head) {
  let fast = head
  let slow = head
  while (fast && fast.next) {
    fast = fast.next.next
    slow = slow.next
  }
  if (fast) {
    slow = slow.next
  }
  fast = head
  slow = reverse(slow)
  while (slow) {
    if (fast.val !== slow.val) {
      return false
    }
    fast = fast.next
    slow = slow.next
  }
  return true
};