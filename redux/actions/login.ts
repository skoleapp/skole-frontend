import axios from 'axios';
import { Dispatch } from 'redux';
import { getApiUrl } from '../../utils';
import { SkoleToast } from '../../utils/toast';
import { LOGIN_USER, LOGIN_USER_ERROR, LOGIN_USER_SUCCESS } from './types';
import Router from 'next/router';

interface LoginParams {
  usernameOrEmail: string;
  password: string;
}

export const login = (params: LoginParams) => async (dispatch: Dispatch): Promise<void> => {
  const url = getApiUrl('login-user');
  const payload = JSON.stringify(params);

  dispatch({ type: LOGIN_USER });

  try {
    const res = await axios.post(url, payload);

    dispatch({
      type: LOGIN_USER_SUCCESS,
      payload: res.data
    });

    Router.push('/user/me');
  } catch (e) {
    dispatch({
      type: LOGIN_USER_ERROR,
      payload: e.message
    });

    // TODO: Add translated message
    return SkoleToast({
      msg: 'Encountered error while logging in...',
      toastType: 'error'
    });
  }
};
