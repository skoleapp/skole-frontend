import { useAuthContext } from 'context';
import { UserFieldsFragment, UserMeQueryHookResult, useUserMeQuery } from 'generated';
import * as R from 'ramda';
import { useEffect } from 'react';

import { useLanguageHeaderContext } from './useLanguageHeaderContext';

interface UseUserMeQuery extends Omit<UserMeQueryHookResult, 'data' | 'loading' | 'error'> {
  userMe: UserFieldsFragment | null;
  authLoading: boolean;
  authNetworkError: boolean;
}

export const useUserMe = (): UseUserMeQuery => {
  const context = useLanguageHeaderContext();

  const { data, loading: authLoading, error, ...result } = useUserMeQuery({
    context,
  });

  const { setUserMe, setAuthNetworkError } = useAuthContext();
  const userMe = R.prop('userMe', data);
  const authNetworkError = R.prop('networkError', error); // We only care about about network error.

  useEffect(() => {
    setUserMe(userMe);

    if (userMe) {
      localStorage.setItem('user', JSON.stringify(userMe));
    } else if (authNetworkError) {
      setAuthNetworkError(true);
    }
  }, [userMe, error, authNetworkError, setAuthNetworkError, setUserMe]);

  return { userMe, authLoading, authNetworkError, ...result };
};
