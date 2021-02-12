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
import React from 'react';
import { SETTINGS_ITEMS, urls } from 'utils';

import { Link } from '../shared';

interface Props {
  dialog?: boolean;
}

export const SettingsList: React.FC<Props> = ({ dialog }) => {
  const { userMe, verified } = useAuthContext();
  const { darkMode, toggleDarkMode } = useDarkModeContext();
  const { handleCloseSettingsDialog } = useSettingsContext();
  const { isMobile } = useMediaQueries();
  const { t } = useTranslation();
  const { handleOpenLanguageMenu } = useLanguageContext();
  const { pathname } = useRouter();
  const handleMenuItemClick = (): void | false => !!dialog && handleCloseSettingsDialog();
  const getSelected = (href: string): boolean => !dialog && href === pathname;

  const handleLanguageClick = (): void => {
    handleCloseSettingsDialog();
    handleOpenLanguageMenu();
  };

  const renderAccountMenuItems = SETTINGS_ITEMS.account.map(({ icon: Icon, href, text }, i) => (
    <Link href={href} key={i}>
      <MenuItem onClick={handleMenuItemClick} selected={getSelected(href)}>
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText>{t(text)}</ListItemText>
      </MenuItem>
    </Link>
  ));

  const renderVerifyAccountMenuItem = verified === false && (
    <Link href={urls.verifyAccount}>
      <MenuItem onClick={handleMenuItemClick} selected={getSelected(urls.verifyAccount)}>
        <ListItemIcon>
          <VerifiedUserOutlined />
        </ListItemIcon>
        <ListItemText>{t('common:verifyAccount')}</ListItemText>
      </MenuItem>
    </Link>
  );

  const renderCommonAccountMenuItems = SETTINGS_ITEMS.commonAccount.map(
    ({ icon: Icon, href, text }, i) => (
      <Link href={href} key={i}>
        <MenuItem onClick={handleMenuItemClick} selected={getSelected(href)}>
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          <ListItemText>{t(text)}</ListItemText>
        </MenuItem>
      </Link>
    ),
  );

  const renderDarkModeMenuItem = isMobile && (
    <MenuItem onClick={toggleDarkMode}>
      <ListItemIcon>{darkMode ? <Brightness7Outlined /> : <Brightness6Outlined />}</ListItemIcon>
      <ListItemText>{t('common:toggleDarkMode')}</ListItemText>
    </MenuItem>
  );

  const renderAboutMenuItem = isMobile && (
    <Link href={urls.about}>
      <MenuItem onClick={handleMenuItemClick} selected={getSelected(urls.about)}>
        <ListItemIcon>
          <InfoOutlined />
        </ListItemIcon>
        <ListItemText>{t('common:about')}</ListItemText>
      </MenuItem>
    </Link>
  );

  const renderLanguageMenuItem = (
    <MenuItem onClick={handleLanguageClick}>
      <ListItemIcon>
        <LanguageOutlined />
      </ListItemIcon>
      <ListItemText>{t('common:changeLanguage')}</ListItemText>
    </MenuItem>
  );

  const renderLoginMenuItem = (
    <Link href={urls.login}>
      <MenuItem onClick={handleMenuItemClick}>
        <ListItemIcon>
          <ExitToAppOutlined />
        </ListItemIcon>
        <ListItemText>{t('common:login')}</ListItemText>
      </MenuItem>
    </Link>
  );

  const renderLogoutMenuItem = (
    <Link href={urls.logout}>
      <MenuItem onClick={handleMenuItemClick}>
        <ListItemIcon>
          <ExitToAppOutlined />
        </ListItemIcon>
        <ListItemText>{t('common:logout')}</ListItemText>
      </MenuItem>
    </Link>
  );

  const renderUnAuthenticatedMenuItems = (
    <List>
      {renderCommonAccountMenuItems}
      {renderLanguageMenuItem}
      {renderDarkModeMenuItem}
      {renderAboutMenuItem}
      {renderLoginMenuItem}
    </List>
  );

  const renderAuthenticatedMenuList = (
    <List>
      {renderAccountMenuItems}
      {renderVerifyAccountMenuItem}
      {renderLanguageMenuItem}
      {renderDarkModeMenuItem}
      {renderAboutMenuItem}
      {renderLogoutMenuItem}
    </List>
  );

  return (
    <Box flexGrow="1">{userMe ? renderAuthenticatedMenuList : renderUnAuthenticatedMenuItems}</Box>
  );
};
