import axios from 'axios';
import { Dispatch } from 'redux';
import { getApiUrl } from '../../utils';
import { SkoleToast } from '../../utils/toast';
import { LOGIN, LOGIN_ERROR, LOGIN_SUCCESS } from './types';

interface LoginParams {
  usernameOrEmail: string;
  password: string;
}

export const login = ({ usernameOrEmail, password }: LoginParams) => async (
  dispatch: Dispatch
): Promise<void> => {
  const url = getApiUrl('login-user');

  const payload = {
    username_or_email: usernameOrEmail,
    password: password
  };

  dispatch({ type: LOGIN });

  try {
    const res = await axios.post(url, payload);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data.token
    });
  } catch (e) {
    dispatch({
      type: LOGIN_ERROR,
      payload: e.message
    });

    // TODO: Add translated message
    SkoleToast({
      msg: 'Encountered error while logging in...',
      toastType: 'error'
    });
  }
};
