import { useTranslation } from 'lib';
import { useNotificationsContext, useShareContext } from 'context';
import React from 'react';
import { List, ListItemIcon, ListItemText, MenuItem } from '@material-ui/core';
import {
  ArrowForwardOutlined,
  EmailOutlined,
  Facebook,
  LinkOutlined,
  Reddit,
  Telegram,
  Twitter,
  WhatsApp,
} from '@material-ui/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMediaQueries } from 'hooks';
import { ExternalLink, ResponsiveDialog } from '../shared';

export const ShareDialog: React.FC = () => {
  const { t } = useTranslation();
  const { toggleNotification } = useNotificationsContext();
  const { asPath } = useRouter();
  const { isMobile } = useMediaQueries();

  const {
    shareDialogOpen,
    handleCloseShareDialog,
    shareParams: { shareTitle: title, shareText: text },
  } = useShareContext();

  const dialogHeaderProps = {
    onCancel: handleCloseShareDialog,
    text: t('common:share'),
  };

  const url = `${process.env.FRONTEND_URL}${asPath}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`; // Does not work from localhost.
  const whatsAppUrl = `https://api.whatsapp.com/send?text=${title}: ${url}`;
  const telegramUrl = `https://t.me/share/url?url=${url}&text=${text}`; // TODO: Ensure this works on QA, this is from: https://core.telegram.org/widgets/share#custom-buttons
  const redditUrl = `https://www.reddit.com/submit?url=${url}&title=${title}`;
  const twitterUrl = `https://twitter.com/share?url=${url}&text=${text}`;
  const mailUrl = `mailto:?subject=${title}&body=${text}: ${url}`;

  const handleClickCopyLink = () => {
    toggleNotification(t('notifications:linkCopied'));
    navigator.clipboard.writeText(url);
    handleCloseShareDialog();
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

  const renderFacebookMenuItem = (
    <ExternalLink href={facebookUrl}>
      <MenuItem>
        <ListItemIcon>
          <Facebook />
        </ListItemIcon>
        <ListItemText>{t('sharing:facebook')}</ListItemText>
      </MenuItem>
    </ExternalLink>
  );

  const renderWhatsAppMenuItem = (
    <Link href={whatsAppUrl}>
      <MenuItem>
        <ListItemIcon>
          <WhatsApp />
        </ListItemIcon>
        <ListItemText>{t('sharing:whatsapp')}</ListItemText>
      </MenuItem>
    </Link>
  );

  const renderTelegramMenuItem = (
    <ExternalLink href={telegramUrl}>
      <MenuItem>
        <ListItemIcon>
          <Telegram />
        </ListItemIcon>
        <ListItemText>{t('sharing:telegram')}</ListItemText>
      </MenuItem>
    </ExternalLink>
  );

  const renderRedditMenuItem = (
    <ExternalLink href={redditUrl}>
      <MenuItem>
        <ListItemIcon>
          <Reddit />
        </ListItemIcon>
        <ListItemText>{t('sharing:reddit')}</ListItemText>
      </MenuItem>
    </ExternalLink>
  );

  const renderTwitterMenuItem = (
    <ExternalLink href={twitterUrl}>
      <MenuItem>
        <ListItemIcon>
          <Twitter />
        </ListItemIcon>
        <ListItemText>{t('sharing:twitter')}</ListItemText>
      </MenuItem>
    </ExternalLink>
  );

  const renderEmailMenuItem = (
    <Link href={mailUrl}>
      <MenuItem>
        <ListItemIcon>
          <EmailOutlined />
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

  const renderSeeAllMenuItem = isMobile && (
    <MenuItem onClick={handleClickSeeAll}>
      <ListItemIcon>
        <ArrowForwardOutlined />
      </ListItemIcon>
      <ListItemText>{t('sharing:seeAll')}</ListItemText>
    </MenuItem>
  );

  const renderDialogContent = (
    <List>
      {renderFacebookMenuItem}
      {renderWhatsAppMenuItem}
      {renderTwitterMenuItem}
      {renderTelegramMenuItem}
      {renderRedditMenuItem}
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
    >
      {renderDialogContent}
    </ResponsiveDialog>
  );
};
