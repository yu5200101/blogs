const assert = require('node:assert/strict')
try {
  assert.deepStrictEqual([[[1, 2, 3]], 4, 5], [[[1, 2, '3']], 4, 5]);
} catch(err) {
  console.log(err)
}
// AssertionError: Expected inputs to be strictly deep-equal:
// + actual - expected ... Lines skipped
//
//   [
//     [
// ...
//       2,
// +     3
// -     '3'
//     ],
// ...
//     5
//   ]

try {
  assert.doesNotMatch('I will fail', /fail/);
} catch (err) {
  console.log(err)
}
// AssertionError [ERR_ASSERTION]: The input was expected to not match the ...

try {
  assert.doesNotMatch(123, /pass/);
} catch (err) {
  console.log(err)
}
// AssertionError [ERR_ASSERTION]: The "string" argument must be of type string.

try {
  assert.doesNotMatch('I will pass', /different/);
} catch (err) {
  console.log(err)
}
// OK