import { AnyAction, Dispatch } from 'redux';
import { createErrors, getApiUrl, skoleAPI, tokenConfig } from '../../utils';
import {
  GET_USER_ME,
  GET_USER_ME_ERROR,
  GET_USER_ME_SUCCESS,
  LOGIN,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  LOGOUT,
  REFRESH_TOKEN,
  REFRESH_TOKEN_ERROR,
  REFRESH_TOKEN_SUCCESS,
  REGISTER,
  REGISTER_ERROR,
  REGISTER_SUCCESS,
  SET_TOKEN
} from './types';

// eslint-disable-next-line no-explicit-any
export const setToken: any = (token: string) => (dispatch: Dispatch): AnyAction =>
  dispatch({ type: SET_TOKEN, payload: token });

// eslint-disable-next-line
export const refreshToken: any = () => async (dispatch: Dispatch): Promise<void> => {
  dispatch({ type: REFRESH_TOKEN });

  try {
    const url = getApiUrl('refresh-token');

    // FIXME: find proper config type
    const config: any = tokenConfig(); // typescript-disable-line no-explicit-any

    const { data } = await skoleAPI.get(url, config);

    dispatch({
      type: REFRESH_TOKEN_SUCCESS,
      payload: data.refresh_token // eslint-disable-line @typescript-eslint/camelcase
    });
  } catch {
    dispatch({
      type: REFRESH_TOKEN_ERROR
    });
  }
};

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const register = ({ username, email, password, confirmPassword }: RegisterParams) => (
  dispatch: Dispatch
): Promise<AnyAction> => {
  return new Promise(
    // eslint-disable-next-line no-async-promise-executor
    async (resolve, reject): Promise<void> => {
      dispatch({ type: REGISTER });

      const payload = {
        username,
        email,
        password: {
          password,
          confirm_password: confirmPassword // eslint-disable-line
        }
      };

      try {
        const url = getApiUrl('register');
        await skoleAPI.post(url, payload);
        resolve(dispatch({ type: REGISTER_SUCCESS }));
      } catch (error) {
        reject(dispatch({ type: REGISTER_ERROR, payload: createErrors(error) }));
      }
    }
  );
};

interface LoginParams {
  usernameOrEmail: string;
  password: string;
}

export const login = ({ usernameOrEmail, password }: LoginParams) => (
  dispatch: Dispatch
): Promise<AnyAction> => {
  return new Promise(
    // eslint-disable-next-line no-async-promise-executor
    async (resolve, reject): Promise<void> => {
      const payload = {
        username_or_email: usernameOrEmail, // eslint-disable-line @typescript-eslint/camelcase
        password: password
      };

      dispatch({ type: LOGIN });

      try {
        const url = getApiUrl('login');
        const { data } = await skoleAPI.post(url, payload);
        resolve(dispatch({ type: LOGIN_SUCCESS, payload: data.token }));
      } catch (error) {
        reject(dispatch({ type: LOGIN_ERROR, payload: createErrors(error) }));
      }
    }
  );
};

export const logout = () => (dispatch: Dispatch): { type: string } => dispatch({ type: LOGOUT });

export const getUserMe = () => async (dispatch: Dispatch) => {
  dispatch({ type: GET_USER_ME });

  try {
    const url = getApiUrl('user-me');

    // FIXME: find proper config type
    const config: any = tokenConfig(); // typescript-disable-line no-explicit-any
    const { data } = await skoleAPI.get(url, config);

    dispatch({
      type: GET_USER_ME_SUCCESS,
      payload: data
    });
  } catch (error) {
    dispatch({
      type: GET_USER_ME_ERROR,
      payload: createErrors(error)
    });
  }
};
