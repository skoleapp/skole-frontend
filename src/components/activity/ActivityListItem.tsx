import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useNotificationsContext } from 'context';
import {
  ActivityObjectType,
  MarkActivityAsReadMutation,
  useMarkActivityAsReadMutation,
} from 'generated';
import { useLanguageHeaderContext } from 'hooks';
import { useTranslation } from 'lib';
import Router from 'next/router';
import * as R from 'ramda';
import React, { useMemo, useState } from 'react';
import { mediaUrl, urls } from 'utils';

import { BadgeTierIcon, TextLink } from '../shared';

const useStyles = makeStyles({
  unread: {
    backgroundColor: 'rgba(173, 54, 54, 0.25)',
    '&:hover': {
      backgroundColor: 'rgba(173, 54, 54, 0.20)',
    },
  },
});

interface Props {
  activity: ActivityObjectType;
}

export const ActivityListItem: React.FC<Props> = ({
  activity: { id, causingUser, comment, badgeProgress, read: initialRead, description },
}) => {
  const classes = useStyles();
  const [read, setRead] = useState(initialRead);
  const { toggleUnexpectedErrorNotification } = useNotificationsContext();
  const context = useLanguageHeaderContext();
  const { t } = useTranslation();
  const avatarThumbnail = R.prop('avatarThumbnail', causingUser);

  const onCompleted = ({ markActivityAsRead }: MarkActivityAsReadMutation): void => {
    if (markActivityAsRead?.errors?.length) {
      toggleUnexpectedErrorNotification();
    } else if (markActivityAsRead?.activity?.read != null) {
      setRead(markActivityAsRead.activity.read);
    } else {
      toggleUnexpectedErrorNotification();
    }
  };

  const [markSingleActivityRead] = useMarkActivityAsReadMutation({
    onCompleted,
    onError: toggleUnexpectedErrorNotification,
    context,
  });

  const handleClick = async (): Promise<void> => {
    let pathname;
    let query;

    if (comment?.thread) {
      pathname = urls.thread(comment.thread.slug || '');
    } else if (badgeProgress?.user.slug) {
      pathname = urls.user(badgeProgress.user.slug);
    }

    if (comment) {
      query = {
        comment: comment.id,
      };
    }

    await markSingleActivityRead({ variables: { id, read: true } });

    if (pathname) {
      await Router.push({ pathname, query });
    }
  };

  const avatarSrc = (!!comment && mediaUrl(avatarThumbnail)) || '';

  const renderAvatarIcon = useMemo(
    () => badgeProgress && <BadgeTierIcon tier={badgeProgress.badge.tier} />,
    [badgeProgress],
  );

  const renderAvatar = useMemo(
    () => (
      <ListItemAvatar>
        <Avatar src={avatarSrc}>{renderAvatarIcon}</Avatar>
      </ListItemAvatar>
    ),
    [avatarSrc, renderAvatarIcon],
  );

  const renderUserLink = useMemo(
    () =>
      !!causingUser && (
        <TextLink href={urls.user(R.prop('slug', causingUser))}>
          {R.prop('username', causingUser)}
        </TextLink>
      ),
    [causingUser],
  );

  const renderCommunityUser = useMemo(
    () =>
      !!comment && (
        <Typography variant="body2" color="textSecondary">
          {t('common:communityUser')}
        </Typography>
      ),
    [comment, t],
  );

  const renderTargetUserLink = useMemo(() => renderUserLink || renderCommunityUser, [
    renderCommunityUser,
    renderUserLink,
  ]);

  const renderListItemText = useMemo(
    () => <ListItemText primary={renderTargetUserLink} secondary={description} />,
    [description, renderTargetUserLink],
  );

  return (
    <ListItem onClick={handleClick} className={clsx(!read && classes.unread)} button>
      {renderAvatar}
      {renderListItemText}
    </ListItem>
  );
};
