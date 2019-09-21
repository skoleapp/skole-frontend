import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../interfaces';
import { getUserMe } from '../../redux';

// FIXME: Find proper types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAccount: any = () => {
  const dispatch = useDispatch();
  const { user, loading, token } = useSelector((state: State) => state.auth);

  useEffect(() => {
    token && dispatch(getUserMe());
  }, [token]);

  return [user, loading];
};
