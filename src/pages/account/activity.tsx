import { ListItemText, MenuItem } from '@material-ui/core';
import { DoneOutlineOutlined, SettingsOutlined } from '@material-ui/icons';
import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import React, { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityList, StyledDrawer, StyledList } from 'src/components';
import { useAuthContext, useNotificationsContext } from 'src/context';
import { useActionsDrawer } from 'src/utils';

import {
    ActivityObjectType,
    MarkAllActivitiesAsReadMutation,
    useMarkAllActivitiesAsReadMutation,
    UserObjectType,
} from '../../../generated/graphql';
import { NotFoundLayout, SettingsLayout } from '../../components';
import { includeDefaultNamespaces } from '../../i18n';
import { withAuthSync, withSSRAuth, withUserAgent } from '../../lib';
import { I18nProps } from '../../types';

interface Props extends I18nProps {
    userMe?: UserObjectType | null;
}

const ActivityPage: NextPage<Props> = () => {
    const { t } = useTranslation();
    const { user, setUser } = useAuthContext();
    const { renderActionsHeader, renderActionsButton, handleCloseActions, open, anchor } = useActionsDrawer();
    const actionsDrawerProps = { open, anchor, onClose: handleCloseActions };
    const { toggleNotification } = useNotificationsContext();
    const onError = (): void => toggleNotification(t('errors:activityError'));

    const onCompleted = ({ markAllActivitiesRead }: MarkAllActivitiesAsReadMutation): void => {
        if (!!markAllActivitiesRead) {
            if (!!markAllActivitiesRead.errors) {
                onError();
            } else if (!!markAllActivitiesRead.activity) {
                const activity = markAllActivitiesRead.activity as ActivityObjectType[];
                const newUser = { ...user, activity } as UserObjectType;
                setUser(newUser);
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

    if (!!user) {
        return <SettingsLayout {...layoutProps}>{renderActionsDrawer}</SettingsLayout>;
    } else {
        return <NotFoundLayout />;
    }
};

const wrappers = R.compose(withUserAgent, withSSRAuth);

export const getServerSideProps: GetServerSideProps = wrappers(async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces([]),
    },
}));

export default withAuthSync(ActivityPage);
