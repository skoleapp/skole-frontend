import { setToken } from '../../../redux';
import { SET_TOKEN } from '../../../redux/actions/types';

describe('auth actions', () => {
  describe('set token action', () => {
    it('dispatches action with type `SET_TOKEN` and token as payload', () => {
      const action = setToken('token');
      expect(action).toEqual({ type: SET_TOKEN, payload: 'token' });
    });
  });

  // TODO: Implement tests for other action creators...
});
