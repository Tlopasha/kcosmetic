import { assert } from 'chai';

describe('Array', function () {
  it('should start empty', function () {
    let arr = [];

    assert.equal(arr.length, 0);
  });
});
