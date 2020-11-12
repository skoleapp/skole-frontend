import {
    BottomNavigation,
    Box,
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
    ErrorLayout,
    InfoDialogContent,
    LoadingLayout,
    MainLayout,
    NotFoundLayout,
    OfflineLayout,
    PdfViewer,
    ResourceToolbar,
    ResponsiveDialog,
    StarButton,
    TextLink,
    TopLevelCommentThread,
} from 'components';
import { useAuthContext, useDiscussionContext, useNotificationsContext, usePdfViewerContext } from 'context';
import {
    CommentObjectType,
    DeleteResourceMutation,
    DownloadResourceMutation,
    ResourceObjectType,
    ResourceQueryVariables,
    useDeleteResourceMutation,
    useDownloadResourceMutation,
    useResourceQuery,
    UserObjectType,
    VoteObjectType,
} from 'generated';
import { withDiscussion, withUserMe } from 'hocs';
import {
    useActionsDialog,
    useInfoDialog,
    useLanguageHeaderContext,
    useMediaQueries,
    useShare,
    useSwipeableTabs,
    useVotes,
} from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { useConfirm } from 'material-ui-confirm';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { BORDER_RADIUS } from 'theme';
import { mediaUrl, urls } from 'utils';

const useStyles = makeStyles(({ breakpoints }) => ({
    mobileContainer: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
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
        [breakpoints.up('lg')]: {
            borderRadius: BORDER_RADIUS,
        },
    },
    resourceContainer: {
        [breakpoints.up('lg')]: {
            borderRadius: `${BORDER_RADIUS} ${BORDER_RADIUS} 0.25rem 0.25rem`, // Disable round border for bottom right corner to better fit with the scroll bar.
        },
    },
}));

