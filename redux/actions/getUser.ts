import axios from 'axios';
import { Dispatch } from 'redux';
import { getApiUrl, tokenConfig } from '../../utils';
import { GET_USER, GET_USER_ERROR, GET_USER_SUCCESS } from './types';

export const getUser = (token: string) => async (dispatch: Dispatch): Promise<void> => {
  dispatch({ type: GET_USER });

  const url = getApiUrl('get-user');
  const config = tokenConfig(token);

  try {
    const res = await axios.get(url, config);

    dispatch({
      type: GET_USER_SUCCESS,
      payload: res.data
    });
  } catch (e) {
    dispatch({
      type: GET_USER_ERROR,
      payload: e.message
    });
  }
};
