import axios from 'axios';
import { Dispatch } from 'redux';
import { getApiUrl, tokenConfig } from '../../utils';
import { REFRESH_TOKEN, REFRESH_TOKEN_ERROR, REFRESH_TOKEN_SUCCESS } from './types';

// eslint-disable-next-line
export const refreshToken: any = (token: string) => async (dispatch: Dispatch): Promise<void> => {
  dispatch({ type: REFRESH_TOKEN });

  const url = getApiUrl('refresh-token');
  const config = tokenConfig(token);

  try {
    const res = await axios.get(url, config);

    dispatch({
      type: REFRESH_TOKEN_SUCCESS,
      payload: res.data.refresh_token
    });
  } catch (e) {
    dispatch({
      type: REFRESH_TOKEN_ERROR,
      payload: e.message
    });
  }
};
