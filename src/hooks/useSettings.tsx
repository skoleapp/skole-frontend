import { Box, List, ListItemIcon, ListItemText, MenuItem } from '@material-ui/core';
import {
  ExitToAppOutlined,
  HowToRegOutlined,
  LanguageOutlined,
  VerifiedUserOutlined,
} from '@material-ui/icons';
import { useAuthContext, useLanguageContext, useSettingsContext } from 'context';
import { useTranslation } from 'lib';
import Router, { useRouter } from 'next/router';
import React from 'react';
import { SettingsContextType } from 'types';
import { SETTINGS_ITEMS, urls } from 'utils';

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
  const { handleOpenLanguageMenu } = useLanguageContext();

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
    handleOpenLanguageMenu();
  };

  const renderAccountMenuItems = SETTINGS_ITEMS.account.map(({ icon: Icon, href, text }, i) => (
    <MenuItem key={i} onClick={handleMenuItemClick(href)} selected={getSelected(href)}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText>{t(text)}</ListItemText>
    </MenuItem>
  ));

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

  const renderCommonAccountMenuItems = SETTINGS_ITEMS.commonAccount.map(
    ({ icon: Icon, href, text }, i) => (
      <MenuItem key={i} onClick={handleMenuItemClick(href)} selected={getSelected(href)}>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText>{t(text)}</ListItemText>
      </MenuItem>
    ),
  );

  const renderCommonMenuItems = SETTINGS_ITEMS.common.map(({ icon: Icon, href, text }, i) => (
    <MenuItem key={i} onClick={handleMenuItemClick(href)} selected={getSelected(href)}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText>{t(text)}</ListItemText>
    </MenuItem>
  ));

  const renderLanguageMenuItem = (
    <MenuItem onClick={handleLanguageClick}>
      <ListItemIcon>
        <LanguageOutlined />
      </ListItemIcon>
      <ListItemText>{t('common:changeLanguage')}</ListItemText>
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

  const renderUnAuthenticatedMenuItems = (
    <List>
      {renderCommonAccountMenuItems}
      {renderLanguageMenuItem}
      {renderCommonMenuItems}
      {renderLoginMenuItem}
    </List>
  );

  const renderAuthenticatedMenuList = (
    <List>
      {renderAccountMenuItems}
      {renderVerifyAccountMenuItem}
      {renderLanguageMenuItem}
      {renderCommonMenuItems}
      {renderLogoutMenuItem}
    </List>
  );

  const renderSettingsMenuList = (
    <Box flexGrow="1">{userMe ? renderAuthenticatedMenuList : renderUnAuthenticatedMenuItems}</Box>
  );

  return { renderSettingsMenuList, settingsOpen, toggleSettings };
};
