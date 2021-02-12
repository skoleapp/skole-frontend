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
import React from 'react';

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
  const { asPath: _asPath, pathname } = useRouter();
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

  const getPage = () => {
    switch (pathname) {
      case '/': {
        return 'landing_page';
      }

      case '/courses/[slug]': {
        return 'course_page';
      }

      case '/resources/[slug]': {
        return 'resource_page';
      }

      case '/schools/[slug]': {
        return 'school_page';
      }
    }
  };

  const shareEvent = (name: string) => sa_event(`click_${name}_share_link_from_${getPage()}`);
  const handleClickMenuItem = (name: string) => () => shareEvent(name);

  const handleClickCopyLink = () => {
    toggleNotification(t('notifications:linkCopied'));
    navigator.clipboard.writeText(url);
    handleCloseShareDialog();
    shareEvent('copy_link');
  };

  const handleClickSeeAll = async (): Promise<void> => {
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
  };

  const socialMenuItems = [
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
  ];

  const renderSocialMenuItems = socialMenuItems.map(({ href, name, text }, i) => (
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
  ));

  const renderEmailMenuItem = (
    <Link href={mailUrl}>
      <MenuItem onClick={handleClickMenuItem('twitter')}>
        <ListItemIcon>
          <MailOutlined />
        </ListItemIcon>
        <ListItemText>{t('sharing:email')}</ListItemText>
      </MenuItem>
    </Link>
  );

  const renderCopyLinkMenuItem = (
    <MenuItem onClick={handleClickCopyLink}>
      <ListItemIcon>
        <LinkOutlined />
      </ListItemIcon>
      <ListItemText>{t('sharing:copyLink')}</ListItemText>
    </MenuItem>
  );

  const renderSeeAllMenuItem = (
    <MenuItem onClick={handleClickSeeAll}>
      <ListItemIcon>
        <ArrowForwardOutlined />
      </ListItemIcon>
      <ListItemText>{t('sharing:seeAll')}</ListItemText>
    </MenuItem>
  );

  const renderDialogContent = (
    <List>
      {renderSocialMenuItems}
      {renderEmailMenuItem}
      {renderCopyLinkMenuItem}
      {renderSeeAllMenuItem}
    </List>
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
