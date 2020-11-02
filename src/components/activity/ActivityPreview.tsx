import { List, makeStyles } from '@material-ui/core';
import { ActivityListItem, NotFoundBox } from 'components';
import { ActivityObjectType, useActivityPreviewQuery } from 'generated';
import { useLanguageHeaderContext } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React from 'react';

import { LoadingBox } from '../shared';

const useStyles = makeStyles({
    list: {
        width: '100%',
    },
});

export const ActivityPreview: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const context = useLanguageHeaderContext();
    const { data, loading, error } = useActivityPreviewQuery({ context });
    const activities: ActivityObjectType[] = R.propOr([], 'activityPreview', data);
    const renderActivities = activities.map((a, i) => <ActivityListItem activity={a} key={i} />);

    if (loading) {
        return <LoadingBox />;
    }

    if (error) {
        return <NotFoundBox text={t('activity:error')} />;
    }

    return !!activities.length ? (
        <List className={classes.list}>{renderActivities}</List>
    ) : (
        <NotFoundBox text={t('activity:noActivity')} />
    );
};
