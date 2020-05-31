import { Box, Button, Grid, IconButton, ListItemText, MenuItem, Tooltip, Typography } from '@material-ui/core';
import {
    CancelOutlined,
    CloudDownloadOutlined,
    DeleteOutline,
    KeyboardArrowDownOutlined,
    KeyboardArrowRightOutlined,
    KeyboardArrowUpOutlined,
    PrintOutlined,
    TabUnselectedOutlined,
} from '@material-ui/icons';
import { useConfirm } from 'material-ui-confirm';
import { GetServerSideProps, NextPage } from 'next';
import dynamic from 'next/dynamic';
import Router from 'next/router';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const printJS = dynamic(() => import('print-js'), { ssr: false });

import * as R from 'ramda';
import React, { SyntheticEvent } from 'react';
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
    DiscussionBox,
    InfoModalContent,
    NavbarContainer,
    NotFoundLayout,
    PdfViewer,
    StarButton,
    StyledBottomNavigation,
    StyledList,
    TabLayout,
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
import { I18nProps, SkolePageContext } from '../../types';
import { mediaURL, useOptions, useVotes } from '../../utils';

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
    const { renderShareOption, renderReportOption, renderOptionsHeader, drawerProps } = useOptions(resourceTitle);
    const { setDrawMode, drawMode, screenshot, setRotate } = usePDFViewerContext();
    const { onClose: closeOptions } = drawerProps;
    const handlePrintPdf = (): void => printJS(file);
    const handleCancelDraw = (): void => setDrawMode(false);
    const upVoteButtonTooltip = !!notVerifiedTooltip ? notVerifiedTooltip : t('resource:upvoteTooltip');
    const downVoteButtonTooltip = !!notVerifiedTooltip ? notVerifiedTooltip : t('resource:downvoteTooltip');
    const { toggleCommentModal } = useCommentModalContext();

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

    const discussionBoxProps = {
        comments,
        target: { resource: Number(resourceId) },
        formKey: 'resource',
        placeholderText: t('resource:commentsPlaceholder'),
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

    const handleDownloadPdf = async (): Promise<void> => {
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

    const renderInfo = <InfoModalContent user={resourceUser} created={created} infoItems={infoItems} />;

    const renderOptions = (
        <StyledList>
            {renderShareOption}
            {renderReportOption}
            {isOwner && (
                <MenuItem disabled={verified === false}>
                    <ListItemText onClick={handleDeleteResource}>
                        <DeleteOutline /> {t('resource:deleteResource')}
                    </ListItemText>
                </MenuItem>
            )}
            {/* <MenuItem onClick={handleDownloadResource}>
                <ListItemText>
                    <CloudDownloadOutlined /> {t('common:download')}
                </ListItemText>
            </MenuItem> */}
        </StyledList>
    );

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
                    <KeyboardArrowUpOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );

    const renderDownVoteButton = !isOwner && (
        <Tooltip title={downVoteButtonTooltip}>
            <span>
                <IconButton onClick={handleVoteClick(-1)} {...downVoteButtonProps}>
                    <KeyboardArrowDownOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );

    // const renderExtraResourceActions = (
    //     <StyledExtraResourceActions container alignItems="center">
    //         <Grid item xs={4} container id="vote-section">
    //             {renderStarButton}
    //             {renderUpVoteButton}
    //             {renderDownVoteButton}
    //         </Grid>
    //         <Grid item xs={4} container alignItems="center" id="page-controls">
    //             <Tooltip title={t('common:previousPageTooltip')}>
    //                 <span>
    //                     <IconButton disabled={!pagesExist || currentPage === 0} onClick={prevPage} size="small">
    //                         <NavigateBeforeOutlined color={currentPage === 0 ? 'disabled' : 'inherit'} />
    //                     </IconButton>
    //                 </span>
    //             </Tooltip>
    //             <Typography variant="body2">{currentPage + 1 + ' / ' + totalPages}</Typography>
    //             <Tooltip title={t('common:nextPageTooltip')}>
    //                 <span>
    //                     <IconButton
    //                         disabled={!pagesExist || currentPage === pages.length - 1}
    //                         onClick={nextPage}
    //                         size="small"
    //                     >
    //                         <NavigateNextOutlined color={currentPage === pages.length - 1 ? 'disabled' : 'inherit'} />
    //                     </IconButton>
    //                 </span>
    //             </Tooltip>
    //         </Grid>
    //         <Grid item xs={4} container justify="flex-end">
    //             <Tooltip title={t('resource:fullscreenTooltip')}>
    //                 <span>
    //                     <IconButton disabled={!pagesExist} onClick={setCenter} size="small">
    //                         <FullscreenOutlined />
    //                     </IconButton>
    //                 </span>
    //             </Tooltip>
    //         </Grid>
    //     </StyledExtraResourceActions>
    // );

    const extraBreadcrumbs = [
        {
            linkProps: { ...staticBackUrl, color: 'inherit' },
            text: courseName,
        },
        {
            linkProps: { href: '/resources/[id]', as: `/resources/${resourceId}`, color: 'textPrimary' },
            text: fullResourceTitle,
        },
    ];

    const headerActionDesktop = (
        <Box>
            {renderStarButton}
            {renderUpVoteButton}
            {renderDownVoteButton}
        </Box>
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

    const renderDrawModeContent = (
        <Grid container alignItems="center">
            <Grid item xs={6} container justify="flex-start">
                <Button onClick={handleCancelDraw} startIcon={<CancelOutlined />} color="primary">
                    {t('common:cancel')}
                </Button>
            </Grid>
            {/* <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                    {t('resource:drawModeInfo')}
                </Typography>
            </Grid> */}
            <Grid item xs={6} container justify="flex-end">
                <Button
                    onClick={handleContinueDraw}
                    endIcon={<KeyboardArrowRightOutlined />}
                    color="primary"
                    disabled={!screenshot}
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

    const renderCustomBottomNavbar = (
        <StyledBottomNavigation>
            <NavbarContainer>{drawMode ? renderDrawModeContent : renderPreviewBottomNavbarContent}</NavbarContainer>
        </StyledBottomNavigation>
    );

    const renderCustomBottomNavbarSecondary = (
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
        renderStarButton,
        renderUpVoteButton,
        renderDownVoteButton,
        renderMarkAreaButton,
        renderDownloadButton,
        renderPrintButton,
        renderDrawModeContent,
    };

    const renderPDFViewer = <PdfViewer {...pdfViewerProps} />;
    const renderDiscussionBox = <DiscussionBox {...discussionBoxProps} />;

    const layoutProps = {
        seoProps: {
            title: fullResourceTitle,
            description: t('resource:description'),
        },
        topNavbarProps: {
            staticBackUrl: staticBackUrl,
        },
        headerDesktop: fullResourceTitle,
        headerSecondary: t('common:discussion'),
        // subheaderDesktop: renderCourseLink,
        // subheaderDesktopSecondary: renderSchoolLink,
        headerActionDesktop,
        // extraDesktopActions: renderExtraResourceActions,
        extraBreadcrumbs,
        renderInfo,
        infoHeader: t('resource:infoHeader'),
        infoTooltip: t('resource:infoTooltip'),
        optionProps: {
            renderOptions,
            renderOptionsHeader,
            drawerProps,
            optionsTooltip: t('resource:optionsTooltip'),
        },
        tabLabelLeft: t('common:resource'),
        tabLabelRight: `${t('common:discussion')} (${comments.length})`,
        renderLeftContent: renderPDFViewer,
        renderRightContent: renderDiscussionBox,
        customBottomNavbar: renderCustomBottomNavbar,
        customBottomNavbarSecondary: renderCustomBottomNavbarSecondary,
    };

    if (!!resource) {
        return <TabLayout {...layoutProps} />;
    } else {
        return <NotFoundLayout />;
    }
};

// const StyledExtraResourceActions = styled(Grid)`
//     #vote-section,
//     #page-controls {
//         justify-content: space-around;

//         @media only screen and (min-width: ${breakpoints.MD}) {
//             &#vote-section {
//                 justify-content: flex-start;
//             }
//         }
//     }
// `;

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
