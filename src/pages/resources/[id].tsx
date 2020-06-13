import { Box, Button, Grid, IconButton, ListItemText, MenuItem, Tab, Tooltip, Typography } from '@material-ui/core';
import {
    CancelOutlined,
    CloudDownloadOutlined,
    DeleteOutline,
    KeyboardArrowRightOutlined,
    PrintOutlined,
    TabUnselectedOutlined,
} from '@material-ui/icons';
import { useConfirm } from 'material-ui-confirm';
import { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
    CommentObjectType,
    DeleteResourceMutation,
    ResourceDetailDocument,
    ResourceObjectType,
    useDeleteResourceMutation,
    UserObjectType,
    VoteObjectType,
} from '../../../generated/graphql';
import {
    DiscussionHeader,
    InfoModalContent,
    MainLayout,
    NavbarContainer,
    NotFoundLayout,
    PDFViewer,
    StarButton,
    StyledBottomNavigation,
    StyledCard,
    StyledDrawer,
    StyledList,
    StyledTabs,
    TextLink,
    TopLevelCommentThread,
} from '../../components';
import {
    useAuthContext,
    useCommentModalContext,
    useDeviceContext,
    useNotificationsContext,
    usePDFViewerContext,
} from '../../context';
import { includeDefaultNamespaces } from '../../i18n';
import { useSSRApollo, withAuthSync, withSSRAuth, withUserAgent } from '../../lib';
import { I18nProps, MaxWidth } from '../../types';
import { mediaURL, useActionsDrawer, useInfoDrawer, useShare, useTabs, useVotes } from '../../utils';

interface Props extends I18nProps {
    resource?: ResourceObjectType;
}

