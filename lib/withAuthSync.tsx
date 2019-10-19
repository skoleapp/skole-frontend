import { getUserMe } from '../actions';

export const withAuthSync = (WrappedComponent: any) => {
  const Wrapper = (props: any) => <WrappedComponent {...props} />;

  Wrapper.getInitialProps = async (ctx: any) => {
    await ctx.store.dispatch(getUserMe(ctx.apolloClient));

    const componentProps =
      WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));

    return { ...componentProps };
  };

  return Wrapper;
};
