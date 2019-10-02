import { GET_USER_ME, LOGIN, REFRESH_TOKEN, REGISTER } from '../../actions/types';
import authReducer, { initialAuthState } from '../../reducers/auth';

describe('auth reducer', () => {
  it('returns initial state when no action is dispatched', () => {
    const state = authReducer(undefined, { type: undefined });
    expect(state).toEqual(initialAuthState);
  });

  it('returns loading state for the following actions: `REGISTER`, `LOGIN`, `REFRESH_TOKEN`, `GET_USER_ME`', () => {
    let state = authReducer(undefined, { type: REGISTER });
    expect(state).toEqual({ ...initialAuthState, loading: true });

    state = authReducer(undefined, { type: LOGIN });
    expect(state).toEqual({ ...initialAuthState, loading: true });

    state = authReducer(undefined, { type: REFRESH_TOKEN });
    expect(state).toEqual({ ...initialAuthState, loading: true });

    state = authReducer(undefined, { type: GET_USER_ME });
    expect(state).toEqual({ ...initialAuthState, loading: true });
  });

  // TODO: implement other tests for auth reducer
});