const ResourceDetailPage: NextPage<Props> = ({ resource }) => {
    const { t } = useTranslation();
    const isMobile = useDeviceContext();
    const { toggleNotification } = useNotificationsContext();
    const confirm = useConfirm();
    const { user, verified, verificationRequiredTooltip } = useAuthContext();
    const resourceTitle = R.propOr('', 'title', resource) as string;
    const resourceDate = R.propOr('', 'date', resource) as string;
    const resourceType = R.propOr('', 'resourceType', resource) as string;
    const courseName = R.pathOr('', ['course', 'name'], resource) as string;
    const schoolName = R.pathOr('', ['school', 'name'], resource) as string;
    const courseId = R.pathOr('', ['course', 'id'], resource) as string;
    const schoolId = R.pathOr('', ['school', 'id'], resource) as string;
    const creatorId = R.pathOr('', ['user', 'id'], resource) as string;
    const fullResourceTitle = `${resourceTitle} - ${resourceDate}`;
    const file = mediaURL(R.propOr(undefined, 'file', resource));
    const resourceId = R.propOr('', 'id', resource) as string;
    const comments = R.propOr([], 'comments', resource) as CommentObjectType[];
    const initialVote = (R.propOr(null, 'vote', resource) as unknown) as VoteObjectType | null;
    const initialScore = String(R.propOr(0, 'score', resource));
    const starred = !!R.propOr(undefined, 'starred', resource);
    const isOwner = !!user && user.id === creatorId;
    const resourceUser = R.propOr(undefined, 'user', resource) as UserObjectType;
    const created = R.propOr(undefined, 'created', resource) as string;
    const commentCount = comments.length;
    const { setDrawMode, drawMode, screenshot, setRotate } = usePDFViewerContext();
    const handleCancelDraw = (): void => setDrawMode(false);
    const { toggleCommentModal } = useCommentModalContext();
    const { tabValue, setTabValue, handleTabChange } = useTabs();
    const { renderShareButton } = useShare(resourceTitle);
    const { commentModalOpen } = useCommentModalContext();
    const { renderInfoHeader, renderInfoButton, ...infoDrawerProps } = useInfoDrawer();

    const {
        renderActionsHeader,
        handleCloseActions,
        renderShareAction,
        renderReportAction,
        renderActionsButton,
        ...actionsDrawerProps
    } = useActionsDrawer(resourceTitle);

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

    const handleStartDrawing = (): void => {
        setRotate(0);
        setDrawMode(true);
    };

    const handleContinueDraw = (): void => {
        setDrawMode(false);
        toggleCommentModal(true);
    };

    const staticBackUrl = {
        href: '/courses/[id]',
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
                Router.push('/courses/' + courseId);
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

    const handleDownloadPDF = async (e: SyntheticEvent): Promise<void> => {
        handleCloseActions(e);

        try {
            const res = await fetch(file, {
                headers: new Headers({ Origin: location.origin }),
                mode: 'cors',
            });

            const blob = await res.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.download = fullResourceTitle;
            a.href = blobUrl;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch {
            toggleNotification(t('notifications:downloadResourceError'));
        }
    };

    const handlePrintPDF = async (e: SyntheticEvent): Promise<void> => {
        handleCloseActions(e);

        try {
            await import('print-js');
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore: TS doesn't detect the `print-js` import.
            printJS(file);
        } catch {
            toggleNotification(t('notifications:printResourceError'));
        }
    };

    const renderCourseLink = !!courseId && <TextLink {...staticBackUrl}>{courseName}</TextLink>;

    const renderSchoolLink = !!schoolId && (
        <TextLink href="/schools/[id]" as={`/schools/${schoolId}`} color="primary">
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

    const renderMarkAreaButton = (
        <Tooltip title={t('tooltips:markArea')}>
            <IconButton onClick={handleStartDrawing} size="small" color={isMobile ? 'default' : 'secondary'}>
                <TabUnselectedOutlined />
            </IconButton>
        </Tooltip>
    );

    const renderDownloadButton = (
        <Tooltip title={t('tooltips:download')}>
            <IconButton onClick={handleDownloadPDF} size="small" color="secondary">
                <CloudDownloadOutlined />
            </IconButton>
        </Tooltip>
    );

    const renderPrintButton = (
        <Tooltip title={t('tooltips:print')}>
            <IconButton onClick={handlePrintPDF} size="small" color="secondary">
                <PrintOutlined />
            </IconButton>
        </Tooltip>
    );

    const renderDrawModeContent = (
        <Grid container alignItems="center">
            <Grid item xs={isMobile ? 6 : 5} container justify="flex-start">
                <Button
                    onClick={handleCancelDraw}
                    startIcon={<CancelOutlined />}
                    color={isMobile ? 'default' : 'secondary'}
                >
                    {t('common:cancel')}
                </Button>
            </Grid>
            {!isMobile && (
                <Grid item xs={2}>
                    <Typography variant="subtitle1">{t('resource:drawMode')}</Typography>
                </Grid>
            )}
            <Grid item xs={isMobile ? 6 : 5} container justify="flex-end">
                <Button
                    onClick={handleContinueDraw}
                    endIcon={<KeyboardArrowRightOutlined />}
                    disabled={!screenshot}
                    color={isMobile ? 'primary' : 'secondary'}
                >
                    {t('common:continue')}
                </Button>
            </Grid>
        </Grid>
    );

    const renderPreviewBottomNavbarContent = (
        <Grid container>
            <Grid item xs={6} container justify="flex-start">
                {renderMarkAreaButton}
            </Grid>
            <Grid item xs={6} container justify="flex-end">
                {renderStarButton}
                {renderUpVoteButton}
                {renderDownVoteButton}
            </Grid>
        </Grid>
    );

    const renderBottomNavbarLeft = (
        <StyledBottomNavigation>
            <NavbarContainer>{drawMode ? renderDrawModeContent : renderPreviewBottomNavbarContent}</NavbarContainer>
        </StyledBottomNavigation>
    );

    const renderBottomNavbarRight = (
        <StyledBottomNavigation>
            <NavbarContainer>
                <Grid container justify="flex-end">
                    {renderStarButton}
                    {renderUpVoteButton}
                    {renderDownVoteButton}
                </Grid>
            </NavbarContainer>
        </StyledBottomNavigation>
    );

    const pdfViewerProps = {
        file,
        title: fullResourceTitle,
        renderMarkAreaButton,
        renderDrawModeContent,
        renderDownloadButton,
        renderPrintButton,
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

    const renderPDFViewer = <PDFViewer {...pdfViewerProps} />;
    const renderDiscussion = <TopLevelCommentThread {...commentThreadProps} />;
    const renderDiscussionHeader = <DiscussionHeader {...discussionHeaderProps} />;

    const renderTabs = (
        <StyledTabs value={tabValue} onChange={handleTabChange}>
            <Tab label={t('common:resource')} />
            <Tab label={`${t('common:discussion')} (${commentCount})`} />
        </StyledTabs>
    );

    const renderLeftTab = tabValue === 0 && (
        <Box display="flex" flexGrow="1" position="relative">
            {renderPDFViewer}
        </Box>
    );

    const renderRightTab = tabValue === 1 && (
        <Box display="flex" flexGrow="1">
            {renderDiscussion}
        </Box>
    );

    const renderMobileContent = isMobile && (
        <StyledCard>
            {renderTabs}
            {renderLeftTab}
            {renderRightTab}
        </StyledCard>
    );

    const renderDesktopContent = !isMobile && (
        <Grid className="desktop-content" container>
            <Grid item container md={7} lg={8}>
                <StyledCard>
                    <Box position="relative" flexGrow="1" display="flex">
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
        <MenuItem onClick={handleDownloadPDF}>
            <ListItemText>
                <CloudDownloadOutlined /> {t('common:download')}
            </ListItemText>
        </MenuItem>
    );

    const renderPrintAction = isMobile && (
        <MenuItem onClick={handlePrintPDF}>
            <ListItemText>
                <PrintOutlined /> {t('common:print')}
            </ListItemText>
        </MenuItem>
    );

    const renderActions = (
        <StyledList>
            {renderShareAction}
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
            title: fullResourceTitle,
            description: t('resource:description'),
        },
        topNavbarProps: {
            staticBackUrl: staticBackUrl,
            headerRight: renderActionsButton,
            headerRightSecondary: renderInfoButton,
        },
        customBottomNavbar: tabValue === 0 ? renderBottomNavbarLeft : renderBottomNavbarRight,
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
