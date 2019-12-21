import {
  Box,
  Button,
  CardContent,
  Divider,
  MenuItem,
  MenuList,
  Typography
} from '@material-ui/core';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch, useSelector } from 'react-redux';
import { deAuthenticate } from '../actions';
import { Layout, SlimCardContent, StyledCard } from '../components';
import { i18n, includeDefaultNamespaces, Router, useTranslation } from '../i18n';
import { I18nPage, I18nProps, SkoleContext, State } from '../interfaces';
import { useAuthSync } from '../utils';

const SettingsPage: I18nPage = () => {
  const { authenticated } = useSelector((state: State) => state.auth);
  const apolloClient = useApolloClient();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleLanguageSelect = (value: string) => () => {
    i18n.changeLanguage(value);
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
      {t(m.title)}
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
      {renderMenuSubHeader('settings:account')}
      {renderAccountMenuItems}
      <Divider />
      {renderMenuSubHeader('common:language')}
      {renderLanguageMenuItems}
      <Divider />
      {renderMenuSubHeader('common:about')}
      {renderAboutMenuItems}
      <Divider />
      {renderMenuSubHeader('common:legal')}
      {renderLegalItems}
    </MenuList>
  );

  const renderUnAuthenticatedMenuList = (
    <MenuList>
      {renderMenuSubHeader('common:language')}
      {renderLanguageMenuItems}
      <Divider />
      {renderMenuSubHeader('common:about')}
      {renderAboutMenuItems}
      <Divider />
      {renderMenuSubHeader('common:legal')}
      {renderLegalItems}
    </MenuList>
  );

  const renderSignInButton = (
    <Button
      fullWidth
      variant="outlined"
      color="primary"
      onClick={(): Promise<boolean> => Router.push('/auth/sign-in')}
    >
      {t('common:signIn')}
    </Button>
  );

  const renderSignOutButton = (
    <Button
      fullWidth
      variant="outlined"
      color="primary"
      onClick={(): Promise<boolean> => dispatch(deAuthenticate(apolloClient))}
    >
      {t('common:signOut')}
    </Button>
  );

  return (
    <Layout heading={t('settings:settings')} title={t('settings:settings')} backUrl>
      <StyledCard>
        <CardContent>
          {authenticated ? renderAuthenticatedMenuList : renderUnAuthenticatedMenuList}
        </CardContent>
        <Divider />
        <SlimCardContent>
          {authenticated ? renderSignOutButton : renderSignInButton}
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

const menuItems = {
  account: [
    {
      text: 'settings:editProfile',
      href: '/profile/edit'
    },
    {
      text: 'settings:changePassword',
      href: '/profile/change-password'
    },
    {
      text: 'settings:deleteAccount',
      href: '/profile/delete-account'
    }
  ],
  language: [
    {
      title: 'common:english',
      value: 'en'
    },
    {
      title: 'common:finnish',
      value: 'fi'
    },
    {
      title: 'common:swedish',
      value: 'sv'
    }
  ],
  about: [
    {
      text: 'common:about',
      href: '/about'
    },
    {
      text: 'common:contact',
      href: '/contact'
    }
  ],
  legal: [
    {
      text: 'common:terms',
      href: '/terms'
    },
    {
      text: 'common:privacy',
      href: '/privacy'
    }
  ]
};

SettingsPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
  await useAuthSync(ctx);

  return {
    namespacesRequired: includeDefaultNamespaces(['settings'])
  };
};

export default SettingsPage;
