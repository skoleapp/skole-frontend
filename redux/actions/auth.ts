import { Dispatch } from 'react';
import { AnyAction } from 'redux';
import { SET_USER } from './types';

// import { AnyAction, Dispatch } from 'redux';
// import { getApiUrl, refreshTokenConfig, skoleAPI, tokenConfig } from '../../api';
// import { State } from '../../interfaces';
// import { createErrors } from '../../utils';
// import {
//   GET_USER_ME,
//   GET_USER_ME_ERROR,
//   GET_USER_ME_SUCCESS,
//   LOGIN,
//   LOGIN_ERROR,
//   LOGIN_SUCCESS,
//   LOGOUT,
//   REFRESH_TOKEN,
//   REFRESH_TOKEN_ERROR,
//   REFRESH_TOKEN_SUCCESS,
//   REGISTER,
//   REGISTER_ERROR,
//   REGISTER_SUCCESS
// } from './types';

// eslint-disable-next-line
// export const refreshToken: any = (token: string) => async (dispatch: Dispatch): Promise<void> => {
//   dispatch({ type: REFRESH_TOKEN });

//   try {
//     const url = getApiUrl('refresh-token');
//     const config = refreshTokenConfig(token);
//     const { data } = await skoleAPI.get(url, config);
//     // eslint-disable-line @typescript-eslint/camelcase
//     dispatch({ type: REFRESH_TOKEN_SUCCESS, payload: data.refresh_token });
//   } catch (error) {
//     dispatch({ type: REFRESH_TOKEN_ERROR, payload: createErrors(error) });
//   }
// };

// export interface RegisterParams {
//   username: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// }

// export const register = ({ username, email, password, confirmPassword }: RegisterParams) => (
//   dispatch: Dispatch
// ): Promise<AnyAction> => {
//   return new Promise(
//     // eslint-disable-next-line no-async-promise-executor
//     async (resolve, reject): Promise<void> => {
//       dispatch({ type: REGISTER });

//       const payload = {
//         username,
//         email,
//         password: {
//           password,
//           confirm_password: confirmPassword // eslint-disable-line
//         }
//       };

//       try {
//         const url = getApiUrl('register');
//         await skoleAPI.post(url, payload);
//         resolve(dispatch({ type: REGISTER_SUCCESS }));
//       } catch (error) {
//         reject(dispatch({ type: REGISTER_ERROR, payload: createErrors(error) }));
//       }
//     }
//   );
// };

// interface LoginParams {
//   usernameOrEmail: string;
//   password: string;
// }

// export const login = ({ usernameOrEmail, password }: LoginParams) => (
//   dispatch: Dispatch
// ): Promise<AnyAction> => {
//   return new Promise(
//     // eslint-disable-next-line no-async-promise-executor
//     async (resolve, reject): Promise<void> => {
//       const payload = {
//         username_or_email: usernameOrEmail, // eslint-disable-line @typescript-eslint/camelcase
//         password: password
//       };

//       dispatch({ type: LOGIN });

//       try {
//         const url = getApiUrl('login');
//         const { data } = await skoleAPI.post(url, payload);
//         resolve(dispatch({ type: LOGIN_SUCCESS, payload: data.token }));
//       } catch (error) {
//         reject(dispatch({ type: LOGIN_ERROR, payload: createErrors(error) }));
//       }
//     }
//   );
// };

// export const logout = () => (dispatch: Dispatch): void =>
//   dispatch({ type: LOGOUT }) && localStorage.removeItem('token');

// export const getUserMe = () => async (dispatch: Dispatch, getState: () => State): Promise<void> => {
//   dispatch({ type: GET_USER_ME });

//   try {
//     const url = getApiUrl('user-me');
//     const config = tokenConfig(getState);
//     const { data } = await skoleAPI.get(url, config);
//     dispatch({ type: GET_USER_ME_SUCCESS, payload: data });
//   } catch (error) {
//     dispatch({ type: GET_USER_ME_ERROR, payload: createErrors(error) });
//   }
// };

export const setUser = (data: any) => (dispatch: Dispatch<AnyAction>) => {
  dispatch({ type: SET_USER, payload: { ...data } });
};
