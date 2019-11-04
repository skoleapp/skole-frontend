import { NextPage } from 'next';
import { compose } from 'redux';
import { getUserMe } from '../actions';
import { SkoleContext } from '../interfaces';
import { withApollo } from '../lib/apollo';
import { withRedux } from '../lib/redux';

/*
 * Pages that are wrapped with this get automatically
 * authenticated if the token is valid.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withAuthSync = (WrappedComponent: NextPage): any => {
  const Wrapper = (props: any) => <WrappedComponent {...props} />; // eslint-disable-line

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Wrapper.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
    const { apolloClient, reduxStore } = ctx;
    await reduxStore.dispatch(getUserMe(apolloClient));
    return {};
  };

  return compose(
    withRedux,
    withApollo
  )(Wrapper);
};
