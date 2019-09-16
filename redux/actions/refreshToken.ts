import { Dispatch } from 'redux';
import { createErrors, getApiUrl, skoleAPI, tokenConfig } from '../../utils';
import { REFRESH_TOKEN, REFRESH_TOKEN_ERROR, REFRESH_TOKEN_SUCCESS } from './types';

// eslint-disable-next-line
export const refreshToken: any = (token: string) => async (dispatch: Dispatch): Promise<void> => {
  dispatch({ type: REFRESH_TOKEN });

  try {
    const url = getApiUrl('refresh-token');
    const config = tokenConfig(token);
    const { refresh_token } = await skoleAPI.get(url, config);

    dispatch({
      type: REFRESH_TOKEN_SUCCESS,
      payload: refresh_token
    });
  } catch (error) {
    dispatch({
      type: REFRESH_TOKEN_ERROR,
      payload: createErrors(error)
    });
  }
};
