import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Brightness6Outlined from '@material-ui/icons/Brightness6Outlined';
import Brightness7Outlined from '@material-ui/icons/Brightness7Outlined';
import ExitToAppOutlined from '@material-ui/icons/ExitToAppOutlined';
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import LanguageOutlined from '@material-ui/icons/LanguageOutlined';
import VerifiedUserOutlined from '@material-ui/icons/VerifiedUserOutlined';
import {
  useAuthContext,
  useDarkModeContext,
  useLanguageContext,
  useSettingsContext,
} from 'context';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { SETTINGS_ITEMS, urls } from 'utils';

import { Link } from './Link';

interface Props {
  dialog?: boolean;
}

export const SettingsList: React.FC<Props> = ({ dialog }) => {
  const { userMe, verified } = useAuthContext();
  const { darkMode, toggleDarkMode } = useDarkModeContext();
  const { handleCloseSettingsDialog } = useSettingsContext();
  const { smDown } = useMediaQueries();
  const { t } = useTranslation();
  const { handleOpenLanguageMenu } = useLanguageContext();
  const { pathname } = useRouter();

  const handleMenuItemClick = useCallback(
    (): void | false => !!dialog && handleCloseSettingsDialog(),
    [dialog, handleCloseSettingsDialog],
  );

  const getSelected = useCallback((href: string): boolean => !dialog && href === pathname, [
    dialog,
    pathname,
  ]);

  const handleLanguageClick = useCallback((): void => {
    handleCloseSettingsDialog();
    handleOpenLanguageMenu();
  }, [handleCloseSettingsDialog, handleOpenLanguageMenu]);

  const renderAccountMenuItems = useMemo(
    () =>
      SETTINGS_ITEMS.account.map(({ icon: Icon, href, text }, i) => (
        <Link href={href} key={i} fullWidth>
          <MenuItem onClick={handleMenuItemClick} selected={getSelected(href)}>
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText>{t(text)}</ListItemText>
          </MenuItem>
        </Link>
      )),
    [getSelected, handleMenuItemClick, t],
  );

  const renderVerifyAccountMenuItem = useMemo(
    () =>
      verified === false && (
        <Link href={urls.verifyAccount} fullWidth>
          <MenuItem onClick={handleMenuItemClick} selected={getSelected(urls.verifyAccount)}>
            <ListItemIcon>
              <VerifiedUserOutlined />
            </ListItemIcon>
            <ListItemText>{t('common:verifyAccount')}</ListItemText>
          </MenuItem>
        </Link>
      ),
    [getSelected, handleMenuItemClick, t, verified],
  );

  const renderCommonAccountMenuItems = useMemo(
    () =>
      SETTINGS_ITEMS.commonAccount.map(({ icon: Icon, href, text }, i) => (
        <Link href={href} key={i} fullWidth>
          <MenuItem onClick={handleMenuItemClick} selected={getSelected(href)}>
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText>{t(text)}</ListItemText>
          </MenuItem>
        </Link>
      )),
    [getSelected, handleMenuItemClick, t],
  );

  const renderDarkModeMenuItem = useMemo(
    () =>
      smDown && (
        <MenuItem onClick={toggleDarkMode}>
          <ListItemIcon>
            {darkMode ? <Brightness7Outlined /> : <Brightness6Outlined />}
          </ListItemIcon>
          <ListItemText>{t('common:toggleDarkMode')}</ListItemText>
        </MenuItem>
      ),
    [darkMode, smDown, t, toggleDarkMode],
  );

  const renderAboutMenuItem = useMemo(
    () =>
      smDown && (
        <Link href={urls.about} fullWidth>
          <MenuItem onClick={handleMenuItemClick} selected={getSelected(urls.about)}>
            <ListItemIcon>
              <InfoOutlined />
            </ListItemIcon>
            <ListItemText>{t('common:about')}</ListItemText>
          </MenuItem>
        </Link>
      ),
    [getSelected, handleMenuItemClick, smDown, t],
  );

  const renderLanguageMenuItem = useMemo(
    () => (
      <MenuItem onClick={handleLanguageClick}>
        <ListItemIcon>
          <LanguageOutlined />
        </ListItemIcon>
        <ListItemText>{t('common:changeLanguage')}</ListItemText>
      </MenuItem>
    ),
    [handleLanguageClick, t],
  );

  const renderLoginMenuItem = useMemo(
    () => (
      <Link href={urls.login} fullWidth>
        <MenuItem onClick={handleMenuItemClick}>
          <ListItemIcon>
            <ExitToAppOutlined />
          </ListItemIcon>
          <ListItemText>{t('common:login')}</ListItemText>
        </MenuItem>
      </Link>
    ),
    [handleMenuItemClick, t],
  );

  const renderLogoutMenuItem = useMemo(
    () => (
      <Link href={urls.logout} fullWidth>
        <MenuItem onClick={handleMenuItemClick}>
          <ListItemIcon>
            <ExitToAppOutlined />
          </ListItemIcon>
          <ListItemText>{t('common:logout')}</ListItemText>
        </MenuItem>
      </Link>
    ),
    [handleMenuItemClick, t],
  );

  const renderUnAuthenticatedMenuItems = useMemo(
    () => (
      <List>
        {renderCommonAccountMenuItems}
        {renderLanguageMenuItem}
        {renderDarkModeMenuItem}
        {renderAboutMenuItem}
        {renderLoginMenuItem}
      </List>
    ),
    [
      renderAboutMenuItem,
      renderCommonAccountMenuItems,
      renderDarkModeMenuItem,
      renderLanguageMenuItem,
      renderLoginMenuItem,
    ],
  );

  const renderAuthenticatedMenuList = useMemo(
    () => (
      <List>
        {renderAccountMenuItems}
        {renderVerifyAccountMenuItem}
        {renderLanguageMenuItem}
        {renderDarkModeMenuItem}
        {renderAboutMenuItem}
        {renderLogoutMenuItem}
      </List>
    ),
    [
      renderAboutMenuItem,
      renderAccountMenuItems,
      renderDarkModeMenuItem,
      renderLanguageMenuItem,
      renderLogoutMenuItem,
      renderVerifyAccountMenuItem,
    ],
  );

  return (
    <Box flexGrow="1">{userMe ? renderAuthenticatedMenuList : renderUnAuthenticatedMenuItems}</Box>
  );
};
