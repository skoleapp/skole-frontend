import { AnyAction } from 'redux';
import { SearchState } from '../../interfaces';
import { SEARCH, SEARCH_ERROR, SEARCH_SUCCESS } from '../actions/types';

const initialState: SearchState = {
  results: null,
  loading: null,
  errors: null
};

export default (state = initialState, action: AnyAction): SearchState => {
  switch (action.type) {
    case SEARCH:
      return { ...state, loading: true };

    case SEARCH_SUCCESS:
      return { ...state, loading: false, results: action.payload };

    case SEARCH_ERROR:
      return { ...state, loading: false, errors: action.payload };

    default:
      return state;
  }
};
