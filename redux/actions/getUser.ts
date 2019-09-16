import { Dispatch } from 'redux';
import { createErrors, getApiUrl, skoleAPI, tokenConfig } from '../../utils';
import { GET_USER, GET_USER_ERROR, GET_USER_SUCCESS } from './types';

// eslint-disable-next-line
export const getUser: any = (token: string) => async (dispatch: Dispatch): Promise<void> => {
  dispatch({ type: GET_USER });

  try {
    const url = getApiUrl('get-user');
    const config = tokenConfig(token);
    const { user } = await skoleAPI.get(url, config);

    dispatch({
      type: GET_USER_SUCCESS,
      payload: user
    });
  } catch (error) {
    dispatch({
      type: GET_USER_ERROR,
      payload: createErrors(error)
    });
  }
};
