import {
  Box,
  Button,
  CardContent,
  Divider,
  MenuItem,
  MenuList,
  Typography
} from '@material-ui/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';
import { logout, openNotification } from '../actions';
import { Layout, StyledCard } from '../components';
import { SkoleContext, State } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync } from '../utils';

const menuItems = {
  account: [
    {
      text: 'Edit Profile',
      href: '/profile/edit'
    },
    {
      text: 'Change Password',
      href: '/profile/change-password'
    },
    {
      text: 'Delete Account',
      href: '/profile/delete-account'
    }
  ],
  language: [
    {
      value: 'English'
    },
    {
      value: 'Finnish'
    },
    {
      value: 'Swedish'
    }
  ],
  about: [
    {
      text: 'About',
      href: '/about'
    },
    {
      text: 'Contact',
      href: '/contact'
    }
  ]
};

const SettingsPage: NextPage = () => {
  const { authenticated } = useSelector((state: State) => state.auth);
  const apolloClient = useApolloClient();
  const router = useRouter();
  const dispatch = useDispatch();

  // TODO: Implement actual logic with cookies.
  const handleLanguageSelect = (value: string) => () => {
    dispatch(openNotification(`Language set to ${value}`));
  };

  const renderMenuSubHeader = (text: string) => (
    <Box marginLeft="1rem">
      <Typography variant="subtitle1" align="left" color="textSecondary">
        {text}
      </Typography>
    </Box>
  );

  const renderAccountMenuItems = menuItems.account.map((m, i) => (
    <MenuItem key={i} onClick={(): Promise<boolean> => router.push(m.href)}>
      {m.text}
    </MenuItem>
  ));

  const renderLanguageMenuItems = menuItems.language.map((m, i) => (
    <MenuItem key={i} onClick={handleLanguageSelect(m.value)}>
      {m.value}
    </MenuItem>
  ));

  const renderAboutMenuItems = menuItems.about.map((m, i) => (
    <MenuItem key={i} onClick={(): Promise<boolean> => router.push(m.href)}>
      {m.text}
    </MenuItem>
  ));

  const renderAuthenticatedMenuList = (
    <MenuList>
      {renderMenuSubHeader('Account')}
      {renderAccountMenuItems}
      <Divider />
      {renderMenuSubHeader('Language')}
      {renderLanguageMenuItems}
      <Divider />
      {renderMenuSubHeader('About')}
      {renderAboutMenuItems}
    </MenuList>
  );

  const renderUnAuthenticatedMenuList = (
    <MenuList>
      {renderMenuSubHeader('Language')}
      {renderLanguageMenuItems}
      <Divider />
      {renderMenuSubHeader('About')}
      {renderAboutMenuItems}
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
      <StyledSettings>
        <CardContent>
          {authenticated ? renderAuthenticatedMenuList : renderUnAuthenticatedMenuList}
        </CardContent>
        <Divider />
        <CardContent>{authenticated ? renderLogoutButton : renderLoginButton}</CardContent>
      </StyledSettings>
    </Layout>
  );
};

const StyledSettings = styled(StyledCard)`
  .MuiList-root {
    outline: none;
  }
`;

SettingsPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return {};
};

export default compose(withRedux, withApollo)(SettingsPage);
