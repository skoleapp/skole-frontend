import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import { useNotificationsContext, useShareContext } from 'context';
import { useTranslation } from 'lib';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Emoji, ExternalLink, ResponsiveDialog, SocialMediaIcon } from '../shared';

export const ShareDialog: React.FC = () => {
  const { t } = useTranslation();
  const { toggleNotification } = useNotificationsContext();
  const { asPath: _asPath } = useRouter();
  const asPath = _asPath.split('?')[0];

  const {
    shareDialogOpen,
    handleCloseShareDialog,
    shareParams: { shareHeader, shareTitle: title, shareText: text, linkSuffix, customLink },
  } = useShareContext();

  const dialogHeaderProps = {
    onCancel: handleCloseShareDialog,
    text: shareHeader,
    emoji: '📤',
  };

  const url = customLink || `${process.env.FRONTEND_URL}${asPath}${linkSuffix}`;
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
          <SocialMediaIcon name="facebook" />
        </ListItemIcon>
        <ListItemText>{t('sharing:facebook')}</ListItemText>
      </MenuItem>
    </ExternalLink>
  );

  const renderWhatsAppMenuItem = (
    <ExternalLink href={whatsAppUrl}>
      <MenuItem>
        <ListItemIcon>
          <SocialMediaIcon name="whatsapp" />
        </ListItemIcon>
        <ListItemText>{t('sharing:whatsapp')}</ListItemText>
      </MenuItem>
    </ExternalLink>
  );

  const renderTelegramMenuItem = (
    <ExternalLink href={telegramUrl}>
      <MenuItem>
        <ListItemIcon>
          <SocialMediaIcon name="telegram" />
        </ListItemIcon>
        <ListItemText>{t('sharing:telegram')}</ListItemText>
      </MenuItem>
    </ExternalLink>
  );

  const renderRedditMenuItem = (
    <ExternalLink href={redditUrl}>
      <MenuItem>
        <ListItemIcon>
          <SocialMediaIcon name="reddit" />
        </ListItemIcon>
        <ListItemText>{t('sharing:reddit')}</ListItemText>
      </MenuItem>
    </ExternalLink>
  );

  const renderTwitterMenuItem = (
    <ExternalLink href={twitterUrl}>
      <MenuItem>
        <ListItemIcon>
          <SocialMediaIcon name="twitter" />
        </ListItemIcon>
        <ListItemText>{t('sharing:twitter')}</ListItemText>
      </MenuItem>
    </ExternalLink>
  );

  const renderEmailMenuItem = (
    <Link href={mailUrl}>
      <MenuItem>
        <ListItemIcon>
          <Emoji emoji="📧" noSpace />
        </ListItemIcon>
        <ListItemText>{t('sharing:email')}</ListItemText>
      </MenuItem>
    </Link>
  );

  const renderCopyLinkMenuItem = (
    <MenuItem onClick={handleClickCopyLink}>
      <ListItemIcon>
        <Emoji emoji="🔗" noSpace />
      </ListItemIcon>
      <ListItemText>{t('sharing:copyLink')}</ListItemText>
    </MenuItem>
  );

  const renderSeeAllMenuItem = (
    <MenuItem onClick={handleClickSeeAll}>
      <ListItemIcon>
        <Emoji emoji="👉" noSpace />
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
      list
    >
      {renderDialogContent}
    </ResponsiveDialog>
  );
};
