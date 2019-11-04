import { NextPage } from 'next';
import { compose } from 'redux';
import { updateUserMe } from '../actions';
import { UserMeDocument } from '../generated/graphql';
import { SkoleContext } from '../interfaces';
import { withApollo } from '../lib/apollo';
import { withRedux } from '../lib/redux';
import { redirect } from './redirect';

/*
 * Pages that are wrapped with this get automatically
 * redirected to login screen if not authenticated.
 * Otherwise user will be automatically logged in.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withPrivate = (WrappedComponent: NextPage): any => {
  const Wrapper = (props: any) => <WrappedComponent {...props} />; // eslint-disable-line

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Wrapper.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
    const { apolloClient, reduxStore } = ctx;
    const { data } = await apolloClient.query({ query: UserMeDocument });

    if (data.userMe) {
      await reduxStore.dispatch(updateUserMe(data.userMe));
    } else {
      redirect(ctx, '/login');
    }

    return {};
  };

  return compose(
    withRedux,
    withApollo
  )(Wrapper);
};
