// import moxios from 'moxios';
// import { initialAuthState, initStore, refreshToken, setToken } from '../..';

// describe('auth actions', () => {
//   beforeEach(() => {
//     moxios.install();
//   });

//   afterEach(() => {
//     moxios.uninstall();
//   });

//   const store = initStore();

//   describe('set token action', () => {
//     it('sets the token in the store', () => {
//       store.dispatch(setToken('token'));
//       const { auth } = store.getState();

//       const expectedState = {
//         ...initialAuthState,
//         token: 'token'
//       };

//       expect(auth).toEqual(expectedState);
//     });
//   });

//   describe('refresh token', () => {
//     it('refreshes the token', () => {
//       const store = initStore();
//       const oldToken = 'oldToken';
//       const newToken = 'newToken';

//       moxios.wait(() => {
//         const request = moxios.requests.mostRecent();
//         request.respondWith({
//           status: 200,
//           response: {
//             refresh_token: newToken // eslint-disable-line
//           }
//         });
//       });

//       store.dispatch(refreshToken(oldToken)).then(() => {
//         const state = store.getState();
//         const { token } = state.auth;
//         expect(token).toBe(newToken);
//       });
//     });

//     it('creates error on invalid token', () => {});
//   });

//   // TODO: Implement tests for other action creators...
// });
