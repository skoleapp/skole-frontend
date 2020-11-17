import { useAuthContext } from 'context';
import {
  UserMeQueryHookResult,
  UserObjectType,
  useUserMeQuery,
} from 'generated';
import * as R from 'ramda';
import { useEffect } from 'react';

import { useLanguageHeaderContext } from './useLanguageHeaderContext';

interface UseUserMeQuery
  extends Omit<UserMeQueryHookResult, 'data' | 'loading' | 'error'> {
  userMe: UserObjectType | null;
  authLoading: boolean;
  authNetworkError: boolean;
}

export const useUserMe = (): UseUserMeQuery => {
  const context = useLanguageHeaderContext();

  const { data, loading: authLoading, error, ...result } = useUserMeQuery({
    context,
  });

  const { setUserMe, setAuthNetworkError } = useAuthContext();
  const userMe = R.propOr(null, 'userMe', data) as UserObjectType | null;
  const authNetworkError = !!R.propOr(false, 'networkError', error); // We only care about about network error.

  useEffect(() => {
    setUserMe(userMe);

    if (userMe) {
      localStorage.setItem('user', JSON.stringify(userMe));
    } else if (authNetworkError) {
      setAuthNetworkError(true);
    }
  }, [userMe, error]);

  return { userMe, authLoading, authNetworkError, ...result };
};
