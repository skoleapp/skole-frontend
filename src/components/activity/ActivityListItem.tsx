import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { useAuthContext, useNotificationsContext } from 'context';
import {
  ActivityObjectType,
  MarkActivityAsReadMutation,
  useMarkActivityAsReadMutation,
} from 'generated';
import { useLanguageHeaderContext } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { useMemo, useState } from 'react';
import { mediaUrl, urls } from 'utils';

import { BadgeTierIcon, Link, TextLink } from '../shared';

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
  const { profileUrl } = useAuthContext();
  const avatarThumbnail = R.propOr('', 'avatarThumbnail', causingUser);

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

  const getHref = (): Record<string, unknown> => {
    let pathname;
    let query;

    if (comment?.thread) {
      pathname = urls.thread(comment.thread.slug || '');
    } else if (badgeProgress) {
      pathname = profileUrl;
    }

    if (comment) {
      query = {
        comment: comment.id,
      };
    }

    return { pathname, query };
  };

  const handleClick = async (): Promise<void> => {
    await markSingleActivityRead({ variables: { id, read: true } });
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
    <Link href={getHref()} fullWidth>
      <ListItem onClick={handleClick} className={clsx(!read && classes.unread)} button>
        {renderAvatar}
        {renderListItemText}
      </ListItem>
    </Link>
  );
};
