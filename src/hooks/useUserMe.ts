import { useAuthContext } from 'context';
import {
  UserFieldsFragment,
  UserMeQueryHookResult,
  UserObjectType,
  useUserMeQuery,
} from 'generated';
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
  const userMe: UserObjectType = R.propOr(undefined, 'userMe', data);
  const authNetworkError: boolean = R.propOr(false, 'networkError', error);

  useEffect(() => {
    if (error) {
      setUserMe(null);
    } else {
      setUserMe(userMe);
    }

    if (userMe) {
      localStorage.setItem('user', JSON.stringify(userMe));
    } else if (authNetworkError) {
      setAuthNetworkError(true);
    }
  }, [userMe, authNetworkError, setAuthNetworkError, setUserMe, error]);

  return { userMe, authLoading, authNetworkError, ...result };
};
