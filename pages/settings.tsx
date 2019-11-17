import { Button, Divider, MenuItem, MenuList } from '@material-ui/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../actions';
import { StyledCard } from '../components';
import { Layout } from '../containers';
import { State } from '../interfaces';
import { withAuthSync } from '../utils';

const SettingsPage: NextPage = () => {
  const { authenticated } = useSelector((state: State) => state.auth);
  const dispatch = useDispatch();
  const apolloClient = useApolloClient();
  const router = useRouter();

  const renderFeedbackMenuItem = (
    <MenuItem onClick={(): Promise<boolean> => router.push('/feedback')}>Feedback</MenuItem>
  );

  const renderAboutMenuItem = (
    <MenuItem onClick={(): Promise<boolean> => router.push('/about')}>About</MenuItem>
  );

  const renderEditProfileMenuItem = (
    <MenuItem onClick={(): Promise<boolean> => router.push('/profile/edit')}>Edit Profile</MenuItem>
  );

  const renderChangePasswordMenuItem = (
    <MenuItem onClick={(): Promise<boolean> => router.push('/profile/change-password')}>
      Change Password
    </MenuItem>
  );

  const renderAuthenticatedMenuList = (
    <MenuList>
      {renderChangePasswordMenuItem}
      {renderEditProfileMenuItem}
      {renderFeedbackMenuItem}
      {renderAboutMenuItem}
    </MenuList>
  );

  const renderUnAuthenticatedMenuList = (
    <MenuList>
      {renderFeedbackMenuItem}
      {renderAboutMenuItem}
    </MenuList>
  );

  const renderLoginButton = (
    <Button
      fullWidth
      variant="outlined"
      color="primary"
      onClick={(): Promise<boolean> => router.push('/login')}
    >
      login
    </Button>
  );

  const renderLogoutButton = (
    <Button
      fullWidth
      variant="outlined"
      color="primary"
      onClick={(): Promise<boolean> => dispatch(logout(apolloClient))}
    >
      logout
    </Button>
  );

  return (
    <Layout heading="Settings" title="Settings" backUrl="/">
      <StyledCard>
        {authenticated ? renderAuthenticatedMenuList : renderUnAuthenticatedMenuList}
        <Divider />
        {authenticated ? renderLogoutButton : renderLoginButton}
      </StyledCard>
    </Layout>
  );
};

export default withAuthSync(SettingsPage);
