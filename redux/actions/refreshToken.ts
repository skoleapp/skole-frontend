import { Dispatch } from 'redux';
import { getApiUrl, skoleAPI, tokenConfig } from '../../utils';
import { REFRESH_TOKEN, REFRESH_TOKEN_ERROR, REFRESH_TOKEN_SUCCESS } from './types';

// eslint-disable-next-line
export const refreshToken: any = (token: string) => async (dispatch: Dispatch): Promise<void> => {
  dispatch({ type: REFRESH_TOKEN });

  try {
    const url = getApiUrl('refresh-token');
    const config = tokenConfig(token);
    const { data } = await skoleAPI.get(url, config); // eslint-disable-line @typescript-eslint/camelcase

    dispatch({
      type: REFRESH_TOKEN_SUCCESS,
      payload: data.refresh_token // eslint-disable-line @typescript-eslint/camelcase
    });
  } catch {
    dispatch({
      type: REFRESH_TOKEN_ERROR
    });
  }
};
