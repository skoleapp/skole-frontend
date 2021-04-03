import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import TableBody from '@material-ui/core/TableBody';
import CheckCircleOutlined from '@material-ui/icons/CheckCircleOutline';
import SettingsOutlined from '@material-ui/icons/SettingsOutlined';
import {
  ActionRequiredTemplate,
  ActionsButton,
  ActivityListItem,
  ErrorTemplate,
  Link,
  ListTemplate,
  LoadingBox,
  NotFoundBox,
  PaginatedTable,
} from 'components';
import { useActionsContext, useAuthContext, useNotificationsContext } from 'context';
import {
  ActivityObjectType,
  GraphQlMarkAllActivitiesAsReadMutation,
  useActivitiesQuery,
  useGraphQlMarkAllActivitiesAsReadMutation,
} from 'generated';
import { withActions, withAuthRequired } from 'hocs';
import { useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { urls } from 'utils';

const ActivityPage: NextPage = () => {
  const { t } = useTranslation();
  const { toggleUnexpectedErrorNotification } = useNotificationsContext();
  const { userMe, verified } = useAuthContext();
  const { query } = useRouter();
  const variables = R.pick(['page', 'pageSize'], query);
  const context = useLanguageHeaderContext();
  const { data, loading, error } = useActivitiesQuery({ variables, context });
  const [activities, setActivities] = useState<ActivityObjectType[]>([]);
  const activityCount = R.pathOr(0, ['activities', 'count'], data);
  const markAllAsReadDisabled = !activities.length;
  const { handleCloseActionsDialog } = useActionsContext();

  // Update state after data fetching is complete.
  useEffect(() => {
    const initialActivities = R.pathOr([], ['activities', 'objects'], data);
    setActivities(initialActivities);
  }, [data]);

  const onCompleted = ({
    markAllActivitiesAsRead,
  }: GraphQlMarkAllActivitiesAsReadMutation): void => {
    if (markAllActivitiesAsRead?.errors?.length) {
      toggleUnexpectedErrorNotification();
    } else if (markAllActivitiesAsRead?.activities?.objects) {
      const newActivities = R.pathOr([], ['activities', 'objects'], markAllActivitiesAsRead);
      setActivities(newActivities);
    } else {
      toggleUnexpectedErrorNotification();
    }
  };

  const [markAllActivitiesAsRead] = useGraphQlMarkAllActivitiesAsReadMutation({
    onCompleted,
    onError: toggleUnexpectedErrorNotification,
    context,
  });

  const handleClickMarkAllActivitiesAsReadButton = useCallback(async (): Promise<void> => {
    await markAllActivitiesAsRead();
    handleCloseActionsDialog();
  }, [handleCloseActionsDialog, markAllActivitiesAsRead]);

  const renderLoading = useMemo(() => loading && <LoadingBox />, [loading]);
  const renderNotFound = useMemo(() => <NotFoundBox text={t('activity:noActivity')} />, [t]);

  const mapActivities = useMemo(
    () =>
      activities.map((a, i) => (
        <ActivityListItem
          key={`${a.id}_${i}_${a.read}`} // Ensure the key is always unique for different activities in different order.
          activity={a}
        />
      )),
    [activities],
  );

  const renderActivityTableBody = useMemo(() => <TableBody>{mapActivities}</TableBody>, [
    mapActivities,
  ]);

  // Disable this action if user has no activities.
  const renderMarkAllAsReadAction = useMemo(
    () => (
      <MenuItem onClick={handleClickMarkAllActivitiesAsReadButton} disabled={markAllAsReadDisabled}>
        <ListItemIcon>
          <CheckCircleOutlined />
        </ListItemIcon>
        <ListItemText>{t('activity:markAllAsRead')}</ListItemText>
      </MenuItem>
    ),
    [handleClickMarkAllActivitiesAsReadButton, markAllAsReadDisabled, t],
  );

  const renderNotificationSettingsAction = useMemo(
    () => (
      <Link href={urls.accountSettings} fullWidth>
        <MenuItem>
          <ListItemIcon onClick={handleCloseActionsDialog}>
            <SettingsOutlined />
          </ListItemIcon>
          <ListItemText>{t('activity:notificationSettings')}</ListItemText>
        </MenuItem>
      </Link>
    ),
    [t, handleCloseActionsDialog],
  );

  const actionsDialogParams = useMemo(
    () => ({
      renderCustomActions: [renderMarkAllAsReadAction, renderNotificationSettingsAction],
      hideShareAction: true,
      hideDeleteAction: true,
      hideReportAction: true,
    }),
    [renderMarkAllAsReadAction, renderNotificationSettingsAction],
  );

  const renderActionsButton = useMemo(
    () => (
      <ActionsButton
        tooltip={t('activity-tooltips:actions')}
        actionsDialogParams={actionsDialogParams}
      />
    ),
    [actionsDialogParams, t],
  );

  const renderTable = useMemo(
    () =>
      activities.length && (
        <PaginatedTable renderTableBody={renderActivityTableBody} count={activityCount} />
      ),
    [activities.length, activityCount, renderActivityTableBody],
  );

  const renderActivities = useMemo(() => renderLoading || renderTable || renderNotFound, [
    renderLoading,
    renderNotFound,
    renderTable,
  ]);

  const layoutProps = {
    seoProps: {
      title: t('activity:title'),
    },
    topNavbarProps: {
      header: t('activity:header'),
      emoji: '🔔',
      renderHeaderRight: !!userMe && renderActionsButton,
    },
    listTemplateProps: {
      renderAction: renderActionsButton,
    },
  };

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" />;
  }

  if (error) {
    return <ErrorTemplate variant="error" />;
  }

  if (!verified) {
    return <ActionRequiredTemplate variant="verify-account" {...layoutProps} />;
  }

  return <ListTemplate {...layoutProps}>{renderActivities}</ListTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['activity-tooltips'], locale),
  },
});

const withWrappers = R.compose(withAuthRequired, withActions);

export default withWrappers(ActivityPage);
