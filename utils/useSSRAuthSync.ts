import { updateUserMe } from '../actions';
import { UserMeDocument } from '../generated/graphql';
import { SkoleContext } from '../interfaces';

export const useSSRAuthSync = async (ctx: SkoleContext) => {
  const { apolloClient, reduxStore } = ctx;
  const { data } = await apolloClient.query({ query: UserMeDocument });
  const { userMe } = data;

  if (userMe) {
    await reduxStore.dispatch(updateUserMe(userMe));
    return { userMe };
  } else {
    return { userMe: null };
  }
};
