import { AnyAction } from 'redux';

import { reAuthenticate } from '../actions';
import { SkoleContext } from '../types';
import { redirect } from './redirect';
import { useAuthSync } from './useAuthSync';

// SSR hook to allow page for only authenticated users.
export const usePrivatePage = async (ctx: SkoleContext): Promise<void> => {
    const { userMe } = await useAuthSync(ctx);

    if (!!userMe) {
        await ctx.reduxStore.dispatch((reAuthenticate(userMe) as unknown) as AnyAction);
    } else {
        redirect(ctx, '/login', { next: ctx.pathname });
    }
};
