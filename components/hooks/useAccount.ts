import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../interfaces';
import { getUserMe } from '../../redux';

export const useAccount: any = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: State) => state.auth);

  useEffect(() => {
    dispatch(getUserMe());
  }, []);

  return [user, loading];
};
