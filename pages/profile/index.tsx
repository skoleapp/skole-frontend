import { Divider } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { useSelector } from 'react-redux';
import { compose } from 'redux';
import {
  ButtonLink,
  Layout,
  SlimCardContent,
  StyledCard,
  UserProfileCardContent
} from '../../components';
import { SkoleContext, State } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { usePrivatePage } from '../../utils';
import { withTranslation } from '../../i18n';

const ProfilePage: NextPage = () => {
  const { user } = useSelector((state: State) => state.auth);

  const userProfileProps = {
    username: user.username || 'Username N/A',
    avatar: user.avatar || '',
    title: user.title || 'Title N/A',
    bio: user.bio || 'Bio N/A',
    points: user.points || 0,
    courses: 0,
    resources: 0
  };

  return (
    <Layout heading="Profile" title="Profile" backUrl="/">
      <StyledCard>
        <UserProfileCardContent {...userProfileProps} />
        <Divider />
        <SlimCardContent>
          <ButtonLink href="/profile/edit" color="primary" variant="outlined" fullWidth>
            edit profile
          </ButtonLink>
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

ProfilePage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await usePrivatePage(ctx);
  return {};
};

export default compose(withRedux, withApollo, withTranslation('common'))(ProfilePage);
