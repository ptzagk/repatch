import 'mocha';
import * as assert from 'assert';
import Store, { thunk } from '../store';

process.env.NODE_ENV = 'test';

describe('thunk', () => {
  it('dispatch invokes the delegate', () => {
    const store = new Store(1).addMiddleware(thunk());
    assert.strictEqual(store.getState(), 1);
    store.dispatch((state) => (dispatch, getState) => {
      store.dispatch((state) => getState() + 1);
    });
    assert.strictEqual(store.getState(), 2);
  });

  it('dispatch returns the delegate', () => {
    const store = new Store(1).addMiddleware(thunk());
    const expected = 8;
    assert.strictEqual(
      store.dispatch((state) => (dispatch) => {
        store.dispatch((state) => state + 1);
        return expected;
      }),
      expected
    );
  });

  it('extra arguments are provided', () => {
    const add = (a, b) => a + b;
    const store = new Store(1).addMiddleware(thunk(add));
    store.dispatch((state) => (dispatch, getState, add) => {
      store.dispatch((state) => add(state, 1));
    });
    assert.strictEqual(store.getState(), 2);
  });
});
