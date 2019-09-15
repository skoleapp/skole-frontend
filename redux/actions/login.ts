import Router from 'next/router';
import { Dispatch } from 'redux';
import { createError, getApiUrl, skoleAPI } from '../../utils';
import { LOGIN, LOGIN_ERROR, LOGIN_SUCCESS } from './types';

interface LoginParams {
  usernameOrEmail: string;
  password: string;
}

export const login = ({ usernameOrEmail, password }: LoginParams) => async (
  dispatch: Dispatch
): Promise<void> => {
  const payload = {
    username_or_email: usernameOrEmail, // eslint-disable-line
    password: password
  };

  dispatch({ type: LOGIN });

  try {
    const url = getApiUrl('login');
    const { token } = await skoleAPI.post(url, payload);
    dispatch({ type: LOGIN_SUCCESS, payload: token });
    Router.push('/account');
  } catch (error) {
    createError(error);
    dispatch({
      type: LOGIN_ERROR,
      payload: error
    });
  }
};
