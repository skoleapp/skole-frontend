import { Drawer, List, ListItemIcon, ListItemText, MenuItem } from '@material-ui/core';
import { DoneOutlineOutlined, SettingsOutlined } from '@material-ui/icons';
import { ActivityList, LoadingLayout, NotFoundLayout, OfflineLayout, SettingsLayout } from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import {
    ActivityObjectType,
    MarkAllActivitiesAsReadMutation,
    useMarkAllActivitiesAsReadMutation,
    UserObjectType,
} from 'generated';
import { useActionsDrawer } from 'hooks';
import { includeDefaultNamespaces, useTranslation, withAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React, { SyntheticEvent } from 'react';
import { AuthProps } from 'types';

const ActivityPage: NextPage<AuthProps> = ({ authLoading, authNetworkError }) => {
    const { t } = useTranslation();
    const { userMe, setUserMe } = useAuthContext();
    const { renderActionsHeader, renderActionsButton, handleCloseActions, open, anchor } = useActionsDrawer({});
    const actionsDrawerProps = { open, anchor, onClose: handleCloseActions };
    const { toggleNotification } = useNotificationsContext();
    const onError = (): void => toggleNotification(t('notifications:markAllActivitiesReadError'));

    const onCompleted = ({ markAllActivitiesRead }: MarkAllActivitiesAsReadMutation): void => {
        if (!!markAllActivitiesRead) {
            if (!!markAllActivitiesRead.errors) {
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
        e.persist();
        await markAllActivitiesAsRead();
        handleCloseActions(e);
    };

    const renderActions = (
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
                <Drawer {...actionsDrawerProps}>
                    {renderActionsHeader}
                    {renderActions}
                </Drawer>
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
