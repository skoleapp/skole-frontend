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
import { Router } from '../../i18n';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';
import { logout, openNotification } from '../actions';
import { Layout, SlimCardContent, StyledCard } from '../components';
import { SkoleContext, State } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync } from '../utils';
import { i18n, withTranslation } from '../i18n';

const SettingsPage: NextPage = ({ t }) => {
  const { authenticated } = useSelector((state: State) => state.auth);
  const apolloClient = useApolloClient();
  const dispatch = useDispatch();

  // TODO: Implement actual logic with cookies.
  const handleLanguageSelect = (value: string) => () => {
    i18n.changeLanguage(value);
    dispatch(openNotification(`Language set to ${t(value)}`));
  };

  const handleRedirect = (href: string) => (): Promise<boolean> => Router.push(href);

  const renderMenuSubHeader = (text: string) => (
    <Box marginLeft="1rem">
      <Typography variant="subtitle1" align="left" color="textSecondary">
        {text}
      </Typography>
    </Box>
  );

  const renderAccountMenuItems = menuItems.account.map((m, i) => (
    <MenuItem key={i} onClick={handleRedirect(m.href)}>
      {m.text}
    </MenuItem>
  ));

  const renderLanguageMenuItems = menuItems.language.map((m, i) => (
    <MenuItem key={i} onClick={handleLanguageSelect(m.value)}>
      {m.title}
    </MenuItem>
  ));

  const renderAboutMenuItems = menuItems.about.map((m, i) => (
    <MenuItem key={i} onClick={handleRedirect(m.href)}>
      {m.text}
    </MenuItem>
  ));

  const renderLegalItems = menuItems.legal.map((m, i) => (
    <MenuItem key={i} onClick={handleRedirect(m.href)}>
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
      <Divider />
      {renderMenuSubHeader('Legal')}
      {renderLegalItems}
    </MenuList>
  );

  const renderUnAuthenticatedMenuList = (
    <MenuList>
      {renderMenuSubHeader('Language')}
      {renderLanguageMenuItems}
      <Divider />
      {renderMenuSubHeader('About')}
      {renderAboutMenuItems}
      <Divider />
      {renderMenuSubHeader('Legal')}
      {renderLegalItems}
    </MenuList>
  );

  const renderLoginButton = (
    <Button
      fullWidth
      variant="outlined"
      color="primary"
      onClick={(): Promise<boolean> => Router.push('/auth/login')}
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
        <CardContent>
          {authenticated ? renderAuthenticatedMenuList : renderUnAuthenticatedMenuList}
        </CardContent>
        <Divider />
        <SlimCardContent>{authenticated ? renderLogoutButton : renderLoginButton}</SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

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
      title: 'English',
      value: 'en'
    },
    {
      title: 'Finnish',
      value: 'fi'
    },
    {
      title: 'Swedish',
      value: 'se'
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
  ],
  legal: [
    {
      text: 'Terms',
      href: '/terms'
    },
    {
      text: 'Privacy',
      href: '/privacy'
    }
  ]
};

SettingsPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return {};
};

export default compose(withRedux, withApollo, withTranslation('common'))(SettingsPage);
