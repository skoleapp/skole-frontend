import { updateUserMe } from '../actions';
import { SkoleContext } from '../interfaces';
import { redirect } from './redirect';
import { useAuthSync } from './useAuthSync';

// SSR hook to allow page only for unauthenticated users.
export const usePublicPage = async (ctx: SkoleContext) => {
  const { userMe } = await useAuthSync(ctx);

  if (!!userMe) {
    await ctx.reduxStore.dispatch(updateUserMe(userMe));
    redirect(ctx, '/');
  }
};
