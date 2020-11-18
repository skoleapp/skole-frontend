import {
  Box,
  List,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from '@material-ui/core';
import {
  ExitToAppOutlined,
  HowToRegOutlined,
  LanguageOutlined,
  VerifiedUserOutlined,
} from '@material-ui/icons';
import { useAuthContext, useSettingsContext } from 'context';
import { useTranslation } from 'lib';
import Router, { useRouter } from 'next/router';
import React from 'react';
import { SettingsContextType } from 'types';
import { MENU_ITEMS, urls } from 'utils';

import { useLanguageSelector } from './useLanguageSelector';

interface UseSettings extends SettingsContextType {
  renderSettingsMenuList: JSX.Element;
}

// A hook for rendering the common settings menu components.
// The modal prop indicates whether this hook is used with the modal or with the settings layout.
export const useSettings = (modal: boolean): UseSettings => {
  const { userMe, verified } = useAuthContext();
  const { settingsOpen, toggleSettings } = useSettingsContext();
  const { t } = useTranslation();
  const { pathname } = useRouter();
  const { openLanguageMenu } = useLanguageSelector();

  const handleClose = (): void => {
    toggleSettings(false);
  };

  const handleMenuItemClick = (href: string) => async (): Promise<void> => {
    modal && handleClose();
    await Router.push(href);
  };

  const getSelected = (href: string): boolean => !modal && href === pathname;

  const handleLanguageClick = (): void => {
    handleClose();
    openLanguageMenu();
  };

  const renderAccountMenuItems = MENU_ITEMS.account.map(
    ({ icon: Icon, href, text }, i) => (
      <MenuItem
        key={i}
        onClick={handleMenuItemClick(href)}
        selected={getSelected(href)}
      >
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText>{t(text)}</ListItemText>
      </MenuItem>
    )
  );

  const renderVerifyAccountMenuItem = verified === false && (
    <MenuItem
      onClick={handleMenuItemClick(urls.verifyAccount)}
      selected={getSelected(urls.verifyAccount)}
    >
      <ListItemIcon>
        <VerifiedUserOutlined />
      </ListItemIcon>
      <ListItemText>{t('common:verifyAccount')}</ListItemText>
    </MenuItem>
  );

  const renderCommonAccountMenuItems = MENU_ITEMS.commonAccount.map(
    ({ icon: Icon, href, text }, i) => (
      <MenuItem
        key={i}
        onClick={handleMenuItemClick(href)}
        selected={getSelected(href)}
      >
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText>{t(text)}</ListItemText>
      </MenuItem>
    )
  );

  const renderAboutMenuItems = MENU_ITEMS.about.map(
    ({ icon: Icon, href, text }, i) => (
      <MenuItem
        key={i}
        onClick={handleMenuItemClick(href)}
        selected={getSelected(href)}
      >
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText>{t(text)}</ListItemText>
      </MenuItem>
    )
  );

  const renderLegalItems = MENU_ITEMS.legal.map(
    ({ icon: Icon, href, text }, i) => (
      <MenuItem
        key={i}
        onClick={handleMenuItemClick(href)}
        selected={getSelected(href)}
      >
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText>{t(text)}</ListItemText>
      </MenuItem>
    )
  );

  const renderLanguageMenuItem = (
    <MenuItem onClick={handleLanguageClick}>
      <ListItemIcon>
        <LanguageOutlined />
      </ListItemIcon>
      <ListItemText>{t('common:language')}</ListItemText>
    </MenuItem>
  );

  const renderLoginMenuItem = (
    <MenuItem onClick={handleMenuItemClick(urls.login)}>
      <ListItemIcon>
        <HowToRegOutlined />
      </ListItemIcon>
      <ListItemText>{t('common:login')}</ListItemText>
    </MenuItem>
  );

  const renderLogoutMenuItem = (
    <MenuItem onClick={handleMenuItemClick(urls.logout)}>
      <ListItemIcon>
        <ExitToAppOutlined />
      </ListItemIcon>
      <ListItemText>{t('common:logout')}</ListItemText>
    </MenuItem>
  );

  const renderCommonMenuItems = (
    <List>
      {renderCommonAccountMenuItems}
      {renderLanguageMenuItem}
      {renderAboutMenuItems}
      {renderLegalItems}
      {renderLoginMenuItem}
    </List>
  );

  const renderAuthenticatedMenuList = (
    <List>
      {renderAccountMenuItems}
      {renderVerifyAccountMenuItem}
      {renderLanguageMenuItem}
      {renderAboutMenuItems}
      {renderLegalItems}
      {renderLogoutMenuItem}
    </List>
  );

  const renderSettingsMenuList = (
    <Box flexGrow="1">
      {userMe ? renderAuthenticatedMenuList : renderCommonMenuItems}
    </Box>
  );

  return { renderSettingsMenuList, settingsOpen, toggleSettings };
};
