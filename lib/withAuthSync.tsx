import { NextPage } from 'next';
import { getUserMe } from '../actions';
import { SkoleContext } from '../interfaces';
import { withApollo } from './apollo';
import { getToken } from './getToken';

/*
 * This is a wrapper component to automatically update
 * the user in the store if the user is already authenticated.
 */
export const withAuthSync = (WrappedComponent: NextPage) => {
  const Wrapper = (props: any) => <WrappedComponent {...props} />; // eslint-disable-line

  Wrapper.getInitialProps = async (ctx: SkoleContext) => {
    const { req, store, apolloClient } = ctx;

    const token = getToken(req);

    if (token) {
      await store.dispatch(getUserMe(apolloClient));
    }

    const componentProps =
      WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));

    return { ...componentProps };
  };

  return withApollo(Wrapper);
};
