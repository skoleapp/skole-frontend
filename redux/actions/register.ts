import axios from 'axios';
import { Dispatch } from 'redux';
import { getApiUrl } from '../../utils';
import { AuthParams } from './interfaces';
import { REGISTER_USER, REGISTER_USER_ERROR, REGISTER_USER_SUCCESS } from './types';

// TODO: Add return type for the function
export const register = (params: AuthParams) => async (dispatch: Dispatch) => {
  const url = getApiUrl('register-user');
  const payload = JSON.stringify(params);

  dispatch({ type: REGISTER_USER });

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
