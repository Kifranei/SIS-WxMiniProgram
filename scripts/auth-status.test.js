const assert = require('assert');
const { isAuthFailureStatus } = require('../utils/auth');

assert.strictEqual(isAuthFailureStatus(401), true, '401 should be treated as auth failure');
assert.strictEqual(isAuthFailureStatus(403), true, '403 should be treated as auth failure');
assert.strictEqual(isAuthFailureStatus(400), false, '400 should stay as business validation failure');
assert.strictEqual(isAuthFailureStatus(404), false, '404 should not force logout');
assert.strictEqual(isAuthFailureStatus(500), false, '500 should not force logout');

console.log('auth-status.test.js passed');
