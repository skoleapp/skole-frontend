import {
  BottomNavigation,
  Grid,
  List,
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
  Paper,
  Tab,
  Tabs,
} from '@material-ui/core';
import { CloudDownloadOutlined, DeleteOutline, PrintOutlined } from '@material-ui/icons';
import clsx from 'clsx';
import {
  CustomBottomNavbarContainer,
  DiscussionHeader,
  DrawModeButton,
  DrawModeControls,
  ErrorTemplate,
  InfoDialogContent,
  LoadingTemplate,
  MainTemplate,
  NotFoundTemplate,
  OfflineTemplate,
  ResourceToolbar,
  ResponsiveDialog,
  RotateButton,
  ShareButton,
  StarButton,
  TabPanel,
  TextLink,
  TopLevelCommentThread,
} from 'components';
import dynamic from 'next/dynamic';
import {
  useAuthContext,
  useDiscussionContext,
  useNotificationsContext,
  usePdfViewerContext,
  useConfirmContext,
} from 'context';
import {
  DeleteResourceMutation,
  DownloadResourceMutation,
  ResourceObjectType,
  useDeleteResourceMutation,
  useDownloadResourceMutation,
  useResourceQuery,
} from 'generated';
import { withDiscussion, withPdfViewer, withUserMe } from 'hocs';
import {
  useActionsDialog,
  useInfoDialog,
  useLanguageHeaderContext,
  useMediaQueries,
  useTabs,
  useVotes,
} from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { BORDER_RADIUS } from 'theme';
import { mediaUrl, urls } from 'utils';
import { PdfViewerProps } from 'types';

// Here we make an exception for exclusive usage of named exports and use a default import to make sure this is never imported server-side.
// Reference: https://github.com/wojtekmaj/react-pdf/issues/136#issuecomment-716643894.
const PdfViewer = dynamic<PdfViewerProps>(() => import('../../components/resource/PdfViewer'), {
  ssr: false,
});

const useStyles = makeStyles(({ breakpoints }) => ({
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
}));

