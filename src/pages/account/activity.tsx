import { List, ListItemIcon, ListItemText, MenuItem } from '@material-ui/core';
import { DoneOutlineOutlined, SettingsOutlined } from '@material-ui/icons';
import {
    ActivityList,
    LoadingLayout,
    NotFoundLayout,
    OfflineLayout,
    ResponsiveDialog,
    SettingsLayout,
} from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import {
    ActivityObjectType,
    MarkAllActivitiesAsReadMutation,
    useMarkAllActivitiesAsReadMutation,
    UserObjectType,
} from 'generated';
import { useActionsDialog } from 'hooks';
import { includeDefaultNamespaces, useTranslation, withAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React, { SyntheticEvent } from 'react';
import { AuthProps } from 'types';

const ActivityPage: NextPage<AuthProps> = ({ authLoading, authNetworkError }) => {
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

    const handleClickMarkAllActivitiesAsReadBUtton = async (e: SyntheticEvent): Promise<void> => {
        await markAllActivitiesAsRead();
        handleCloseActionsDialog(e);
    };

    const renderActionsDialogContent = (
        <List>
            <MenuItem onClick={handleClickMarkAllActivitiesAsReadBUtton}>
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

    const renderActionsDialog = (
        <ResponsiveDialog
            open={actionsDialogOpen}
            onClose={handleCloseActionsDialog}
            dialogHeaderProps={actionsDialogHeaderProps}
        >
            {renderActionsDialogContent}
        </ResponsiveDialog>
    );

    const seoProps = {
        title: t('activity:title'),
        description: t('activity:description'),
    };

    const layoutProps = {
        seoProps,
        header: t('activity:header'),
        headerRight: renderActionsButton,
        disablePadding: true,
        topNavbarProps: {
            dynamicBackUrl: true,
        },
    };

    if (authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    if (authNetworkError) {
        return <OfflineLayout seoProps={seoProps} />;
    }

    if (!!userMe) {
        return (
            <SettingsLayout {...layoutProps}>
                <ActivityList />
                {renderActionsDialog}
            </SettingsLayout>
        );
    } else {
        return <NotFoundLayout />;
    }
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces([]),
    },
});

export default withAuth(ActivityPage);
