import { List, ListItemIcon, ListItemText, MenuItem } from '@material-ui/core';
import { DoneOutlineOutlined, SettingsOutlined } from '@material-ui/icons';
import { ActivityList, NotFoundLayout, ResponsiveDialog, SettingsLayout } from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import {
    ActivityObjectType,
    MarkAllActivitiesAsReadMutation,
    useMarkAllActivitiesAsReadMutation,
    UserObjectType,
} from 'generated';
import { useActionsDialog } from 'hooks';
import { useTranslation, withAuth } from 'lib';
import { NextPage } from 'next';
import React, { SyntheticEvent } from 'react';

const ActivityPage: NextPage = () => {
    const { t } = useTranslation();
    const { userMe, setUserMe } = useAuthContext();
    const { toggleNotification } = useNotificationsContext();
    const onError = (): void => toggleNotification(t('notifications:markAllActivitiesReadError'));

    const {
        actionsDialogOpen,
        actionsDialogHeaderProps,
        renderActionsButton,
        handleCloseActionsDialog,
    } = useActionsDialog({});

    const onCompleted = ({ markAllActivitiesRead }: MarkAllActivitiesAsReadMutation): void => {
        if (!!markAllActivitiesRead) {
            if (!!markAllActivitiesRead.errors && !!markAllActivitiesRead.errors.length) {
                onError();
            } else if (!!markAllActivitiesRead.activities) {
                const activity = markAllActivitiesRead.activities as ActivityObjectType[];
                const newUserMe = { ...userMe, activity } as UserObjectType;
                setUserMe(newUserMe);
            } else {
                onError();
            }
        } else {
            onError();
        }
    };

    const [markAllActivitiesAsRead] = useMarkAllActivitiesAsReadMutation({
        onCompleted,
        onError,
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

    if (!!userMe) {
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

export default withAuth(ActivityPage);
