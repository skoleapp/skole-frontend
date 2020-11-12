import { List, ListItemIcon, ListItemText, MenuItem, TableBody } from '@material-ui/core';
import { DoneOutlineOutlined, SettingsOutlined } from '@material-ui/icons';
import {
    ActivityListItem,
    ErrorLayout,
    LoadingLayout,
    NotFoundBox,
    OfflineLayout,
    PaginatedTable,
    ResponsiveDialog,
    SettingsLayout,
} from 'components';
import { useNotificationsContext } from 'context';
import {
    ActivitiesQueryVariables,
    GraphQlMarkAllActivitiesAsReadMutation,
    useActivitiesQuery,
    useGraphQlMarkAllActivitiesAsReadMutation,
} from 'generated';
import { withAuth } from 'hocs';
import { useActionsDialog, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent, useEffect, useState } from 'react';

const ActivityPage: NextPage = () => {
    const { t } = useTranslation();
    const { toggleNotification } = useNotificationsContext();
    const { query } = useRouter();
    const variables: ActivitiesQueryVariables = R.pick(['page', 'pageSize'], query);
    const context = useLanguageHeaderContext();
    const { data, loading, error } = useActivitiesQuery({ variables, context });
    const activityCount = R.pathOr(0, ['activities', 'count'], data);
    const [activities, setActivities] = useState([]);
    const onError = (): void => toggleNotification(t('notifications:markAllActivitiesAsReadError'));

    // Update state whenever we finish fetching.
    useEffect(() => {
        const initialActivities = R.pathOr([], ['activities', 'objects'], data);
        setActivities(initialActivities);
    }, [data]);

    const {
        actionsDialogOpen,
        actionsDialogHeaderProps,
        renderActionsButton,
        handleCloseActionsDialog,
    } = useActionsDialog({});

    const onCompleted = ({ markAllActivitiesAsRead }: GraphQlMarkAllActivitiesAsReadMutation): void => {
        if (!!markAllActivitiesAsRead) {
            if (!!markAllActivitiesAsRead.errors && !!markAllActivitiesAsRead.errors.length) {
                onError();
            } else if (!!markAllActivitiesAsRead.activities && !!markAllActivitiesAsRead.activities.objects) {
                const newActivities = R.pathOr([], ['activities', 'objects'], markAllActivitiesAsRead);
                setActivities(newActivities);
            } else {
                onError();
            }
        } else {
            onError();
        }
    };

    const [markAllActivitiesAsRead] = useGraphQlMarkAllActivitiesAsReadMutation({
        onCompleted,
        onError,
        context,
    });

    const handleClickMarkAllActivitiesAsReadButton = async (e: SyntheticEvent): Promise<void> => {
        await markAllActivitiesAsRead();
        handleCloseActionsDialog(e);
    };

    const renderActionsDialogContent = (
        <List>
            <MenuItem onClick={handleClickMarkAllActivitiesAsReadButton}>
                <ListItemIcon>
                    <DoneOutlineOutlined />
                </ListItemIcon>
                <ListItemText>{t('activity:markAllAsRead')}</ListItemText>
            </MenuItem>
            <MenuItem disabled>
                <ListItemIcon>
                    <SettingsOutlined />
                </ListItemIcon>
                <ListItemText>{t('activity:notificationSettings')}</ListItemText>
            </MenuItem>
        </List>
    );

    const renderActivityTableBody = (
        <TableBody>
            {activities.map((a, i) => (
                <ActivityListItem key={i} activity={a} />
            ))}
        </TableBody>
    );

    const renderActivities = !!activities.length ? (
        <PaginatedTable renderTableBody={renderActivityTableBody} count={activityCount} />
    ) : (
        <NotFoundBox text={t('activity:noActivity')} />
    );

    const renderActionsDialog = (
        <ResponsiveDialog
            open={actionsDialogOpen}
            onClose={handleCloseActionsDialog}
            dialogHeaderProps={actionsDialogHeaderProps}
        >
            {renderActionsDialogContent}
        </ResponsiveDialog>
    );

    const layoutProps = {
        seoProps: {
            title: t('activity:title'),
            description: t('activity:description'),
        },
        header: t('activity:header'),
        headerRight: renderActionsButton,
        disablePadding: true,
        topNavbarProps: {
            dynamicBackUrl: true,
        },
    };

    if (loading) {
        return <LoadingLayout />;
    }

    if (!!error && !!error.networkError) {
        return <OfflineLayout />;
    } else if (!!error) {
        return <ErrorLayout />;
    }

    return (
        <SettingsLayout {...layoutProps}>
            {renderActivities}
            {renderActionsDialog}
        </SettingsLayout>
    );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        _ns: await loadNamespaces([], locale),
    },
});

export default withAuth(ActivityPage);
