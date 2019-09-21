import moxios from 'moxios';
import { useDispatch } from 'react-redux';
import { initialAuthState, initStore, setToken } from '../../../redux';

describe('auth actions', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  const store = initStore();
  const dispatch = useDispatch();

  describe('set token action', () => {
    it('sets the token in the store', () => {
      dispatch(setToken('token'));
      const state = store.getState();

      const expectedState = {
        ...initialAuthState,
        token: 'token'
      };

      expect(state).toEqual(expectedState);
    });
  });

  it('refreshes the token', () => {});

  // TODO: Implement tests for other action creators...
});
