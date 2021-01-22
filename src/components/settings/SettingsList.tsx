import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import VerifiedUserOutlined from '@material-ui/icons/VerifiedUserOutlined';
import { useAuthContext, useLanguageContext, useSettingsContext } from 'context';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { SETTINGS_ITEMS, urls } from 'utils';

import { Emoji } from '../shared';

interface Props {
  dialog?: boolean;
}

export const SettingsList: React.FC<Props> = ({ dialog }) => {
  const { userMe, verified } = useAuthContext();
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

  const renderAccountMenuItems = SETTINGS_ITEMS.account.map(({ emoji, href, text }, i) => (
    <Link href={href} key={i}>
      <MenuItem onClick={handleMenuItemClick} selected={getSelected(href)}>
        <ListItemIcon>
          <Emoji emoji={emoji} />
        </ListItemIcon>
        <ListItemText>{t(text)}</ListItemText>
      </MenuItem>
    </Link>
  ));

  const renderVerifyAccountMenuItem = verified === false && (
    <Link href={urls.verifyAccount}>
      <MenuItem onClick={handleMenuItemClick} selected={getSelected(urls.verifyAccount)}>
        <ListItemIcon>
          <Emoji emoji="✅" />
        </ListItemIcon>
        <ListItemText>{t('common:verifyAccount')}</ListItemText>
      </MenuItem>
    </Link>
  );

  const renderCommonAccountMenuItems = SETTINGS_ITEMS.commonAccount.map(
    ({ emoji, href, text }, i) => (
      <Link href={href} key={i}>
        <MenuItem onClick={handleMenuItemClick} selected={getSelected(href)}>
          <ListItemIcon>
            <Emoji emoji={emoji} />
          </ListItemIcon>
          <ListItemText>{t(text)}</ListItemText>
        </MenuItem>
      </Link>
    ),
  );

  const renderAboutMenuItem = isMobile && (
    <Link href={urls.about}>
      <MenuItem onClick={handleMenuItemClick} selected={getSelected(urls.about)}>
        <ListItemIcon>
          <Emoji emoji="ℹ️" />
        </ListItemIcon>
        <ListItemText>{t('common:about')}</ListItemText>
      </MenuItem>
    </Link>
  );

  const renderLanguageMenuItem = (
    <MenuItem onClick={handleLanguageClick}>
      <ListItemIcon>
        <Emoji emoji="🌐" />
      </ListItemIcon>
      <ListItemText>{t('common:changeLanguage')}</ListItemText>
    </MenuItem>
  );

  const renderLoginMenuItem = (
    <Link href={urls.login}>
      <MenuItem onClick={handleMenuItemClick}>
        <ListItemIcon>
          <Emoji emoji="👋" />
        </ListItemIcon>
        <ListItemText>{t('common:login')}</ListItemText>
      </MenuItem>
    </Link>
  );

  const renderLogoutMenuItem = (
    <Link href={urls.logout}>
      <MenuItem onClick={handleMenuItemClick}>
        <ListItemIcon>
          <Emoji emoji="👋" />
        </ListItemIcon>
        <ListItemText>{t('common:logout')}</ListItemText>
      </MenuItem>
    </Link>
  );

  const renderUnAuthenticatedMenuItems = (
    <List>
      {renderCommonAccountMenuItems}
      {renderLanguageMenuItem}
      {renderAboutMenuItem}
      {renderLoginMenuItem}
    </List>
  );

  const renderAuthenticatedMenuList = (
    <List>
      {renderAccountMenuItems}
      {renderVerifyAccountMenuItem}
      {renderLanguageMenuItem}
      {renderAboutMenuItem}
      {renderLogoutMenuItem}
    </List>
  );

  return (
    <Box flexGrow="1">{userMe ? renderAuthenticatedMenuList : renderUnAuthenticatedMenuItems}</Box>
  );
};
