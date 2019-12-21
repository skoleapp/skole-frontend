import { Divider } from '@material-ui/core';
import { NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  ButtonLink,
  Layout,
  NotFound,
  SlimCardContent,
  StyledCard,
  UserProfileCardContent
} from '../../components';
import { SkoleContext, State } from '../../interfaces';
import { usePrivatePage } from '../../utils';

const ProfilePage: NextPage = () => {
  const { user } = useSelector((state: State) => state.auth);

  if (user) {
    const userProfileProps = {
      username: user.username || 'Username N/A',
      avatar: user.avatar,
      title: user.title || 'Title N/A',
      bio: user.bio || 'Bio N/A',
      points: R.propOr('N/A', 'points', user) as number | string,
      courseCount: R.propOr('N/A', 'courseCount', user) as number | string,
      resourceCount: R.propOr('N/A', 'resourceCount', user) as number | string
    };

    return (
      <Layout heading="Profile" title="Profile" backUrl>
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
  } else {
    return <NotFound title="Profile not found..." />;
  }
};

ProfilePage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await usePrivatePage(ctx);
  return {};
};

export default ProfilePage;
