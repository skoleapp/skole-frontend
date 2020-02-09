import { AnyAction } from 'redux';

import { UserMeDocument, UserObjectType } from '../../generated/graphql';
import { reAuthenticate } from '../actions';
import { SkoleContext } from '../types';
import { getToken } from './getToken';

interface Params {
    userMe?: UserObjectType;
}

// SSR hook to update and return the currently logged in user.
export const useAuthSync = async (ctx: SkoleContext): Promise<Params> => {
    const { apolloClient, reduxStore, req } = ctx;
    const token = getToken(req);

    if (!!token) {
        try {
            const { data } = await apolloClient.query({ query: UserMeDocument });
            const { userMe } = data;
            userMe && (await reduxStore.dispatch((reAuthenticate(userMe) as unknown) as AnyAction));
            return { userMe };
        } catch {
            return {};
        }
    } else {
        return {};
    }
};
