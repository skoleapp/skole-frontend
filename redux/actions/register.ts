import Router from 'next/router';
import { Dispatch } from 'redux';
import { createError, getApiUrl, skoleAPI } from '../../utils';
import { REGISTER, REGISTER_ERROR, REGISTER_SUCCESS } from './types';
export interface RegisterParams {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const register = ({ username, email, password, confirmPassword }: RegisterParams) => async (
  dispatch: Dispatch
): Promise<void> => {
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
    const { message } = await skoleAPI.post(url, payload);
    dispatch({ type: REGISTER_SUCCESS, payload: message });
    Router.push('/login');
  } catch (error) {
    createError(error);
    dispatch({
      type: REGISTER_ERROR,
      payload: error
    });
  }
};
