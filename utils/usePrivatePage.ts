import { updateUserMe } from '../actions';
import { SkoleContext } from '../interfaces';
import { redirect } from './redirect';
import { useAuthSync } from './useAuthSync';

// SSR hook to allow page for only authenticated users.
export const usePrivatePage = async (ctx: SkoleContext): Promise<void> => {
  const { userMe } = await useAuthSync(ctx);

  if (!!userMe) {
    await ctx.reduxStore.dispatch(updateUserMe(userMe));
  } else {
    redirect(ctx, '/auth/login');
  }
};
