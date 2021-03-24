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
      // Use the abstract equality to compare against both `null` and `undefined` values.
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

    if (comment) {
      const { course, resource, school, comment: innerComment } = comment;

      query = { comment: comment.id };

      if (innerComment?.id) {
        if (innerComment?.course?.slug) {
          pathname = urls.course(innerComment.course.slug);
        } else if (innerComment?.resource?.slug) {
          pathname = urls.resource(innerComment.resource.slug);
        } else if (innerComment?.school?.slug) {
          pathname = urls.school(innerComment.school.slug);
        }
        query = { comment: innerComment.id };
      } else if (course?.slug) {
        pathname = urls.course(course.slug);
      } else if (resource?.slug) {
        pathname = urls.resource(resource.slug);
      } else if (school?.slug) {
        pathname = urls.school(school.slug);
      }
    } else if (badgeProgress && badgeProgress.user.slug) {
      pathname = urls.user(badgeProgress.user.slug);
    }

    await markSingleActivityRead({ variables: { id, read: true } });

    if (pathname) {
      await Router.push({ pathname, query });
    }
  };

  const renderAvatar = comment && (
    <ListItemAvatar>
      <Avatar src={mediaUrl(avatarThumbnail)} />
    </ListItemAvatar>
  );

  let renderTargetUserLink = null;
  if (causingUser) {
    renderTargetUserLink = (
      <TextLink href={urls.user(R.prop('slug', causingUser))}>
        {R.prop('username', causingUser)}
      </TextLink>
    );
  } else if (comment) {
    renderTargetUserLink = (
      <Typography variant="body2" color="textSecondary">
        {t('common:communityUser')}
      </Typography>
    );
  } // else: activity had `badgeProgress`

  const renderListItemText = (
    <ListItemText primary={renderTargetUserLink} secondary={description} />
  );

  return (
    <ListItem onClick={handleClick} className={clsx(!read && classes.unread)} button>
      {renderAvatar}
      {renderListItemText}
    </ListItem>
  );
};
