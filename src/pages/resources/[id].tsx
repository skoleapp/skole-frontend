import {
    Box,
    Button,
    Chip,
    Grid,
    IconButton,
    ListItemText,
    MenuItem,
    Tab,
    Tooltip,
    Typography,
} from '@material-ui/core';
import {
    CancelOutlined,
    CloudDownloadOutlined,
    DeleteOutline,
    InfoOutlined,
    KeyboardArrowRightOutlined,
    MoreHorizOutlined,
    PrintOutlined,
    TabUnselectedOutlined,
    ThumbDownOutlined,
    ThumbUpOutlined,
} from '@material-ui/icons';
import { useConfirm } from 'material-ui-confirm';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
dynamic(() => import('print-js'), { ssr: false });

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
    DiscussionBox,
    InfoModalContent,
    MainLayout,
    NavbarContainer,
    NotFoundLayout,
    PdfViewer,
    StarButton,
    StyledBottomNavigation,
    StyledCard,
    StyledDrawer,
    StyledList,
    StyledTabs,
    TextLink,
} from '../../components';
import {
    useAuthContext,
    useCommentModalContext,
    useDeviceContext,
    useNotificationsContext,
    usePDFViewerContext,
} from '../../context';
import { includeDefaultNamespaces } from '../../i18n';
import { withApolloSSR, withAuthSync } from '../../lib';
import { I18nProps, MaxWidth, SkolePageContext } from '../../types';
import { mediaURL, useDrawer, useOptions, useTabs, useVotes } from '../../utils';

interface Props extends I18nProps {
    resource?: ResourceObjectType;
}

