import { Dispatch } from 'redux';
import { createErrors, skoleAPI } from '../../utils';
import { SEARCH, SEARCH_ERROR, SEARCH_SUCCESS } from './types';

export const search = (url: string) => async (dispatch: Dispatch): Promise<void> => {
  dispatch({ type: SEARCH });

  try {
    const { data } = await skoleAPI.get(url);
    dispatch({ type: SEARCH_SUCCESS, payload: data.results });
  } catch (error) {
    dispatch({ type: SEARCH_ERROR, payload: createErrors(error) });
  }
};
