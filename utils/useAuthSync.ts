import { updateUserMe } from '../actions';
import { UserMeDocument } from '../generated/graphql';
import { SkoleContext, UserMe } from '../interfaces';

interface Params {
  userMe: UserMe | null;
}

// SSR hook to update and return currently logged in user.
export const useAuthSync = async (ctx: SkoleContext): Promise<Params> => {
  const { apolloClient, reduxStore } = ctx;

  try {
    const { data } = await apolloClient.query({ query: UserMeDocument });
    const { userMe } = data;
    await reduxStore.dispatch(updateUserMe(userMe));
    return { userMe };
  } catch {
    return { userMe: null };
  }
};
