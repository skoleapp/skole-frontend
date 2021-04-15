import List from '@material-ui/core/List';
import { makeStyles } from '@material-ui/core/styles';
import { ActivityObjectType, useActivityPreviewQuery } from 'generated';
import { useLanguageHeaderContext } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { useMemo } from 'react';

import { NotFoundBox } from '../shared';
import { SkeletonActivityPreviewList } from '../skeletons';
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
  const activities: ActivityObjectType[] = R.propOr([], 'activityPreview', data);

  const renderActivities = useMemo(
    () => activities.map((a, i) => <ActivityListItem activity={a} key={i} />),
    [activities],
  );

  if (loading) {
    return (
      <List className={classes.list}>
        <SkeletonActivityPreviewList />
      </List>
    );
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