const ResourceDetailPage: NextPage = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const { query } = useRouter();
    const { isMobileOrTablet } = useMediaQueries();
    const { toggleNotification } = useNotificationsContext();
    const confirm = useConfirm();
    const variables: ResourceQueryVariables = R.pick(['id', 'page', 'pageSize'], query);
    const context = useLanguageHeaderContext();
    const { data, loading, error } = useResourceQuery({ variables, context });
    const { userMe, verified } = useAuthContext();
    const [resource, setResource] = useState<ResourceObjectType | null>(null);
    const resourceTitle: string = R.propOr('', 'title', resource);
    const resourceDate: string = R.propOr('', 'date', resource);
    const resourceType: string = R.pathOr('', ['resourceType', 'name'], resource);
    const courseName: string = R.pathOr('', ['course', 'name'], resource);
    const schoolName: string = R.pathOr('', ['school', 'name'], resource);
    const courseId: string = R.pathOr('', ['course', 'id'], resource);
    const schoolId: string = R.pathOr('', ['school', 'id'], resource);
    const creatorId: string = R.pathOr('', ['user', 'id'], resource);
    const title = `${resourceTitle} - ${resourceDate}`;
    const file = mediaUrl(R.propOr(undefined, 'file', resource));
    const resourceId: string = R.propOr('', 'id', resource);
    const comments: CommentObjectType[] = R.propOr([], 'comments', resource);
    const initialVote: VoteObjectType | null = R.propOr(null, 'vote', resource);
    const initialScore = String(R.propOr(0, 'score', resource));
    const downloads = String(R.propOr(0, 'downloads', resource));
    const starred = !!R.propOr(undefined, 'starred', resource);
    const isOwner = !!userMe && userMe.id === creatorId;
    const resourceUser: UserObjectType = R.propOr(undefined, 'user', resource);
    const created: string = R.propOr(undefined, 'created', resource);
    const commentCount = comments.length;
    const { tabValue, setTabValue, handleTabChange, handleIndexChange } = useSwipeableTabs(comments);
    const { renderShareButton } = useShare({ text: resourceTitle });
    const { commentModalOpen } = useDiscussionContext();
    const { drawMode, setDrawMode, swipingDisabled, swipeableViewsRef } = usePdfViewerContext();
    const { infoDialogOpen, infoDialogHeaderProps, renderInfoButton, handleCloseInfoDialog } = useInfoDialog();

    // Update state whenever we finish fetching.
    useEffect(() => {
        const initialResource: ResourceObjectType = R.propOr(null, 'resource', data);
        setResource(initialResource);
    }, [data]);

    const {
        actionsDialogOpen,
        actionsDialogHeaderProps,
        handleCloseActionsDialog,
        renderReportAction,
        renderActionsButton,
    } = useActionsDialog({ text: resourceTitle });

    const { renderUpVoteButton, renderDownVoteButton, score } = useVotes({
        initialVote,
        initialScore,
        isOwner,
        variables: { resource: resourceId },
    });

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

    const deleteResourceCompleted = async ({ deleteResource }: DeleteResourceMutation): Promise<void> => {
        if (!!deleteResource) {
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
                title: t('resource:deleteResourceTitle'),
                description: t('resource:deleteResourceDescription'),
            });

            await deleteResource({ variables: { id: resourceId } });
        } catch {
            // User cancelled.
        }
    };

    // Do nothing except log the error so we can see it in CloudWatch if the mutation fails.
    const onDownloadResourceError = (): void => console.log('Downloading resource failed.');

    const onDownloadResourceCompleted = ({ downloadResource }: DownloadResourceMutation): void => {
        if (!!downloadResource) {
            if (!!downloadResource.errors && !!downloadResource.errors.length) {
                onDownloadResourceError();
            } else if (!!downloadResource.resource) {
                setResource({ ...resource, downloads: downloadResource.resource.downloads } as ResourceObjectType);
            }
        }
    };

    const [downloadResource] = useDownloadResourceMutation({
        onCompleted: onDownloadResourceCompleted,
        onError: onDownloadResourceError,
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
            toggleNotification(t('notifications:downloadResourceError'));
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
            // Ignore: TS doesn't detect the `print-js` import.
            // @ts-ignore
            printJS(blobUrl);
        } catch {
            toggleNotification(t('notifications:printResourceError'));
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

    const renderStarButton = <StarButton starred={starred} resource={resourceId} />;
    const renderDrawModeButton = <DrawModeButton />;
    const renderDrawModeControls = <DrawModeControls />;

    const renderDefaultBottomNavbarContent = (
        <Grid container>
            <Grid item xs={6} container justify="flex-start">
                {renderDrawModeButton}
            </Grid>
            <Grid item xs={6} container justify="flex-end">
                {renderStarButton}
                {renderUpVoteButton}
                {renderDownVoteButton}
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
        renderUpVoteButton,
        renderDownVoteButton,
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
    const renderPDFViewer = <PdfViewer file={file} />;
    const renderDiscussion = <TopLevelCommentThread {...commentThreadProps} />;
    const renderDiscussionHeader = <DiscussionHeader {...discussionHeaderProps} />;

    const renderMobileContent = isMobileOrTablet && (
        <Paper className={classes.mobileContainer}>
            <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label={t('common:resource')} />
                <Tab label={`${t('common:discussion')} (${commentCount})`} />
            </Tabs>
            <Box flexGrow="1" position="relative">
                <SwipeableViews
                    disabled={swipingDisabled}
                    index={tabValue}
                    onChangeIndex={handleIndexChange}
                    ref={swipeableViewsRef}
                >
                    {renderPDFViewer}
                    {renderDiscussion}
                </SwipeableViews>
            </Box>
        </Paper>
    );

    const renderDesktopContent = !isMobileOrTablet && (
        <Grid container spacing={2} className={classes.desktopContainer}>
            <Grid item container xs={12} md={7} lg={8}>
                <Paper className={clsx(classes.paperContainer, classes.resourceContainer)}>
                    {renderToolbar}
                    {renderPDFViewer}
                </Paper>
            </Grid>
            <Grid item container xs={12} md={5} lg={4}>
                <Paper className={clsx(classes.paperContainer)}>
                    {renderDiscussionHeader}
                    {renderDiscussion}
                </Paper>
            </Grid>
        </Grid>
    );

    const renderInfoDialogContent = <InfoDialogContent user={resourceUser} created={created} infoItems={infoItems} />;

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
        <MenuItem disabled={verified === false}>
            <ListItemIcon>
                <DeleteOutline />
            </ListItemIcon>
            <ListItemText onClick={handleDeleteResource}>{t('common:delete')}</ListItemText>
        </MenuItem>
    );

    const renderDownloadAction = isMobileOrTablet && (
        <MenuItem onClick={handleDownloadButtonClick}>
            <ListItemIcon>
                <CloudDownloadOutlined />
            </ListItemIcon>
            <ListItemText>{t('common:download')}</ListItemText>
        </MenuItem>
    );

    const renderPrintAction = isMobileOrTablet && (
        <MenuItem onClick={handlePrintButtonClick}>
            <ListItemIcon>
                <PrintOutlined />
            </ListItemIcon>
            <ListItemText>{t('common:print')}</ListItemText>
        </MenuItem>
    );

    const renderActionsDialogContent = (
        <List>
            {renderDeleteAction}
            {renderDownloadAction}
            {renderPrintAction}
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
            staticBackUrl: staticBackUrl,
            headerLeft: renderShareButton,
            headerRight: renderActionsButton,
            headerRightSecondary: renderInfoButton,
        },
    };

    if (loading) {
        return <LoadingLayout />;
    }

    if (!!error && !!error.networkError) {
        return <OfflineLayout />;
    } else if (!!error) {
        return <ErrorLayout />;
    }

    if (!!resource) {
        return (
            <MainLayout {...layoutProps}>
                {renderMobileContent}
                {renderDesktopContent}
                {renderInfoDialog}
                {renderActionsDialog}
            </MainLayout>
        );
    } else {
        return <NotFoundLayout />;
    }
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

const withWrappers = R.compose<NextPage, NextPage, NextPage>(withDiscussion, withUserMe);

export default withWrappers(ResourceDetailPage);
