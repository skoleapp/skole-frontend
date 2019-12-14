import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { Layout, NotFound, StyledCard, UserProfileCardContent } from '../../components';
import { UserDocument } from '../../generated/graphql';
import { PublicUser, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { redirect, useAuthSync } from '../../utils';
import { withTranslation } from '../../i18n';

interface Props {
  user?: PublicUser;
  t: (value: string) => any;
}

const UserPage: NextPage<Props> = ({ user, t }) => {
  if (user) {
    const username = user.username || 'Username N/A';

    const userProfileProps = {
      username,
      avatar: user.avatar || '',
      title: user.title || 'Title N/A',
      bio: user.bio || 'Bio N/A',
      points: user.points || 0,
      courses: 0,
      resources: 0
    };

    return (
      <Layout t={t} heading={username} title={username} backUrl="/leaderboard">
        <StyledCard>
          <UserProfileCardContent t={t} {...userProfileProps} />
        </StyledCard>
      </Layout>
    );
  } else {
    return <NotFound t={t} title={t('titleUserNotFound')} />;
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
UserPage.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
  const { query, apolloClient } = ctx;
  const { userMe } = await useAuthSync(ctx);

  // Redirect to own profile if id matches logged in user.
  if (userMe && userMe.id === query.id) {
    return redirect(ctx, '/profile');
  }

  try {
    const { data } = await apolloClient.query({
      query: UserDocument,
      variables: { userId: query.id }
    });
    return { ...data, namespacesRequired: ['common'] };
  } catch {
    return { namespacesRequired: ['common'] };
  }
};

export default compose(withRedux, withApollo, withTranslation('common'))(UserPage);