const ResourceDetailPage: NextPage = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { query } = useRouter();
  const { isMobile, isTabletOrDesktop } = useMediaQueries();
  const { toggleNotification } = useNotificationsContext();
  const { confirm } = useConfirmContext();
  const variables = R.pick(['id', 'page', 'pageSize'], query);
  const context = useLanguageHeaderContext();
  const { userMe, verified } = useAuthContext();
  const { data, loading, error } = useResourceQuery({ variables, context });
  const [resource, setResource] = useState<ResourceObjectType | null>(null);
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
  const comments = R.propOr([], 'comments', resource);
  const initialVote = R.propOr(null, 'vote', resource);
  const initialScore = String(R.propOr(0, 'score', resource));
  const downloads = String(R.propOr(0, 'downloads', resource));
  const starred = !!R.prop('starred', resource);
  const isOwner = !!userMe && userMe.id === creatorId;
  const resourceCreator = R.prop('user', resource);
  const creatorUsername = R.pathOr(t('common:communityUser'), ['user', 'username'], resource);
  const shareTitle = t('resource:shareTitle', { resourceTitle });
  const shareText = t('resource:shareText', { resourceTitle, creatorUsername });
  const shareParams = { shareHeader: t('resource:shareHeader'), shareTitle, shareText };
  const target = t('resource:target');
  const created = R.prop('created', resource);
  const { commentCount } = useDiscussionContext();
  const { commentModalOpen } = useDiscussionContext();
  const { drawMode, setDrawMode } = usePdfViewerContext();

  const { tabsProps, leftTabPanelProps, rightTabPanelProps, tabValue, setTabValue } = useTabs(
    comments,
  );

  const {
    infoDialogOpen,
    infoDialogHeaderProps,
    renderInfoButton,
    handleCloseInfoDialog,
  } = useInfoDialog({
    header: t('resource:infoHeader'),
    target,
  });

  const {
    actionsDialogOpen,
    actionsDialogHeaderProps,
    handleCloseActionsDialog,
    renderShareAction,
    renderReportAction,
    renderActionsButton,
  } = useActionsDialog({
    header: t('resource:actionsHeader'),
    share: t('resource:share'),
    target,
    shareParams,
  });

  const { renderUpvoteButton, renderDownvoteButton, score } = useVotes({
    initialVote,
    initialScore,
    isOwner,
    variables: { resource: resourceId },
    target,
  });

  // Update state after data fetching is complete.
  useEffect(() => {
    const initialResource = R.propOr(null, 'resource', data);
    setResource(initialResource);
  }, [data]);

  // If comment modal is opened in main tab, automatically switch to discussion tab.
  useEffect(() => {
    commentModalOpen && tabValue === 0 && setTabValue(1);
  }, [commentModalOpen]);

  // If draw mode is toggled on from discussion tab, change to file preview tab.
  useEffect(() => {
    drawMode && tabValue === 1 && setTabValue(0);
  }, [drawMode]);

  // If draw mode is on and user changes to discussion tab, automatically toggle draw mode off.
  useEffect(() => {
    drawMode && tabValue === 1 && setDrawMode(false);
  }, [tabValue]);

  const staticBackUrl = {
    href: urls.course(courseId),
  };

  const deleteResourceError = (): void => {
    toggleNotification(t('notifications:deleteResourceError'));
  };

  const deleteResourceCompleted = async ({
    deleteResource,
  }: DeleteResourceMutation): Promise<void> => {
    if (deleteResource) {
      if (!!deleteResource.errors && !!deleteResource.errors.length) {
        deleteResourceError();
      } else if (deleteResource.successMessage) {
        toggleNotification(deleteResource.successMessage);
        await Router.push(urls.course(courseId));
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

  const handleDeleteResource = async (e: SyntheticEvent): Promise<void> => {
    handleCloseActionsDialog(e);

    try {
      await confirm({
        title: t('resource:delete'),
        description: t('resource:confirmDelete'),
      });

      await deleteResource({ variables: { id: resourceId } });
    } catch {
      // User cancelled.
    }
  };

  const onDownloadResourceCompleted = ({ downloadResource }: DownloadResourceMutation): void => {
    if (downloadResource && downloadResource.resource) {
      !!resource &&
        setResource({
          ...resource,
          downloads: downloadResource.resource.downloads,
        });
    }
  };

  const [downloadResource] = useDownloadResourceMutation({
    onCompleted: onDownloadResourceCompleted,
    context,
  });

  const handleDownloadButtonClick = async (e: SyntheticEvent): Promise<void> => {
    handleCloseActionsDialog(e);
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
      toggleNotification(t('notifications:downloadPdfError'));
    }
  };

  const handlePrintButtonClick = async (e: SyntheticEvent): Promise<void> => {
    handleCloseActionsDialog(e);

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
      toggleNotification(t('notifications:printPdfError'));
    }
  };

  const renderCourseLink = !!courseId && <TextLink {...staticBackUrl}>{courseName}</TextLink>;

  const renderSchoolLink = !!schoolId && (
    <TextLink href={urls.school(schoolId)} as={schoolId} color="primary">
      {schoolName}
    </TextLink>
  );

  const infoItems = [
    {
      label: t('common:title'),
      value: resourceTitle,
    },
    {
      label: t('common:date'),
      value: resourceDate,
    },
    {
      label: t('common:resourceType'),
      value: resourceType,
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

  const starButtonProps = {
    starred,
    resource: resourceId,
    target,
  };

  // On desktop, render a disabled button for non-verified users.
  // On mobile, do not render the button at all for non-verified users.
  const renderStarButton = (!!verified || isTabletOrDesktop) && <StarButton {...starButtonProps} />;

  const renderDrawModeControls = <DrawModeControls />;
  const renderShareButton = <ShareButton {...shareParams} target={target} />;

  // Hide these buttons from the custom bottom navbar when in discussion tab.
  const renderDrawModeButton = tabValue === 0 && <DrawModeButton />;
  const renderRotateButton = tabValue === 0 && <RotateButton />;

  const renderDefaultBottomNavbarContent = (
    <Grid container>
      <Grid item xs={6} container justify="flex-start">
        {renderRotateButton}
        {renderDrawModeButton}
      </Grid>
      <Grid item xs={6} container justify="flex-end">
        {renderStarButton}
        {renderUpvoteButton}
        {renderDownvoteButton}
      </Grid>
    </Grid>
  );

  const renderCustomBottomNavbar = (
    <BottomNavigation>
      <CustomBottomNavbarContainer>
        {drawMode ? renderDrawModeControls : renderDefaultBottomNavbarContent}
      </CustomBottomNavbarContainer>
    </BottomNavigation>
  );

  const toolbarProps = {
    title,
    handleDownloadButtonClick,
    handlePrintButtonClick,
  };

  const discussionHeaderProps = {
    commentCount,
    renderStarButton,
    renderUpvoteButton,
    renderDownvoteButton,
    renderShareButton,
    renderInfoButton,
    renderActionsButton,
  };

  const commentThreadProps = {
    comments,
    target: { resource: Number(resourceId) },
    noComments: t('resource:noComments'),
  };

  const renderToolbar = <ResourceToolbar {...toolbarProps} />;
  const renderPdfViewer = <PdfViewer file={file} />;
  const renderDiscussionHeader = <DiscussionHeader {...discussionHeaderProps} />;
  const renderDiscussion = <TopLevelCommentThread {...commentThreadProps} />;

  const renderMobileContent = isMobile && (
    <Paper className={classes.mobileContainer}>
      <Tabs {...tabsProps}>
        <Tab label={t('common:resource')} />
        <Tab label={`${t('common:discussion')} (${commentCount})`} />
      </Tabs>
      <TabPanel {...leftTabPanelProps}>{renderPdfViewer}</TabPanel>
      <TabPanel {...rightTabPanelProps}>{renderDiscussion}</TabPanel>
    </Paper>
  );

  const renderDesktopContent = isTabletOrDesktop && (
    <Grid container spacing={2} className={classes.desktopContainer}>
      <Grid item container xs={12} md={6} lg={7} xl={8}>
        <Paper className={clsx(classes.paperContainer, classes.resourceContainer)}>
          {renderToolbar}
          {renderPdfViewer}
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

  const renderInfoDialogContent = (
    <InfoDialogContent creator={resourceCreator} created={created} infoItems={infoItems} />
  );

  const renderInfoDialog = (
    <ResponsiveDialog
      open={infoDialogOpen}
      onClose={handleCloseInfoDialog}
      dialogHeaderProps={infoDialogHeaderProps}
    >
      {renderInfoDialogContent}
    </ResponsiveDialog>
  );

  const renderDeleteAction = isOwner && (
    <MenuItem onClick={handleDeleteResource} disabled={verified === false}>
      <ListItemIcon>
        <DeleteOutline />
      </ListItemIcon>
      <ListItemText>{t('resource:delete')}</ListItemText>
    </MenuItem>
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

  const renderActionsDialogContent = (
    <List>
      {renderDeleteAction}
      {renderDownloadAction}
      {renderPrintAction}
      {renderShareAction}
      {renderReportAction}
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
    seoProps: {
      title,
      description: t('resource:description', { resourceTitle }),
    },
    customBottomNavbar: renderCustomBottomNavbar,
    topNavbarProps: {
      staticBackUrl,
      headerLeft: renderShareButton,
      headerRight: renderActionsButton,
      headerRightSecondary: renderInfoButton,
    },
  };

  if (loading) {
    return <LoadingTemplate />;
  }

  if (!!error && !!error.networkError) {
    return <OfflineTemplate />;
  }
  if (error) {
    return <ErrorTemplate />;
  }

  if (resource) {
    return (
      <MainTemplate {...layoutProps}>
        {renderMobileContent}
        {renderDesktopContent}
        {renderInfoDialog}
        {renderActionsDialog}
      </MainTemplate>
    );
  }
  return <NotFoundTemplate />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['resource'], locale),
  },
});

const withWrappers = R.compose(withUserMe, withPdfViewer, withDiscussion);

export default withWrappers(ResourceDetailPage);
