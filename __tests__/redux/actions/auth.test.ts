import { useDispatch } from 'react-redux';
import { initialAuthState, initStore, setToken } from '../../../redux';

describe('auth actions', () => {
  const store = initStore();
  const dispatch = useDispatch();

  describe('set token action', () => {
    it('dispatches action with type `SET_TOKEN` and token as payload', () => {
      dispatch(setToken('token'));
      const state = store.getState();

      const expectedState = {
        ...initialAuthState,
        token: 'token'
      };

      expect(state).toEqual(expectedState);
    });
  });

  // TODO: Implement tests for other action creators...
});
