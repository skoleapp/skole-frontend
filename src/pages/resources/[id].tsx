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
    PDFViewer,
    ResourceToolbar,
    ResponsiveDialog,
    StarButton,
    TextLink,
    TopLevelCommentThread,
} from 'components';
import { useAuthContext, useDiscussionContext, useNotificationsContext, usePDFViewerContext } from 'context';
import {
    CommentObjectType,
    DeleteResourceMutation,
    ResourceObjectType,
    useDeleteResourceMutation,
    useResourceDetailQuery,
    UserObjectType,
    VoteObjectType,
} from 'generated';
import {
    useActionsDialog,
    useInfoDialog,
    useMediaQueries,
    useQueryOptions,
    useShare,
    useSwipeableTabs,
    useVotes,
} from 'hooks';
import { includeDefaultNamespaces, useTranslation, withUserMe } from 'lib';
import { useConfirm } from 'material-ui-confirm';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent, useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { BORDER_RADIUS } from 'theme';
import { AuthProps } from 'types';
import { mediaURL, redirect, urls } from 'utils';

const useStyles = makeStyles({
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
    },
    resourceContainer: {
        borderRadius: `${BORDER_RADIUS} ${BORDER_RADIUS} 0.5rem ${BORDER_RADIUS}`, // Disable round border for bottom right corner to better fit with the scroll bar.
    },
});

