import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../interfaces';
import { search } from '../../redux';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useSearch = (url: string): any => {
  const { results, loading } = useSelector((state: State) => state.search);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(search(url));
  }, []);

  return [results, loading];
};
