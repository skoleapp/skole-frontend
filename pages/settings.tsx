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
import { Router } from '../i18n';
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

const SettingsPage: NextPage = ({ t }: any) => {
  const { authenticated } = useSelector((state: State) => state.auth);
  const apolloClient = useApolloClient();
  const dispatch = useDispatch();

  const handleLanguageSelect = (value: string) => () => {
    i18n.changeLanguage(value);
    dispatch(openNotification(t('textLanguageSetTo') + ' ' + t(value)));
  };

  const handleRedirect = (href: string) => (): Promise<boolean> => Router.push(href);

  const renderMenuSubHeader = (text: string) => (
    <Box marginLeft="1rem">
      <Typography variant="subtitle1" align="left" color="textSecondary">
        {t(text)}
      </Typography>
    </Box>
  );

  const renderAccountMenuItems = menuItems.account.map((m, i) => (
    <MenuItem key={i} onClick={handleRedirect(m.href)}>
      {t(m.text)}
    </MenuItem>
  ));

  const renderLanguageMenuItems = menuItems.language.map((m, i) => (
    <MenuItem key={i} onClick={handleLanguageSelect(m.value)}>
      {t(m.value)}
    </MenuItem>
  ));

  const renderAboutMenuItems = menuItems.about.map((m, i) => (
    <MenuItem key={i} onClick={handleRedirect(m.href)}>
      {t(m.text)}
    </MenuItem>
  ));

  const renderLegalItems = menuItems.legal.map((m, i) => (
    <MenuItem key={i} onClick={handleRedirect(m.href)}>
      {t(m.text)}
    </MenuItem>
  ));

  const renderAuthenticatedMenuList = (
    <MenuList>
      {renderMenuSubHeader(t('headerAccount'))}
      {renderAccountMenuItems}
      <Divider />
      {renderMenuSubHeader(t('headerLanguage'))}
      {renderLanguageMenuItems}
      <Divider />
      {renderMenuSubHeader(t('headerAbout'))}
      {renderAboutMenuItems}
      <Divider />
      {renderMenuSubHeader(t('headerLegal'))}
      {renderLegalItems}
    </MenuList>
  );

  const renderUnAuthenticatedMenuList = (
    <MenuList>
      {renderMenuSubHeader(t('headerLanguage'))}
      {renderLanguageMenuItems}
      <Divider />
      {renderMenuSubHeader('Skole')}
      {renderAboutMenuItems}
      <Divider />
      {renderMenuSubHeader(t('headerLegal'))}
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
      {t('buttonLogin')}
    </Button>
  );

  const renderLogoutButton = (
    <Button
      fullWidth
      variant="outlined"
      color="primary"
      onClick={(): Promise<boolean> => dispatch(logout(apolloClient))}
    >
      {t('buttonLogin')}
    </Button>
  );

  return (
    <Layout t={t} heading="Settings" title="Settings" backUrl="/">
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
      text: 'buttonEditProfile',
      href: '/profile/edit'
    },
    {
      text: 'buttonChangePassword',
      href: '/profile/change-password'
    },
    {
      text: 'buttonDeleteAccount',
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
      value: 'sv'
    }
  ],
  about: [
    {
      text: 'buttonAbout',
      href: '/about'
    },
    {
      text: 'buttonContact',
      href: '/contact'
    }
  ],
  legal: [
    {
      text: 'buttonTerms',
      href: '/terms'
    },
    {
      text: 'buttonPrivacy',
      href: '/privacy'
    }
  ]
};

SettingsPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return { namespacesRequired: ['common'] };
};

export default compose(withRedux, withApollo, withTranslation('common'))(SettingsPage);
