import { NextPage } from 'next';
import { getUserMe } from '../actions';
import { SkoleContext } from '../interfaces';
import { withApollo } from './apollo';
import { getToken } from './getToken';
import { redirect } from './redirect';
import { withRedux } from './withRedux';

// Pages that are wrapped with this get automatically redirected to login screen if not authenticated.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withPrivate = (WrappedComponent: NextPage): any => {
  const Wrapper = (props: any) => <WrappedComponent {...props} />; // eslint-disable-line

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Wrapper.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
    const { req, apolloClient } = ctx;
    const token = getToken(req);

    if (token) {
      const { userMe } = await getUserMe(apolloClient);

      if (!userMe) {
        redirect(ctx, '/login');
      }
    }

    const componentProps =
      WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));

    return { ...componentProps };
  };

  return withApollo(withRedux(Wrapper));
};
