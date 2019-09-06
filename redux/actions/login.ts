import axios from 'axios';
import { Dispatch } from 'redux';
import { getApiUrl } from '../../utils';
import { AuthParams } from './interfaces';
import { LOGIN_USER, REGISTER_USER_ERROR, REGISTER_USER_SUCCESS } from './types';

export const login = (params: AuthParams) => async (dispatch: Dispatch) => {
  const url = getApiUrl('login-user');
  const payload = JSON.stringify(params);

  dispatch({ type: LOGIN_USER });

  try {
    const res = await axios.post(url, payload);

    return dispatch({
      type: REGISTER_USER_SUCCESS,
      payload: res.data
    });
  } catch (e) {
    return dispatch({
      type: REGISTER_USER_ERROR,
      payload: e.message
    });
  }
};
