import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import CheckCircleOutlined from '@material-ui/icons/CheckCircleOutline';
import SettingsOutlined from '@material-ui/icons/SettingsOutlined';
import {
  ActivityTableBody,
  ErrorTemplate,
  ListTemplate,
  LoadingBox,
  LoginRequiredTemplate,
  NotFoundBox,
  PaginatedTable,
  ResponsiveDialog,
} from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import {
  GraphQlMarkAllActivitiesAsReadMutation,
  useActivitiesQuery,
  useGraphQlMarkAllActivitiesAsReadMutation,
} from 'generated';
import { withUserMe } from 'hocs';
import { useActionsDialog, useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { SeoPageProps } from 'types';

const ActivityPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const { t } = useTranslation();
  const { toggleUnexpectedErrorNotification } = useNotificationsContext();
  const { userMe } = useAuthContext();
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

  const {
    actionsDialogOpen,
    actionsDialogHeaderProps,
    renderActionsButton,
    handleCloseActionsDialog,
  } = useActionsDialog({
    actionsButtonTooltip: t('activity-tooltips:actions'),
  });

  const renderHeaderRight = !!userMe && renderActionsButton;

  const onCompleted = ({
    markAllActivitiesAsRead,
  }: GraphQlMarkAllActivitiesAsReadMutation): void => {
    if (markAllActivitiesAsRead) {
      if (!!markAllActivitiesAsRead.errors && !!markAllActivitiesAsRead.errors.length) {
        toggleUnexpectedErrorNotification();
      } else if (
        !!markAllActivitiesAsRead.activities &&
        !!markAllActivitiesAsRead.activities.objects
      ) {
        const newActivities = R.pathOr([], ['activities', 'objects'], markAllActivitiesAsRead);
        setActivities(newActivities);
      } else {
        toggleUnexpectedErrorNotification();
      }
    } else {
      toggleUnexpectedErrorNotification();
    }
  };

  const [markAllActivitiesAsRead] = useGraphQlMarkAllActivitiesAsReadMutation({
    onCompleted,
    onError: toggleUnexpectedErrorNotification,
    context,
  });

  const handleClickMarkAllActivitiesAsReadButton = async (e: SyntheticEvent): Promise<void> => {
    await markAllActivitiesAsRead();
    handleCloseActionsDialog(e);
  };

  const renderLoading = <LoadingBox />;
  const renderNotFound = <NotFoundBox text={t('activity:noActivity')} />;
  const renderActivityTableBody = <ActivityTableBody activities={activities} />;

  const renderTable = (
    <PaginatedTable renderTableBody={renderActivityTableBody} count={activityCount} />
  );

  const renderActivities = loading
    ? renderLoading
    : activities.length
    ? renderTable
    : renderNotFound;

  // Disable this action if user has no activities.
  const renderMarkAllAsReadAction = (
    <MenuItem onClick={handleClickMarkAllActivitiesAsReadButton} disabled={markAllAsReadDisabled}>
      <ListItemIcon>
        <CheckCircleOutlined />
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
    seoProps,
    topNavbarProps: {
      header: t('activity:header'),
      emoji: '🔔',
      renderHeaderRight,
    },
    listTemplateProps: {
      renderActions: renderActionsButton,
    },
  };

  if (!userMe) {
    return <LoginRequiredTemplate {...layoutProps} />;
  }

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" seoProps={seoProps} />;
  }

  if (error) {
    return <ErrorTemplate variant="error" seoProps={seoProps} />;
  }

  return (
    <ListTemplate {...layoutProps}>
      {renderActivities}
      {renderActionsDialog}
    </ListTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const t = await getT(locale, 'activity');

  return {
    props: {
      _ns: await loadNamespaces(['activity-tooltips'], locale),
      seoProps: {
        title: t('title'),
      },
    },
  };
};

export default withUserMe(ActivityPage);
