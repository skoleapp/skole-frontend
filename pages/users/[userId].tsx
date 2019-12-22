import { NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { compose } from 'redux';
import { Layout, NotFound, StyledCard, UserProfileCardContent } from '../../components';
import { UserDocument } from '../../generated/graphql';
import { SkoleContext, User } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { redirect, useAuthSync } from '../../utils';

interface Props {
  user?: User;
}

const UserPage: NextPage<Props> = ({ user }) => {
  if (user) {
    const username = user.username || 'Username N/A';

    const userProfileProps = {
      username,
      avatar: user.avatar || '',
      title: user.title || 'Title N/A',
      bio: user.bio || 'Bio N/A',
      points: R.propOr('N/A', 'points', user) as number | string,
      courseCount: R.propOr('N/A', 'courseCount', user) as number | string,
      resourceCount: R.propOr('N/A', 'resourceCount', user) as number | string
    };

    return (
      <Layout heading={username} title={username} backUrl>
        <StyledCard>
          <UserProfileCardContent {...userProfileProps} />
        </StyledCard>
      </Layout>
    );
  } else {
    return <NotFound title="User not found..." />;
  }
};

UserPage.getInitialProps = async (ctx: SkoleContext): Promise<Props | {}> => {
  const { query, apolloClient } = ctx;
  const { userMe } = await useAuthSync(ctx);
  const { userId } = query;

  // Redirect to own profile if id matches signed in user.
  if (userMe && userMe.id === userId) {
    redirect(ctx, '/profile');
    return {};
  }

  try {
    const { data } = await apolloClient.query({
      query: UserDocument,
      variables: { userId }
    });
    return { ...data };
  } catch {
    return {};
  }
};

export default compose(withRedux, withApollo)(UserPage);
