import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import LinkOutlined from '@material-ui/icons/LinkOutlined';
import MailOutlined from '@material-ui/icons/MailOutlined';
import { useNotificationsContext, useShareContext } from 'context';
import { useTranslation } from 'lib';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';

import { Link, SocialMediaIcon } from '../shared';
import { ResponsiveDialog } from './ResponsiveDialog';

const useStyles = makeStyles({
  socialLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
});

export const ShareDialog: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { toggleNotification } = useNotificationsContext();
  const { asPath: _asPath } = useRouter();
  const asPath = _asPath.split('?')[0];

  const {
    shareDialogOpen,
    handleCloseShareDialog,
    shareDialogParams: { header, title, text, linkSuffix, customLink },
  } = useShareContext();

  const dialogHeaderProps = {
    onCancel: handleCloseShareDialog,
    text: header,
    emoji: '📤',
  };

  const url = customLink || `${process.env.FRONTEND_URL}${asPath}${linkSuffix}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`; // Does not work from localhost.
  const whatsAppUrl = `https://api.whatsapp.com/send?text=${url}`;
  const telegramUrl = `https://t.me/share/url?url=${url}&text=${text}`;
  const redditUrl = `https://www.reddit.com/submit?url=${url}&title=${title}`;
  const twitterUrl = `https://twitter.com/share?url=${url}&text=${text}`;

  const emailBody = `
${text}
${url}`;

  const mailUrl = `mailto:?subject=${title}&body=${encodeURIComponent(emailBody)}`;

  const shareEvent = (name: string): void => sa_event(`click_${name}_share_link`);
  const handleClickMenuItem = useCallback((name: string) => (): void => shareEvent(name), []);

  const handleClickCopyLink = useCallback((): void => {
    toggleNotification(t('common:linkCopied'));
    navigator.clipboard.writeText(url);
    handleCloseShareDialog();
    shareEvent('copy_link');
  }, [handleCloseShareDialog, t, toggleNotification, url]);

  const handleClickSeeAll = useCallback(async (): Promise<void> => {
    const { navigator } = window;

    if (!!navigator && !!navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch {
        // User cancelled.
      }
    }
  }, [text, title, url]);

  const socialMenuItems = useMemo(
    () => [
      {
        href: facebookUrl,
        name: 'facebook',
        text: 'sharing:facebook',
      },
      {
        href: whatsAppUrl,
        name: 'whatsapp',
        text: 'sharing:whatsapp',
      },
      {
        href: telegramUrl,
        name: 'telegram',
        text: 'sharing:telegram',
      },
      {
        href: redditUrl,
        name: 'reddit',
        text: 'sharing:reddit',
      },
      {
        href: twitterUrl,
        name: 'twitter',
        text: 'sharing:twitter',
      },
    ],
    [facebookUrl, redditUrl, telegramUrl, twitterUrl, whatsAppUrl],
  );

  const renderSocialMenuItems = useMemo(
    () =>
      socialMenuItems.map(({ href, name, text }, i) => (
        <Typography
          className={classes.socialLink}
          component="a"
          target="_blank"
          rel="noreferrer"
          href={href}
          key={i}
        >
          <MenuItem onClick={handleClickMenuItem(name)}>
            <ListItemIcon>
              <SocialMediaIcon name={name} />
            </ListItemIcon>
            <ListItemText>{t(text)}</ListItemText>
          </MenuItem>
        </Typography>
      )),
    [classes.socialLink, handleClickMenuItem, socialMenuItems, t],
  );

  const renderEmailMenuItem = useMemo(
    () => (
      <Link href={mailUrl} fullWidth>
        <MenuItem onClick={handleClickMenuItem('twitter')}>
          <ListItemIcon>
            <MailOutlined />
          </ListItemIcon>
          <ListItemText>{t('sharing:email')}</ListItemText>
        </MenuItem>
      </Link>
    ),
    [handleClickMenuItem, mailUrl, t],
  );

  const renderCopyLinkMenuItem = useMemo(
    () => (
      <MenuItem onClick={handleClickCopyLink}>
        <ListItemIcon>
          <LinkOutlined />
        </ListItemIcon>
        <ListItemText>{t('sharing:copyLink')}</ListItemText>
      </MenuItem>
    ),
    [handleClickCopyLink, t],
  );

  const renderSeeAllMenuItem = useMemo(
    () => (
      <MenuItem onClick={handleClickSeeAll}>
        <ListItemIcon>
          <ArrowForwardOutlined />
        </ListItemIcon>
        <ListItemText>{t('common:seeAll')}</ListItemText>
      </MenuItem>
    ),
    [handleClickSeeAll, t],
  );

  const renderDialogContent = useMemo(
    () => (
      <List>
        {renderSocialMenuItems}
        {renderEmailMenuItem}
        {renderCopyLinkMenuItem}
        {renderSeeAllMenuItem}
      </List>
    ),
    [renderCopyLinkMenuItem, renderEmailMenuItem, renderSeeAllMenuItem, renderSocialMenuItems],
  );

  return (
    <ResponsiveDialog
      open={shareDialogOpen}
      onClose={handleCloseShareDialog}
      dialogHeaderProps={dialogHeaderProps}
      list
    >
      {renderDialogContent}
    </ResponsiveDialog>
  );
};
