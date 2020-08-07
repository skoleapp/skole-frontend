import { useAuthContext } from 'context';
import { UserMeQueryHookResult, UserObjectType, useUserMeQuery } from 'generated';
import * as R from 'ramda';
import { useEffect } from 'react';

interface UseUserMeQuery extends Omit<UserMeQueryHookResult, 'data' | 'loading' | 'error'> {
    userMe: UserObjectType | null;
    authLoading: boolean;
    authNetworkError: boolean;
}

export const useUserMe = (): UseUserMeQuery => {
    const { data, loading: authLoading, error: apolloError, ...result } = useUserMeQuery();
    const { setUserMe } = useAuthContext();
    const userMe = R.propOr(null, 'userMe', data) as UserObjectType | null;
    const authNetworkError = !!R.propOr(false, 'networkError', apolloError); // We only care about about network error.

    useEffect(() => {
        if (!!userMe) {
            setUserMe(userMe);
            localStorage.setItem('user', JSON.stringify(userMe));
        }
    }, [userMe]);

    return { userMe, authLoading, authNetworkError, ...result };
};