const ResourceDetailPage: NextPage<Props> = ({ resource }) => {
    const { t } = useTranslation();
    const isMobile = useDeviceContext();
    const { toggleNotification } = useNotificationsContext();
    const confirm = useConfirm();
    const { user, verified, notVerifiedTooltip } = useAuthContext();
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
    const { setDrawMode, drawMode, screenshot, setRotate } = usePDFViewerContext();
    const handleCancelDraw = (): void => setDrawMode(false);
    const upVoteButtonTooltip = !!notVerifiedTooltip ? notVerifiedTooltip : t('resource:upvoteTooltip');
    const downVoteButtonTooltip = !!notVerifiedTooltip ? notVerifiedTooltip : t('resource:downvoteTooltip');
    const { toggleCommentModal } = useCommentModalContext();
    const { tabValue, setTabValue, handleTabChange } = useTabs();
    const { commentModalOpen } = useCommentModalContext();

    const { renderHeader: renderInfoHeader, handleOpen: handleOpenInfo, ...infoDrawerProps } = useDrawer(
        t('resource:infoHeader'),
    );

    const {
        renderShareOption,
        renderReportOption,
        renderOptionsHeader,
        drawerProps: { handleOpen: handleOpenOptions, ...optionDrawerProps },
    } = useOptions(resourceTitle);

    const { onClose: closeOptions } = optionDrawerProps;

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

    const { score, upVoteButtonProps, downVoteButtonProps, handleVote } = useVotes({
        initialVote,
        initialScore,
        isOwner,
        color: isMobile ? 'default' : 'secondary',
    });

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
        try {
            await confirm({ title: t('resource:deleteResource'), description: t('resource:confirmDesc') });
            deleteResource({ variables: { id: resourceId } });
        } catch {
        } finally {
            closeOptions(e);
        }
    };

    const handleVoteClick = (status: number) => (): void => {
        handleVote({ status: status, resource: resourceId });
    };

    const renderCourseLink = !!courseId && <TextLink {...staticBackUrl}>{courseName}</TextLink>;

    const handleDownloadPdf = async (e: SyntheticEvent): Promise<void> => {
        closeOptions(e);

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

    const handlePrintPdf = async (e: SyntheticEvent): Promise<void> => {
        closeOptions(e);
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore: `print-js` is imported at the top.
        printJS(file);
    };

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

    const renderStarButton = (
        <StarButton
            starred={starred}
            resource={resourceId}
            starredTooltip={t('resource:starredTooltip')}
            unstarredTooltip={t('resource:unstarredTooltip')}
            color={isMobile ? 'default' : 'secondary'}
        />
    );

    const renderUpVoteButton = !isOwner && (
        <Tooltip title={upVoteButtonTooltip}>
            <span>
                <IconButton onClick={handleVoteClick(1)} {...upVoteButtonProps}>
                    <ThumbUpOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );

    const renderDownVoteButton = !isOwner && (
        <Tooltip title={downVoteButtonTooltip}>
            <span>
                <IconButton onClick={handleVoteClick(-1)} {...downVoteButtonProps}>
                    <ThumbDownOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );

    const renderMarkAreaButton = (
        <Tooltip title={t('resource:markAreaTooltip')}>
            <IconButton onClick={handleStartDrawing} size="small" color={isMobile ? 'default' : 'secondary'}>
                <TabUnselectedOutlined />
            </IconButton>
        </Tooltip>
    );

    const renderDownloadButton = (
        <Tooltip title={t('resource:downloadResourceTooltip')}>
            <IconButton onClick={handleDownloadPdf} size="small" color="secondary">
                <CloudDownloadOutlined />
            </IconButton>
        </Tooltip>
    );

    const renderPrintButton = (
        <Tooltip title={t('resource:printResourceTooltip')}>
            <IconButton onClick={handlePrintPdf} size="small" color="secondary">
                <PrintOutlined />
            </IconButton>
        </Tooltip>
    );

    const renderDrawModeTitle = <Typography variant="subtitle1">{t('resource:drawMode')}</Typography>;

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
                    <Chip label={renderDrawModeTitle} variant="outlined" color="secondary" />
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

    const renderInfoButton = (
        <Tooltip title={t('resource:infoTooltip')}>
            <IconButton onClick={handleOpenInfo} color="secondary">
                <InfoOutlined />
            </IconButton>
        </Tooltip>
    );

    const renderActionsButton = (
        <Tooltip title={t('resource:optionsTooltip')}>
            <IconButton onClick={handleOpenOptions} color="secondary">
                <MoreHorizOutlined />
            </IconButton>
        </Tooltip>
    );

    const pdfViewerProps = {
        file,
        title: fullResourceTitle,
        renderMarkAreaButton,
        renderDrawModeContent,
        renderDownloadButton,
        renderPrintButton,
    };

    const discussionBoxProps = {
        comments,
        target: { resource: Number(resourceId) },
        formKey: 'resource',
        placeholderText: t('resource:commentsPlaceholder'),
    };

    const renderPdfViewer = <PdfViewer {...pdfViewerProps} />;
    const renderDiscussion = <DiscussionBox {...discussionBoxProps} />;

    const renderTabs = (
        <StyledTabs value={tabValue} onChange={handleTabChange}>
            <Tab label={t('common:resource')} />
            <Tab label={`${t('common:discussion')} (${comments.length})`} />
        </StyledTabs>
    );

    const renderLeftTab = tabValue === 0 && (
        <Box display="flex" flexGrow="1" position="relative">
            {renderPdfViewer}
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

    // const renderBreadcrumbs = (
    //     <Breadcrumbs>
    //         <TextLink href="/" color="secondary">
    //             {t('common:home')}
    //         </TextLink>
    //         <TextLink href="/search" color="secondary">
    //             {t('common:search')}
    //         </TextLink>
    //         <TextLink {...staticBackUrl} color="secondary">
    //             {courseName}
    //         </TextLink>
    //         <TextLink href="/resources/[id]" as={`/resources/${resourceId}`} color="secondary">
    //             {fullResourceTitle}
    //         </TextLink>
    //     </Breadcrumbs>
    // );

    const renderDiscussionHeader = (
        <Box id="discussion-header">
            <Grid container alignItems="center">
                <Grid item xs={6} container justify="flex-start">
                    <Typography variant="subtitle1">{`${t('common:discussion')} (${comments.length})`}</Typography>
                </Grid>
                <Grid item xs={6} container justify="flex-end">
                    {renderStarButton}
                    {renderUpVoteButton}
                    {renderDownVoteButton}
                    {renderInfoButton}
                    {renderActionsButton}
                </Grid>
            </Grid>
        </Box>
    );

    const renderDesktopContent = !isMobile && (
        <Grid id="desktop-container" container>
            <Grid item container md={7} lg={8}>
                <StyledCard>
                    <Box position="relative" flexGrow="1" display="flex">
                        {renderPdfViewer}
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

    const renderDeleteOption = isOwner && (
        <MenuItem disabled={verified === false}>
            <ListItemText onClick={handleDeleteResource}>
                <DeleteOutline /> {t('resource:deleteResource')}
            </ListItemText>
        </MenuItem>
    );

    const renderDownloadOption = isMobile && (
        <MenuItem onClick={handleDownloadPdf}>
            <ListItemText>
                <CloudDownloadOutlined /> {t('common:download')}
            </ListItemText>
        </MenuItem>
    );

    const renderPrintOption = isMobile && (
        <MenuItem onClick={handlePrintPdf}>
            <ListItemText>
                <PrintOutlined /> {t('common:print')}
            </ListItemText>
        </MenuItem>
    );

    const renderOptions = (
        <StyledList>
            {renderShareOption}
            {renderReportOption}
            {renderDeleteOption}
            {renderDownloadOption}
            {renderPrintOption}
        </StyledList>
    );

    const renderOptionsDrawer = (
        <StyledDrawer {...optionDrawerProps}>
            {renderOptionsHeader}
            {renderOptions}
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
            <StyledResourceDetailPage>
                <MainLayout {...layoutProps}>
                    {renderMobileContent}
                    {renderDesktopContent}
                    {renderInfoDrawer}
                    {renderOptionsDrawer}
                </MainLayout>
            </StyledResourceDetailPage>
        );
    } else {
        return <NotFoundLayout />;
    }
};

const StyledResourceDetailPage = styled(Box)`
    #desktop-container {
        flex-grow: 1;

        #discussion-header {
            height: 3rem;
            background-color: var(--gray);
            color: var(--secondary);
            padding: 0.5rem;

            .MuiIconButton-root {
                padding: 0.25rem;
            }
        }
    }
`;

export const getServerSideProps: GetServerSideProps = withApolloSSR(async ctx => {
    const { query, apolloClient } = ctx as SkolePageContext;
    const namespaces = { namespacesRequired: includeDefaultNamespaces(['resource']) };

    try {
        const { data } = await apolloClient.query({
            query: ResourceDetailDocument,
            variables: query,
        });

        return { props: { ...data, ...namespaces } };
    } catch {
        return { props: { ...namespaces } };
    }
});

export default withAuthSync(ResourceDetailPage);
