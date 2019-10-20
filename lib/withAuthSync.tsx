import { NextPage } from 'next';
import { getUserMe } from '../actions';
import { SkoleContext } from '../interfaces';
import { withApollo } from './apollo';

// This is a wrapper component to automatically update the user in the store.
export const withAuthSync = (WrappedComponent: NextPage) => {
  const Wrapper = (props: any) => <WrappedComponent {...props} />; // eslint-disable-line

  Wrapper.getInitialProps = async (ctx: SkoleContext) => {
    await ctx.store.dispatch(getUserMe(ctx.apolloClient));

    const componentProps =
      WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));

    return { ...componentProps };
  };

  return withApollo(Wrapper);
};
