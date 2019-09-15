import { Dispatch } from 'redux';
import { createError, getApiUrl, skoleAPI, tokenConfig } from '../../utils';
import { GET_USER, GET_USER_ERROR, GET_USER_SUCCESS } from './types';

// eslint-disable-next-line
export const getUser: any = (token: string) => async (dispatch: Dispatch): Promise<void> => {
  dispatch({ type: GET_USER });

  try {
    const url = getApiUrl('get-user');
    const config = tokenConfig(token);
    const { data } = await skoleAPI.get(url, config);

    dispatch({
      type: GET_USER_SUCCESS,
      payload: data
    });
  } catch (error) {
    createError(error);
    dispatch({
      type: GET_USER_ERROR,
      payload: error
    });
  }
};
