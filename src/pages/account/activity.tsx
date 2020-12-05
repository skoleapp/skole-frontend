import { List, ListItemIcon, ListItemText, MenuItem, TableBody } from '@material-ui/core';
import { DoneOutlineOutlined, SettingsOutlined } from '@material-ui/icons';
import {
  ActivityListItem,
  ErrorTemplate,
  LoadingBox,
  NotFoundBox,
  OfflineTemplate,
  PaginatedTable,
  ResponsiveDialog,
  SettingsTemplate,
} from 'components';
import { useNotificationsContext } from 'context';
import {
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
  const variables = R.pick(['page', 'pageSize'], query);
  const context = useLanguageHeaderContext();
  const { data, loading, error } = useActivitiesQuery({ variables, context });
  const [activities, setActivities] = useState([]);
  const activityCount = R.pathOr(0, ['activities', 'count'], data);
  const markAllAsReadDisabled = !activities.length;

  // Update state after data fetching is complete.
  useEffect(() => {
    const initialActivities = R.pathOr([], ['activities', 'objects'], data);
    setActivities(initialActivities);
  }, [data]);

  const onError = (): void => toggleNotification(t('notifications:markAllActivitiesAsReadError'));

  const {
    actionsDialogOpen,
    actionsDialogHeaderProps,
    renderActionsButton,
    handleCloseActionsDialog,
  } = useActionsDialog();

  const onCompleted = ({
    markAllActivitiesAsRead,
  }: GraphQlMarkAllActivitiesAsReadMutation): void => {
    if (markAllActivitiesAsRead) {
      if (!!markAllActivitiesAsRead.errors && !!markAllActivitiesAsRead.errors.length) {
        onError();
      } else if (
        !!markAllActivitiesAsRead.activities &&
        !!markAllActivitiesAsRead.activities.objects
      ) {
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

  // Disable this action if user has no activities.
  const renderMarkAllAsReadAction = (
    <MenuItem onClick={handleClickMarkAllActivitiesAsReadButton} disabled={markAllAsReadDisabled}>
      <ListItemIcon>
        <DoneOutlineOutlined />
      </ListItemIcon>
      <ListItemText>{t('activity:markAllAsRead')}</ListItemText>
    </MenuItem>
  );

  const renderNotificationSettingsAction = (
    <MenuItem disabled>
      <ListItemIcon>
        <SettingsOutlined />
      </ListItemIcon>
      <ListItemText>{t('activity:notificationSettings')}</ListItemText>
    </MenuItem>
  );

  const renderActionsDialogContent = (
    <List>
      {renderMarkAllAsReadAction}
      {renderNotificationSettingsAction}
    </List>
  );

  const renderLoading = <LoadingBox />;

  const renderActivityTableBody = (
    <TableBody>
      {activities.map((a, i) => (
        <ActivityListItem key={i} activity={a} />
      ))}
    </TableBody>
  );

  const renderTable = (
    <PaginatedTable renderTableBody={renderActivityTableBody} count={activityCount} />
  );

  const renderNotFound = <NotFoundBox text={t('activity:noActivity')} />;

  const renderActivities = loading
    ? renderLoading
    : activities.length
    ? renderTable
    : renderNotFound;

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

  if (!!error && !!error.networkError) {
    return <OfflineTemplate />;
  }
  if (error) {
    return <ErrorTemplate />;
  }

  return (
    <SettingsTemplate {...layoutProps}>
      {renderActivities}
      {renderActionsDialog}
    </SettingsTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces([], locale),
  },
});

export default withAuth(ActivityPage);
