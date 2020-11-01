import { List, ListItemIcon, ListItemText, MenuItem } from '@material-ui/core';
import { DoneOutlineOutlined, SettingsOutlined } from '@material-ui/icons';
import { ActivityList, NotFoundLayout, ResponsiveDialog, SettingsLayout } from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { GraphQlMarkAllActivitiesAsReadMutation, useGraphQlMarkAllActivitiesAsReadMutation } from 'generated';
import { useActionsDialog, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation, withAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React, { SyntheticEvent } from 'react';

const ActivityPage: NextPage = () => {
    const { t } = useTranslation();
    const { activities, setActivities } = useAuthContext();
    const { toggleNotification } = useNotificationsContext();
    const context = useLanguageHeaderContext();
    const onError = (): void => toggleNotification(t('notifications:markAllActivitiesAsReadError'));

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
            } else if (!!markAllActivitiesAsRead.activities) {
                setActivities(markAllActivitiesAsRead.activities);
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

    const renderActivityList = <ActivityList />;

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

    if (!!activities) {
        return (
            <SettingsLayout {...layoutProps}>
                {renderActivityList}
                {renderActionsDialog}
            </SettingsLayout>
        );
    } else {
        return <NotFoundLayout />;
    }
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        _ns: await loadNamespaces([], locale),
    },
});

export default withAuth(ActivityPage);
