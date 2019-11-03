import { NextPage } from 'next';
import { compose } from 'redux';
import { getUserMe, setUserMe } from '../actions';
import { SkoleContext } from '../interfaces';
import { withApollo } from './apollo';
import { getToken } from './getToken';
import { withRedux } from './withRedux';

// Pages that are wrapped with this get automatic authentication.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withAuth = (WrappedComponent: NextPage): any => {
  const Wrapper = (props: any) => <WrappedComponent {...props} />; // eslint-disable-line

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Wrapper.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
    const { req, apolloClient, reduxStore } = ctx;
    const token = getToken(req);

    if (token) {
      const { userMe } = await getUserMe(apolloClient);

      if (userMe) {
        await reduxStore.dispatch(setUserMe(userMe));
      }
    }

    const componentProps =
      WrappedComponent.getInitialProps && (await WrappedComponent.getInitialProps(ctx));

    return { ...componentProps };
  };

  return compose(
    withApollo,
    withRedux
  )(Wrapper);
};
