import axios from 'axios';
import { Dispatch } from 'redux';
import { getApiUrl } from '../../utils';
import { SkoleToast } from '../../utils/toast';
import { REGISTER_USER, REGISTER_USER_ERROR, REGISTER_USER_SUCCESS } from './types';

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

// TODO: Add return type for the function
export const register = (params: RegisterParams) => async (dispatch: Dispatch): Promise<void> => {
  const url = getApiUrl('register-user');
  const payload = JSON.stringify(params);

  dispatch({ type: REGISTER_USER });

  try {
    const res = await axios.post(url, payload);

    dispatch({
      type: REGISTER_USER_SUCCESS,
      payload: res.data
    });

    // TODO: Add translated message
    SkoleToast({
      msg: `Welcome ${res.data.username}!`,
      toastType: 'success'
    });
  } catch (e) {
    dispatch({
      type: REGISTER_USER_ERROR,
      payload: e.message
    });

    // TODO: Add translated message
    SkoleToast({
      msg: 'Encountered error while registering new user...',
      toastType: 'error'
    });
  }
};
