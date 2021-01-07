import {
  CardHeader,
  List,
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
  Paper,
} from '@material-ui/core';
import { DoneOutlineOutlined, SettingsOutlined } from '@material-ui/icons';
import {
  ActivityTableBody,
  BackButton,
  ErrorTemplate,
  LoadingBox,
  MainTemplate,
  NotFoundBox,
  OfflineTemplate,
  PaginatedTable,
  ResponsiveDialog,
} from 'components';
import { useNotificationsContext } from 'context';
import {
  GraphQlMarkAllActivitiesAsReadMutation,
  useActivitiesQuery,
  useGraphQlMarkAllActivitiesAsReadMutation,
} from 'generated';
import { withAuth } from 'hocs';
import { useActionsDialog, useLanguageHeaderContext, useMediaQueries } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
  paper: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  cardHeaderRoot: {
    borderBottom: BORDER,
    position: 'relative',
    padding: spacing(3),
  },
  cardHeaderAvatar: {
    position: 'absolute',
    top: spacing(2),
    left: spacing(2),
  },
  cardHeaderAction: {
    position: 'absolute',
    top: spacing(2),
    right: spacing(2),
  },
}));

const ActivityPage: NextPage = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { unexpectedError } = useNotificationsContext();
  const { query } = useRouter();
  const { isTabletOrDesktop } = useMediaQueries();
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

  const onCompleted = ({
    markAllActivitiesAsRead,
  }: GraphQlMarkAllActivitiesAsReadMutation): void => {
    if (markAllActivitiesAsRead) {
      if (!!markAllActivitiesAsRead.errors && !!markAllActivitiesAsRead.errors.length) {
        unexpectedError();
      } else if (
        !!markAllActivitiesAsRead.activities &&
        !!markAllActivitiesAsRead.activities.objects
      ) {
        const newActivities = R.pathOr([], ['activities', 'objects'], markAllActivitiesAsRead);
        setActivities(newActivities);
      } else {
        unexpectedError();
      }
    } else {
      unexpectedError();
    }
  };

  const [markAllActivitiesAsRead] = useGraphQlMarkAllActivitiesAsReadMutation({
    onCompleted,
    onError: unexpectedError,
    context,
  });

  const handleClickMarkAllActivitiesAsReadButton = async (e: SyntheticEvent): Promise<void> => {
    await markAllActivitiesAsRead();
    handleCloseActionsDialog(e);
  };

  const renderBackButton = <BackButton onClick={() => Router.back()} />;

  const renderCardHeader = isTabletOrDesktop && (
    <CardHeader
      classes={{
        root: classes.cardHeaderRoot,
        avatar: classes.cardHeaderAvatar,
        action: classes.cardHeaderAction,
      }}
      title={t('activity:header')}
      avatar={renderBackButton}
      action={renderActionsButton}
    />
  );

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

  const renderActionsDialog = (
    <ResponsiveDialog
      open={actionsDialogOpen}
      onClose={handleCloseActionsDialog}
      dialogHeaderProps={actionsDialogHeaderProps}
    >
      {renderActionsDialogContent}
    </ResponsiveDialog>
  );

  const renderContent = (
    <Paper className={classes.paper}>
      {renderCardHeader}
      {renderActivities}
    </Paper>
  );

  const layoutProps = {
    seoProps: {
      title: t('activity:title'),
      description: t('activity:description'),
    },
    topNavbarProps: {
      dynamicBackUrl: true,
      headerRight: renderActionsButton,
    },
  };

  if (!!error && !!error.networkError) {
    return <OfflineTemplate />;
  }

  if (error) {
    return <ErrorTemplate />;
  }

  return (
    <MainTemplate {...layoutProps}>
      {renderContent}
      {renderActionsDialog}
    </MainTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['activity-tooltips'], locale),
  },
});

export default withAuth(ActivityPage);
