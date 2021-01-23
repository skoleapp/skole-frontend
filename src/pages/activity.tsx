import CardHeader from '@material-ui/core/CardHeader';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import DoneOutlineOutlined from '@material-ui/icons/DoneOutlineOutlined';
import SettingsOutlined from '@material-ui/icons/SettingsOutlined';
import {
  ActivityTableBody,
  BackButton,
  Emoji,
  ErrorTemplate,
  LoadingBox,
  LoginRequiredTemplate,
  MainTemplate,
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
import { useActionsDialog, useLanguageHeaderContext, useMediaQueries } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';
import { SeoPageProps } from 'types';

const useStyles = makeStyles(({ breakpoints, spacing, palette }) => ({
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
  cardHeaderTitle: {
    color: palette.text.secondary,
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

const ActivityPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { toggleUnexpectedErrorNotification } = useNotificationsContext();
  const { userMe } = useAuthContext();
  const { query } = useRouter();
  const { isTabletOrDesktop } = useMediaQueries();
  const variables = R.pick(['page', 'pageSize'], query);
  const context = useLanguageHeaderContext();
  const { data, loading, error } = useActivitiesQuery({ variables, context });
  const [activities, setActivities] = useState([]);
  const activityCount = R.pathOr(0, ['activities', 'count'], data);
  const markAllAsReadDisabled = !activities.length;
  const headerText = t('activity:header');

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

  const renderEmoji = <Emoji emoji="🔔" />;
  const renderBackButton = <BackButton />;
  const renderLoading = <LoadingBox />;
  const renderNotFound = <NotFoundBox text={t('activity:noActivity')} />;
  const renderActivityTableBody = <ActivityTableBody activities={activities} />;

  const renderHeader = (
    <>
      {headerText}
      {renderEmoji}
    </>
  );

  const renderCardHeader = isTabletOrDesktop && (
    <CardHeader
      classes={{
        root: classes.cardHeaderRoot,
        title: classes.cardHeaderTitle,
        avatar: classes.cardHeaderAvatar,
        action: classes.cardHeaderAction,
      }}
      title={renderHeader}
      avatar={renderBackButton}
      action={renderActionsButton}
    />
  );

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
    seoProps,
    topNavbarProps: {
      header: renderHeader,
      renderHeaderRight,
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
    <MainTemplate {...layoutProps}>
      {renderContent}
      {renderActionsDialog}
    </MainTemplate>
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
