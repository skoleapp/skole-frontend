import BottomNavigation from '@material-ui/core/BottomNavigation';
import Grid from '@material-ui/core/Grid';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import CloudDownloadOutlined from '@material-ui/icons/CloudDownloadOutlined';
import PrintOutlined from '@material-ui/icons/PrintOutlined';
import ThumbsUpDownOutlined from '@material-ui/icons/ThumbsUpDownOutlined';
import clsx from 'clsx';
import {
  ActionsButton,
  CustomBottomNavbarContainer,
  Discussion,
  DiscussionHeader,
  DrawingModeButton,
  DrawingModeControls,
  ErrorTemplate,
  InfoButton,
  LoadingBox,
  LoadingTemplate,
  MainTemplate,
  ResourceBottomToolbar,
  ResourceTopToolbar,
  RotateButton,
  ShareButton,
  TabPanel,
  TextLink,
} from 'components';
import {
  useActionsContext,
  useAuthContext,
  useConfirmContext,
  useDiscussionContext,
  useNotificationsContext,
  usePdfViewerContext,
} from 'context';
import {
  DeleteResourceMutation,
  DownloadResourceMutation,
  ResourceSeoPropsDocument,
  useDeleteResourceMutation,
  useDownloadResourceMutation,
  useResourceQuery,
} from 'generated';
import { withActions, withDiscussion, withInfo, withPdfViewer, withUserMe } from 'hocs';
import { useLanguageHeaderContext, useMediaQueries, useStars, useTabs, useVotes } from 'hooks';
import { getT, initApolloClient, loadNamespaces, useTranslation } from 'lib';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useEffect, useState } from 'react';
import { BORDER_RADIUS } from 'styles';
import { PdfViewerProps, SeoPageProps } from 'types';
import { getLanguageHeaderContext, MAX_REVALIDATION_INTERVAL, mediaUrl, urls } from 'utils';

// Make sure this is never imported server-side.
// Reference: https://github.com/wojtekmaj/react-pdf/issues/136#issuecomment-716643894.
const PdfViewer = dynamic<PdfViewerProps>(() => import('../../components/resource/PdfViewer'), {
  ssr: false,
  loading: () => <LoadingBox />,
});

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
  mobileContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
  },
  desktopContainer: {
    flexGrow: 1,
    flexWrap: 'nowrap',
  },
  paperContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  resourceContainer: {
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  score: {
    marginLeft: spacing(2),
    marginRight: spacing(2),
  },
}));

const ResourceDetailPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { isMobile, isTabletOrDesktop } = useMediaQueries();
  const { toggleNotification, toggleUnexpectedErrorNotification } = useNotificationsContext();
  const { confirm } = useConfirmContext();
  const { userMe, verified } = useAuthContext();
  const context = useLanguageHeaderContext();
  const { query } = useRouter();
  const variables = R.pick(['id', 'page', 'pageSize'], query);
  const { data, loading, error } = useResourceQuery({ variables, context });
  const resource = R.prop('resource', data);
  const resourceTitle = R.propOr('', 'title', resource);
  const resourceDate = R.propOr('', 'date', resource);
  const resourceType = R.pathOr('-', ['resourceType', 'name'], resource);
  const courseName = R.pathOr('', ['course', 'name'], resource);
  const schoolName = R.pathOr('', ['school', 'name'], resource);
  const courseId = R.pathOr('', ['course', 'id'], resource);
  const schoolId = R.pathOr('', ['school', 'id'], resource);
  const creatorId = R.pathOr('', ['user', 'id'], resource);
  const title = `${resourceTitle} - ${resourceDate}`;
  const file = mediaUrl(R.propOr('', 'file', resource));
  const resourceId = R.propOr('', 'id', resource);
  const initialVote = R.propOr(null, 'vote', resource);
  const initialScore = String(R.propOr(0, 'score', resource));
  const initialStars = String(R.propOr(0, 'starCount', resource));
  const initialDownloads = String(R.propOr(0, 'downloads', resource));
  const initialCommentCount = R.prop('commentCount', resource);
  const [downloads, setDownloads] = useState('0');
  const starred = !!R.prop('starred', resource);
  const isOwner = !!userMe && userMe.id === creatorId;
  const resourceCreator = R.prop('user', resource);
  const creatorUsername = R.pathOr(t('common:communityUser'), ['user', 'username'], resource);
  const created = R.prop('created', resource);
  const { commentCount, createCommentDialogOpen } = useDiscussionContext(initialCommentCount);
  const { drawingMode, setDrawingMode } = usePdfViewerContext();
  const { handleCloseActionsDialog } = useActionsContext();
  const { tabsProps, firstTabPanelProps, secondTabPanelProps, tabValue, setTabValue } = useTabs();
  const emoji = '📚';

  const { stars, renderStarButton } = useStars({
    starred,
    initialStars,
    resource: resourceId,
    starTooltip: t('resource-tooltips:star'),
    unstarTooltip: t('resource-tooltips:unstar'),
  });

  const { renderUpvoteButton, renderDownvoteButton, score } = useVotes({
    initialVote,
    initialScore,
    isOwner,
    variables: { resource: resourceId },
    upvoteTooltip: t('resource-tooltips:upvote'),
    removeUpvoteTooltip: t('resource-tooltips:removeUpvote'),
    downvoteTooltip: t('resource-tooltips:downvote'),
    removeDownvoteTooltip: t('resource-tooltips:removeDownvote'),
    ownContentTooltip: t('resource-tooltips:voteOwnContent'),
  });

  // If comment dialog is opened in main tab, automatically switch to discussion tab.
  useEffect(() => {
    createCommentDialogOpen && tabValue === 0 && setTabValue(1);
  }, [createCommentDialogOpen, tabValue]);

  // If drawing mode is on and user changes to discussion tab on mobile, toggle drawing mode off.
  useEffect(() => {
    isMobile && drawingMode && tabValue === 1 && setDrawingMode(false);
  }, [drawingMode, tabValue]);

  useEffect(() => {
    setDownloads(initialDownloads);
  }, [initialDownloads]);

  const deleteResourceError = (): void =>
    toggleNotification(t('notifications:deleteResourceError'));

  const deleteResourceCompleted = async ({
    deleteResource,
  }: DeleteResourceMutation): Promise<void> => {
    if (deleteResource) {
      if (!!deleteResource.errors && !!deleteResource.errors.length) {
        deleteResourceError();
      } else if (deleteResource.successMessage) {
        toggleNotification(deleteResource.successMessage);
        await Router.push(urls.course(courseId));
        sa_event('delete_resource');
      } else {
        deleteResourceError();
      }
    } else {
      deleteResourceError();
    }
  };

  const [deleteResource] = useDeleteResourceMutation({
    onCompleted: deleteResourceCompleted,
    onError: deleteResourceError,
    context,
  });

  const handleDeleteResource = async (): Promise<void> => {
    try {
      await confirm({
        title: `${t('resource:delete')}?`,
        description: t('resource:confirmDelete'),
      });

      await deleteResource({ variables: { id: resourceId } });
    } catch {
      // User cancelled.
    }
  };

  const onDownloadResourceCompleted = ({ downloadResource }: DownloadResourceMutation): void => {
    if (downloadResource && downloadResource.resource) {
      const downloads = String(downloadResource.resource.downloads);
      setDownloads(downloads);
    }
  };

  const [downloadResource] = useDownloadResourceMutation({
    onCompleted: onDownloadResourceCompleted,
    context,
  });

  const handleDownloadButtonClick = async (): Promise<void> => {
    handleCloseActionsDialog();
    await downloadResource({ variables: { id: resourceId } });

    try {
      const res = await fetch(file, {
        headers: new Headers({ Origin: location.origin }),
        mode: 'cors',
      });

      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.download = title;
      a.href = blobUrl;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      toggleUnexpectedErrorNotification();
    }
  };

  const handlePrintButtonClick = async (): Promise<void> => {
    handleCloseActionsDialog();

    try {
      const res = await fetch(file, {
        headers: new Headers({ Origin: location.origin }),
        mode: 'cors',
      });

      // TODO: See if this blob conversion removes the CORS error in QA and remove this if it works.
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      await import('print-js');

      // @ts-ignore: TS doesn't detect the `print-js` import.
      printJS(blobUrl); // eslint-disable-line no-undef
    } catch {
      toggleUnexpectedErrorNotification();
    }
  };

  const renderCourseLink = !!courseId && (
    <TextLink href={urls.course(courseId)}>{courseName}</TextLink>
  );

  const renderSchoolLink = !!schoolId && (
    <TextLink href={urls.school(schoolId)}>{schoolName}</TextLink>
  );

  const infoItems = [
    {
      label: t('common:date'),
      value: resourceDate,
    },
    {
      label: t('common:resourceType'),
      value: resourceType,
    },
    {
      label: t('common:stars'),
      value: stars,
    },
    {
      label: t('common:score'),
      value: score,
    },
    {
      label: t('common:downloads'),
      value: downloads,
    },
    {
      label: t('common:course'),
      value: renderCourseLink,
    },
    {
      label: t('common:school'),
      value: renderSchoolLink,
    },
  ];

  const renderDrawingModeControls = <DrawingModeControls />;

  const shareDialogParams = {
    header: t('resource:shareHeader'),
    title: t('resource:shareTitle', { resourceTitle }),
    text: t('resource:shareText', { resourceTitle, creatorUsername }),
  };

  const renderShareButton = (
    <ShareButton tooltip={t('resource-tooltips:share')} shareDialogParams={shareDialogParams} />
  );

  const infoDialogParams = {
    header: title,
    emoji,
    creator: resourceCreator,
    created,
    infoItems,
  };

  const renderInfoButton = (
    <InfoButton tooltip={t('resource-tooltips:info')} infoDialogParams={infoDialogParams} />
  );

  const renderDownloadAction = isMobile && (
    <MenuItem onClick={handleDownloadButtonClick}>
      <ListItemIcon>
        <CloudDownloadOutlined />
      </ListItemIcon>
      <ListItemText>{t('resource:downloadPdf')}</ListItemText>
    </MenuItem>
  );

  const renderPrintAction = isMobile && (
    <MenuItem onClick={handlePrintButtonClick}>
      <ListItemIcon>
        <PrintOutlined />
      </ListItemIcon>
      <ListItemText>{t('resource:printPdf')}</ListItemText>
    </MenuItem>
  );
  const actionsDialogParams = {
    shareDialogParams,
    deleteActionParams: {
      text: t('resource:delete'),
      callback: handleDeleteResource,
      disabled: verified === false,
    },
    shareText: t('resource:share'),
    renderCustomActions: [renderDownloadAction, renderPrintAction],
    hideDeleteAction: !isOwner,
  };

  const renderActionsButton = (
    <ActionsButton
      tooltip={t('resource-tooltips:actions')}
      actionsDialogParams={actionsDialogParams}
    />
  );

  // Hide these buttons from the custom bottom navbar when in discussion tab.
  const renderDrawingModeButton = tabValue === 0 && <DrawingModeButton />;
  const renderRotateButton = tabValue === 0 && <RotateButton />;

  const renderScore = (
    <Typography className={classes.score} variant="subtitle1" color="textSecondary">
      {score}
    </Typography>
  );

  // Only render for non-verified users and owners to make the score more clear.
  const renderScoreIcon = (!verified || isOwner) && <ThumbsUpDownOutlined color="disabled" />;

  const renderDefaultCustomBottomNavbarContent = (
    <Grid container>
      <Grid item xs={6} container justify="flex-start">
        {renderRotateButton}
        {renderDrawingModeButton}
      </Grid>
      <Grid item xs={6} container justify="flex-end" alignItems="center">
        {renderStarButton}
        {renderUpvoteButton}
        {renderScoreIcon}
        {renderScore}
        {renderDownvoteButton}
      </Grid>
    </Grid>
  );

  const renderCustomBottomNavbarContent = drawingMode
    ? renderDrawingModeControls
    : renderDefaultCustomBottomNavbarContent;

  // Only render the custom bottom navbar in the resource tab or if the user is verified since all of the non-PDF actions are only available for verified users.
  // The default bottom navbar will be automatically shown for non-verified users who are not in the resource tab.
  const renderCustomBottomNavbar = (!!verified || tabValue === 0) && (
    <BottomNavigation>
      <CustomBottomNavbarContainer>{renderCustomBottomNavbarContent}</CustomBottomNavbarContainer>
    </BottomNavigation>
  );

  const toolbarProps = {
    title,
    emoji,
    courseId,
    renderStarButton,
    renderUpvoteButton,
    renderScore,
    renderDownvoteButton,
    handleDownloadButtonClick,
    handlePrintButtonClick,
  };

  const renderTopToolbar = <ResourceTopToolbar {...toolbarProps} />;
  const renderPdfViewer = <PdfViewer file={file} />;
  const renderBottomToolbar = <ResourceBottomToolbar />;

  const renderDiscussionHeader = (
    <DiscussionHeader
      renderShareButton={renderShareButton}
      renderInfoButton={renderInfoButton}
      renderActionsButton={renderActionsButton}
    />
  );

  const renderDiscussion = (
    <Discussion resource={resource} noCommentsText={t('resource:noComments')} />
  );

  const renderMobileContent = isMobile && (
    <Paper className={classes.mobileContainer}>
      <Tabs {...tabsProps}>
        <Tab label={t('common:resource')} />
        <Tab label={`${t('common:discussion')} (${commentCount})`} />
      </Tabs>
      <TabPanel {...firstTabPanelProps}>{renderPdfViewer}</TabPanel>
      <TabPanel {...secondTabPanelProps}>{renderDiscussion}</TabPanel>
    </Paper>
  );

  const renderDesktopContent = isTabletOrDesktop && (
    <Grid container spacing={2} className={classes.desktopContainer}>
      <Grid item container xs={12} md={6} lg={7} xl={8}>
        <Paper className={clsx(classes.paperContainer, classes.resourceContainer)}>
          {renderTopToolbar}
          {renderPdfViewer}
          {renderBottomToolbar}
        </Paper>
      </Grid>
      <Grid item container xs={12} md={6} lg={5} xl={4}>
        <Paper className={clsx(classes.paperContainer)}>
          {renderDiscussionHeader}
          {renderDiscussion}
        </Paper>
      </Grid>
    </Grid>
  );

  const layoutProps = {
    seoProps,
    customBottomNavbar: renderCustomBottomNavbar,
    topNavbarProps: {
      renderHeaderRight: renderActionsButton,
      renderHeaderRightSecondary: renderInfoButton,
    },
  };

  if (loading) {
    return <LoadingTemplate seoProps={seoProps} />;
  }

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" seoProps={seoProps} />;
  }

  if (error) {
    return <ErrorTemplate variant="error" seoProps={seoProps} />;
  }

  return (
    <MainTemplate {...layoutProps}>
      {renderMobileContent}
      {renderDesktopContent}
    </MainTemplate>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: 'blocking',
});

const namespaces = ['resource', 'resource-tooltips', 'discussion', 'discussion-tooltips'];

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  const apolloClient = initApolloClient();
  const t = await getT(locale, 'resource');
  const variables = R.pick(['id'], params);
  const context = getLanguageHeaderContext(locale);

  const { data } = await apolloClient.query({
    query: ResourceSeoPropsDocument,
    variables,
    context,
  });

  const resource = R.prop('resource', data);

  if (!resource) {
    return {
      notFound: true,
    };
  }

  const resourceTitle = R.propOr('', 'title', resource);
  const resourceDate = R.propOr('', 'date', resource);

  const seoProps = {
    title: `${resourceTitle} - ${resourceDate}`,
    description: t('description', { resourceTitle, resourceDate }),
  };

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
      _ns: await loadNamespaces(namespaces, locale),
      seoProps,
    },
    revalidate: MAX_REVALIDATION_INTERVAL,
  };
};

const withWrappers = R.compose(withUserMe, withActions, withInfo, withPdfViewer, withDiscussion);

export default withWrappers(ResourceDetailPage);
