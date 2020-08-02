import { ListItemText, MenuItem } from '@material-ui/core';
import { DoneOutlineOutlined, SettingsOutlined } from '@material-ui/icons';
import { ActivityList, NotFoundLayout, SettingsLayout, StyledDrawer, StyledList } from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import {
    ActivityObjectType,
    MarkAllActivitiesAsReadMutation,
    useMarkAllActivitiesAsReadMutation,
    UserObjectType,
} from 'generated';
import { useActionsDrawer } from 'hooks';
import { useTranslation, withAuth } from 'lib';
import { NextPage } from 'next';
import React, { SyntheticEvent } from 'react';
import { I18nProps } from 'types';

interface Props extends I18nProps {
    userMe?: UserObjectType | null;
}

const ActivityPage: NextPage<Props> = () => {
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
            } else if (!!markAllActivitiesRead.activity) {
                const activity = markAllActivitiesRead.activity as ActivityObjectType[];
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
        <StyledList>
            <MenuItem onClick={handleClickMarkAllActivitiesAsReadBUtton}>
                <ListItemText>
                    <DoneOutlineOutlined /> {t('activity:markAllAsRead')}
                </ListItemText>
            </MenuItem>
            <MenuItem disabled>
                <ListItemText>
                    <SettingsOutlined /> {t('activity:notificationSettings')}
                </ListItemText>
            </MenuItem>
        </StyledList>
    );

    const renderActionsDrawer = (
        <StyledDrawer {...actionsDrawerProps}>
            {renderActionsHeader}
            {renderActions}
        </StyledDrawer>
    );

    const layoutProps = {
        seoProps: {
            title: t('activity:title'),
            description: t('activity:description'),
        },
        topNavbarProps: {
            header: t('activity:header'),
            dynamicBackUrl: true,
            headerRight: renderActionsButton,
        },
        renderCardContent: <ActivityList />,
        renderDesktopHeaderRight: renderActionsButton,
        desktopHeader: t('activity:header'),
        fullSize: true,
    };

    if (!!userMe) {
        return <SettingsLayout {...layoutProps}>{renderActionsDrawer}</SettingsLayout>;
    } else {
        return <NotFoundLayout />;
    }
};

export default withAuth(ActivityPage);
