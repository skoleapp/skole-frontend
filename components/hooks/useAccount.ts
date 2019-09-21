import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { State, User } from '../../interfaces';
import { getUserMe } from '../../redux';

type UseAccount = () => (boolean | User | null)[];

export const useAccount: UseAccount = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: State) => state.auth);

  useEffect(() => {
    dispatch(getUserMe());
  }, []);

  return [user, loading];
};
