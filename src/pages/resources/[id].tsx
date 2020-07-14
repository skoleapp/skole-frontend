import { Box, Grid, ListItemText, MenuItem, Tab } from '@material-ui/core';
import { CloudDownloadOutlined, DeleteOutline, PrintOutlined } from '@material-ui/icons';
import {
    CustomBottomNavbarContainer,
    DiscussionHeader,
    DrawModeButton,
    DrawModeControls,
    InfoModalContent,
    MainLayout,
    NotFoundLayout,
    PDFViewer,
    ResourceToolbar,
    StarButton,
    StyledBottomNavigation,
    StyledCard,
    StyledDrawer,
    StyledList,
    StyledSwipeableViews,
    StyledTabs,
    TextLink,
    TopLevelCommentThread,
} from 'components';
import {
    useAuthContext,
    useCommentModalContext,
    useDeviceContext,
    useNotificationsContext,
    usePDFViewerContext,
} from 'context';
import {
    CommentObjectType,
    DeleteResourceMutation,
    ResourceDetailDocument,
    ResourceObjectType,
    useDeleteResourceMutation,
    UserObjectType,
    VoteObjectType,
} from 'generated';
import { useActionsDrawer, useCommentQuery, useInfoDrawer, useShare, useSwipeableTabs, useVotes } from 'hooks';
import { includeDefaultNamespaces } from 'i18n';
import { useSSRApollo, withAuthSync, withSSRAuth, withUserAgent } from 'lib';
import { useConfirm } from 'material-ui-confirm';
import { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nProps, MaxWidth } from 'types';
import { mediaURL, urls } from 'utils';

interface Props extends I18nProps {
    resource?: ResourceObjectType;
}

