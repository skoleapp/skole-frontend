import { List, makeStyles } from '@material-ui/core';
import { ActivityObjectType, useActivityPreviewQuery } from 'generated';
import { useLanguageHeaderContext } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React from 'react';

import { LoadingBox, NotFoundBox } from '../shared';
import { ActivityListItem } from './ActivityListItem';

const useStyles = makeStyles({
  list: {
    width: '100%',
    overflowY: 'auto',
  },
});

export const ActivityPreview: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const context = useLanguageHeaderContext();
  const { data, loading, error } = useActivityPreviewQuery({ context });

  const activities: ActivityObjectType[] = R.propOr(
    [],
    'activityPreview',
    data
  );

  const renderActivities = activities.map((a, i) => (
    <ActivityListItem activity={a} key={i} />
  ));

  if (loading) {
    return <LoadingBox />;
  }

  if (error) {
    return <NotFoundBox text={t('activity:error')} />;
  }

  return activities.length ? (
    <List className={classes.list}>{renderActivities}</List>
  ) : (
    <NotFoundBox text={t('activity:noActivity')} />
  );
};