const ResourceDetailPage: NextPage<AuthProps> = ({ authLoading, authNetworkError }) => {
    const classes = useStyles();
    const { isFallback } = useRouter();
    const { t } = useTranslation();
    const queryOptions = useQueryOptions();
    const { data, loading: courseDataLoading, error } = useResourceDetailQuery(queryOptions);
    const loading = authLoading || isFallback || courseDataLoading;
    const networkError = (!!error && !!error.networkError) || !!authNetworkError;
    const { isMobileOrTablet } = useMediaQueries();
    const { toggleNotification } = useNotificationsContext();
    const confirm = useConfirm();
    const { userMe, verified, verificationRequiredTooltip } = useAuthContext();
    const resource: ResourceObjectType = R.propOr(null, 'resource', data);
    const resourceTitle = R.propOr('', 'title', resource) as string;
    const resourceDate = R.propOr('', 'date', resource) as string;
    const resourceType = R.pathOr('', ['resourceType', 'name'], resource) as string;
    const courseName = R.pathOr('', ['course', 'name'], resource) as string;
    const schoolName = R.pathOr('', ['school', 'name'], resource) as string;
    const courseId = R.pathOr('', ['course', 'id'], resource) as string;
    const schoolId = R.pathOr('', ['school', 'id'], resource) as string;
    const creatorId = R.pathOr('', ['user', 'id'], resource) as string;
    const title = `${resourceTitle} - ${resourceDate}`;
    const file = mediaURL(R.propOr(undefined, 'file', resource));
    const resourceId = R.propOr('', 'id', resource) as string;
    const comments = R.propOr([], 'comments', resource) as CommentObjectType[];
    const initialVote = (R.propOr(null, 'vote', resource) as unknown) as VoteObjectType | null;
    const initialScore = String(R.propOr(0, 'score', resource));
    const starred = !!R.propOr(undefined, 'starred', resource);
    const isOwner = !!userMe && userMe.id === creatorId;
    const resourceUser = R.propOr(undefined, 'user', resource) as UserObjectType;
    const created = R.propOr(undefined, 'created', resource) as string;
    const commentCount = comments.length;
    const { tabValue, setTabValue, handleTabChange, handleIndexChange } = useSwipeableTabs(comments);
    const { renderShareButton } = useShare({ text: resourceTitle });
    const { commentModalOpen } = useDiscussionContext();
    const { drawMode, setDrawMode, swipingDisabled } = usePDFViewerContext();
    const notFound = t('resource:notFound');
    const seoTitle = !!resource ? title : !isFallback ? notFound : '';
    const description = !!resource ? t('resource:description', { resourceTitle }) : !isFallback ? notFound : '';
    const { infoDialogOpen, infoDialogHeaderProps, renderInfoButton, handleCloseInfoDialog } = useInfoDialog();

    const {
        actionsDialogOpen,
        actionsDialogHeaderProps,
        handleCloseActionsDialog,
        renderReportAction,
        renderActionsButton,
    } = useActionsDialog({ text: resourceTitle });

    const upVoteButtonTooltip =
        verificationRequiredTooltip || (isOwner ? t('tooltips:voteOwnResource') : t('tooltips:upVote'));

    const downVoteButtonTooltip =
        verificationRequiredTooltip || (isOwner ? t('tooltips:voteOwnResource') : t('tooltips:downVote'));

    const { renderUpVoteButton, renderDownVoteButton, score } = useVotes({
        initialVote,
        initialScore,
        isOwner,
        variables: { resource: resourceId },
        upVoteButtonTooltip,
        downVoteButtonTooltip,
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
        href: urls.course,
        as: `/courses/${courseId}`,
    };

    const deleteResourceError = (): void => {
        toggleNotification(t('notifications:deleteResourceError'));
    };

    const deleteResourceCompleted = ({ deleteResource }: DeleteResourceMutation): void => {
        if (!!deleteResource) {
            if (!!deleteResource.errors && !!deleteResource.errors.length) {
                deleteResourceError();
            } else if (deleteResource.message) {
                toggleNotification(deleteResource.message);
                redirect(`/courses/${courseId}`);
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
    });

    const handleDeleteResource = async (e: SyntheticEvent): Promise<void> => {
        handleCloseActionsDialog(e);

        try {
            await confirm({
                title: t('resource:deleteResourceTitle'),
                description: t('resource:deleteResourceDescription'),
            });

            deleteResource({ variables: { id: resourceId } });
        } catch {
            // User cancelled.
        }
    };

    const handleDownloadButtonClick = async (e: SyntheticEvent): Promise<void> => {
        handleCloseActionsDialog(e);

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
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            printJS(blobUrl);
        } catch {
            toggleNotification(t('notifications:printResourceError'));
        }
    };

    const renderCourseLink = !!courseId && <TextLink {...staticBackUrl}>{courseName}</TextLink>;

    const renderSchoolLink = !!schoolId && (
        <TextLink href={urls.school} as={`/schools/${schoolId}`} color="primary">
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
    const renderPDFViewer = <PDFViewer file={file} />;
    const renderDiscussion = <TopLevelCommentThread {...commentThreadProps} />;
    const renderDiscussionHeader = <DiscussionHeader {...discussionHeaderProps} />;

    const renderMobileContent = isMobileOrTablet && (
        <Paper className={clsx('paper-container', classes.mobileContainer)}>
            <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label={t('common:resource')} />
                <Tab label={`${t('common:discussion')} (${commentCount})`} />
            </Tabs>
            <Box flexGrow="1" position="relative">
                <SwipeableViews disabled={swipingDisabled} index={tabValue} onChangeIndex={handleIndexChange}>
                    {renderPDFViewer}
                    {renderDiscussion}
                </SwipeableViews>
            </Box>
        </Paper>
    );

    const renderDesktopContent = !isMobileOrTablet && (
        <Grid container spacing={2} className={classes.desktopContainer}>
            <Grid item container xs={12} md={7} lg={8}>
                <Paper className={clsx(classes.paperContainer, classes.resourceContainer, 'paper-container')}>
                    {renderToolbar}
                    {renderPDFViewer}
                </Paper>
            </Grid>
            <Grid item container xs={12} md={5} lg={4}>
                <Paper className={clsx(classes.paperContainer, 'paper-container')}>
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

    const seoProps = {
        title: seoTitle,
        description,
    };

    const layoutProps = {
        seoProps,
        customBottomNavbar: renderCustomBottomNavbar,
        topNavbarProps: {
            staticBackUrl: staticBackUrl,
            headerLeft: renderShareButton,
            headerRight: renderActionsButton,
            headerRightSecondary: renderInfoButton,
        },
    };

    if (loading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    if (networkError) {
        return <OfflineLayout seoProps={seoProps} />;
    } else if (!!error) {
        return <ErrorLayout seoProps={seoProps} />;
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
        fallback: true,
    };
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['resource']),
    },
    revalidate: 1,
});

export default withUserMe(ResourceDetailPage);