const ResourceDetailPage: NextPage<Props> = ({ resource }) => {
    const { t } = useTranslation();
    const isMobile = useDeviceContext();
    const { toggleNotification } = useNotificationsContext();
    const confirm = useConfirm();
    const { userMe, verified, verificationRequiredTooltip } = useAuthContext();
    const resourceTitle = R.propOr('', 'title', resource) as string;
    const resourceDate = R.propOr('', 'date', resource) as string;
    const resourceType = R.propOr('', 'resourceType', resource) as string;
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
    const { tabValue, setTabValue, handleTabChange, handleIndexChange } = useSwipeableTabs();
    const { renderShareButton } = useShare({ text: resourceTitle });
    const { commentModalOpen } = useCommentModalContext();
    const { drawMode, setDrawMode } = usePDFViewerContext();

    // Automatically open comment thread if a comment has been provided as a query parameter.
    useCommentQuery(comments);

    const {
        renderInfoHeader,
        renderInfoButton,
        open: infoOpen,
        anchor: infoAnchor,
        onClose: handleCloseInfo,
    } = useInfoDrawer();

    const {
        renderActionsHeader,
        handleCloseActions,
        renderReportAction,
        renderActionsButton,
        open: actionsOpen,
        anchor: actionsAnchor,
    } = useActionsDrawer({ text: resourceTitle });

    const infoDrawerProps = { open: infoOpen, anchor: infoAnchor, onClose: handleCloseInfo };
    const actionsDrawerProps = { open: actionsOpen, anchor: actionsAnchor, onClose: handleCloseActions };

    const upVoteButtonTooltip = !!verificationRequiredTooltip
        ? verificationRequiredTooltip
        : isOwner
        ? t('tooltips:voteOwnResource')
        : t('tooltips:upVote');

    const downVoteButtonTooltip = !!verificationRequiredTooltip
        ? verificationRequiredTooltip
        : isOwner
        ? t('tooltips:voteOwnResource')
        : t('tooltips:downVote');

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
            if (!!deleteResource.errors) {
                deleteResourceError();
            } else if (deleteResource.message) {
                Router.push(`/courses/${courseId}`);
                toggleNotification(deleteResource.message);
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
        handleCloseActions(e);

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
        handleCloseActions(e);

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
        handleCloseActions(e);

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
        <StyledBottomNavigation>
            <CustomBottomNavbarContainer>
                {drawMode ? renderDrawModeControls : renderDefaultBottomNavbarContent}
            </CustomBottomNavbarContainer>
        </StyledBottomNavigation>
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
        formKey: 'resource',
        placeholderText: t('resource:commentsPlaceholder'),
    };

    const renderToolbar = <ResourceToolbar {...toolbarProps} />;
    const renderPDFViewer = <PDFViewer file={file} />;
    const renderDiscussion = <TopLevelCommentThread {...commentThreadProps} />;
    const renderDiscussionHeader = <DiscussionHeader {...discussionHeaderProps} />;

    const renderTabs = (
        <StyledTabs value={tabValue} onChange={handleTabChange}>
            <Tab label={t('common:resource')} />
            <Tab label={`${t('common:discussion')} (${commentCount})`} />
        </StyledTabs>
    );

    const renderSwipeableViews = (
        <StyledSwipeableViews index={tabValue} onChangeIndex={handleIndexChange}>
            <Box display="flex" flexGrow="1" position="relative">
                {renderPDFViewer}
            </Box>
            <Box display="flex" flexGrow="1">
                {renderDiscussion}
            </Box>
        </StyledSwipeableViews>
    );

    const renderMobileContent = isMobile && (
        <StyledCard>
            {renderTabs}
            {renderSwipeableViews}
        </StyledCard>
    );

    const renderDesktopContent = !isMobile && (
        <Grid className="desktop-content" container>
            <Grid item container md={7} lg={8}>
                <StyledCard>
                    <Box flexGrow="1" display="flex" flexDirection="column" position="relative">
                        {renderToolbar}
                        {renderPDFViewer}
                    </Box>
                </StyledCard>
            </Grid>
            <Grid item container md={5} lg={4}>
                <StyledCard marginLeft>
                    {renderDiscussionHeader}
                    {renderDiscussion}
                </StyledCard>
            </Grid>
        </Grid>
    );

    const renderInfo = <InfoModalContent user={resourceUser} created={created} infoItems={infoItems} />;

    const renderInfoDrawer = (
        <StyledDrawer {...infoDrawerProps}>
            {renderInfoHeader}
            {renderInfo}
        </StyledDrawer>
    );

    const renderDeleteAction = isOwner && (
        <MenuItem disabled={verified === false}>
            <ListItemText onClick={handleDeleteResource}>
                <DeleteOutline /> {t('common:delete')}
            </ListItemText>
        </MenuItem>
    );

    const renderDownloadAction = isMobile && (
        <MenuItem onClick={handleDownloadButtonClick}>
            <ListItemText>
                <CloudDownloadOutlined /> {t('common:download')}
            </ListItemText>
        </MenuItem>
    );

    const renderPrintAction = isMobile && (
        <MenuItem onClick={handlePrintButtonClick}>
            <ListItemText>
                <PrintOutlined /> {t('common:print')}
            </ListItemText>
        </MenuItem>
    );

    const renderActions = (
        <StyledList>
            {renderReportAction}
            {renderDeleteAction}
            {renderDownloadAction}
            {renderPrintAction}
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
            title,
            description: t('resource:description'),
        },
        topNavbarProps: {
            staticBackUrl: staticBackUrl,
            headerLeft: renderShareButton,
            headerRight: renderActionsButton,
            headerRightSecondary: renderInfoButton,
        },
        customBottomNavbar: renderCustomBottomNavbar,
        containerProps: {
            maxWidth: 'xl' as MaxWidth,
        },
    };

    if (!!resource) {
        return (
            <MainLayout {...layoutProps}>
                {renderMobileContent}
                {renderDesktopContent}
                {renderInfoDrawer}
                {renderActionsDrawer}
            </MainLayout>
        );
    } else {
        return <NotFoundLayout />;
    }
};

const wrappers = R.compose(withUserAgent, withSSRAuth);

export const getServerSideProps: GetServerSideProps = wrappers(async ctx => {
    const { apolloClient, initialApolloState } = useSSRApollo(ctx);
    const namespaces = { namespacesRequired: includeDefaultNamespaces(['resource']) };

    try {
        const { data } = await apolloClient.query({
            query: ResourceDetailDocument,
            variables: ctx.query,
        });

        return { props: { ...data, ...namespaces, initialApolloState } };
    } catch {
        return { props: { ...namespaces, initialApolloState } };
    }
});

export default withAuthSync(ResourceDetailPage);
