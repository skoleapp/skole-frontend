import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
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
import React, { useState } from 'react';
import { mediaUrl, urls } from 'utils';

import { TextLink } from '../shared';

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
  activity: { id, targetUser, course, resource, comment, read: initialRead, description },
}) => {
  const classes = useStyles();
  const [read, setRead] = useState(initialRead);
  const { unexpectedError } = useNotificationsContext();
  const context = useLanguageHeaderContext();
  const { t } = useTranslation();

  const onCompleted = ({ markActivityAsRead }: MarkActivityAsReadMutation): void => {
    if (markActivityAsRead) {
      if (!!markActivityAsRead.errors && !!markActivityAsRead.errors.length) {
        unexpectedError();
      } else if (!!markActivityAsRead.activity && markActivityAsRead.activity.read != null) {
        // We use the abstract equality operator here on purpose to compare against both `null` and `undefined` values.
        setRead(markActivityAsRead.activity.read);
      } else {
        unexpectedError();
      }
    } else {
      unexpectedError();
    }
  };

  const [markSingleActivityRead] = useMarkActivityAsReadMutation({
    onCompleted,
    onError: unexpectedError,
    context,
  });

  const handleClick = async (): Promise<void> => {
    let pathname;
    let query;

    if (course) {
      pathname = urls.course(course.id);
    } else if (resource) {
      pathname = urls.resource(resource.id);
    }

    if (comment) {
      query = { comment: comment.id };
    }

    await markSingleActivityRead({ variables: { id, read: true } });
    // The activities should always have a pathname but technically it's possible that the pathname is undefined.
    // In that case we do nothing besides marking the activity as read.
    !!pathname && (await Router.push({ pathname, query }));
  };

  const renderAvatar = (
    <ListItemAvatar>
      <Avatar src={mediaUrl(R.propOr('', 'avatarThumbnail', targetUser))} />
    </ListItemAvatar>
  );

  const renderTargetUserLink = targetUser ? (
    <TextLink href={urls.user(R.propOr('', 'id', targetUser))}>
      {R.propOr('', 'username', targetUser)}
    </TextLink>
  ) : (
    <Typography variant="body2" color="textSecondary">
      {t('common:communityUser')}
    </Typography>
  );

  const renderListItemText = (
    <ListItemText primary={renderTargetUserLink} secondary={description} />
  );

  return (
    <ListItem onClick={handleClick} className={!read ? classes.unread : ''} button>
      {renderAvatar}
      {renderListItemText}
    </ListItem>
  );
};
