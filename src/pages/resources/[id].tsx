import { Box, Grid, IconButton, ListItemText, MenuItem, Tooltip, Typography } from '@material-ui/core';
import {
    AssignmentOutlined,
    CloudDownloadOutlined,
    DeleteOutline,
    FullscreenOutlined,
    KeyboardArrowDownOutlined,
    KeyboardArrowUpOutlined,
    NavigateBeforeOutlined,
    NavigateNextOutlined,
    SchoolOutlined,
} from '@material-ui/icons';
import { useConfirm } from 'material-ui-confirm';
import { GetServerSideProps, NextPage } from 'next';
import Router from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SkolePDFViewer } from 'src/components/resource/SkolePDFViewer';
import styled from 'styled-components';

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
    StarButton,
    StyledBottomNavigation,
    StyledList,
    TabLayout,
    TextLink,
} from '../../components';
import { useAuthContext, useNotificationsContext, usePDFViewerContext } from '../../context';
import { includeDefaultNamespaces } from '../../i18n';
import { withApolloSSR, withAuthSync } from '../../lib';
import { breakpoints } from '../../styles';
import { I18nProps, SkolePageContext } from '../../types';
import { mediaURL, useOptions, useVotes } from '../../utils';

interface Props extends I18nProps {
    resource?: ResourceObjectType;
}

const ResourceDetailPage: NextPage<Props> = ({ resource }) => {
    const { t } = useTranslation();
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
    const { onClose: closeOptions } = drawerProps;

    const { score, upVoteButtonProps, downVoteButtonProps, handleVote } = useVotes({
        initialVote,
        initialScore,
        isOwner,
    });

    const upVoteButtonTooltip = !!notVerifiedTooltip
        ? notVerifiedTooltip
        : isOwner
        ? t('resource:ownResourceVoteTooltip')
        : t('resource:upvoteTooltip');

    const downVoteButtonTooltip = !!notVerifiedTooltip
        ? notVerifiedTooltip
        : isOwner
        ? t('resource:ownResourceVoteTooltip')
        : t('resource:downvoteTooltip');

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

    const handleDownloadResource = async (): Promise<void> => {
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
            <MenuItem onClick={handleDownloadResource}>
                <ListItemText>
                    <CloudDownloadOutlined /> {t('common:download')}
                </ListItemText>
            </MenuItem>
        </StyledList>
    );

    const renderStarButton = (
        <StarButton
            starred={starred}
            resource={resourceId}
            starredTooltip={t('resource:starredTooltip')}
            unstarredTooltip={t('resource:unstarredTooltip')}
        />
    );

    const renderUpVoteButton = (
        <Tooltip title={upVoteButtonTooltip}>
            <span>
                <IconButton onClick={handleVoteClick(1)} {...upVoteButtonProps}>
                    <KeyboardArrowUpOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );

    const renderDownVoteButton = (
        <Tooltip title={downVoteButtonTooltip}>
            <span>
                <IconButton onClick={handleVoteClick(-1)} {...downVoteButtonProps}>
                    <KeyboardArrowDownOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );

    const renderExtraResourceActions = (
        <StyledExtraResourceActions container alignItems="center">
            <Grid item xs={4} container id="vote-section">
                {renderStarButton}
                {renderUpVoteButton}
                {renderDownVoteButton}
            </Grid>
            {/* <Grid item xs={4} container alignItems="center" id="page-controls">
                <Tooltip title={t('common:previousPageTooltip')}>
                    <span>
                        <IconButton disabled={!pagesExist || currentPage === 0} onClick={prevPage} size="small">
                            <NavigateBeforeOutlined color={currentPage === 0 ? 'disabled' : 'inherit'} />
                        </IconButton>
                    </span>
                </Tooltip>
                <Typography variant="body2">{currentPage + 1 + ' / ' + totalPages}</Typography>
                <Tooltip title={t('common:nextPageTooltip')}>
                    <span>
                        <IconButton
                            disabled={!pagesExist || currentPage === pages.length - 1}
                            onClick={nextPage}
                            size="small"
                        >
                            <NavigateNextOutlined color={currentPage === pages.length - 1 ? 'disabled' : 'inherit'} />
                        </IconButton>
                    </span>
                </Tooltip>
            </Grid> */}
            {/* <Grid item xs={4} container justify="flex-end">
                <Tooltip title={t('resource:fullscreenTooltip')}>
                    <span>
                        <IconButton disabled={!pagesExist} onClick={setCenter} size="small">
                            <FullscreenOutlined />
                        </IconButton>
                    </span>
                </Tooltip>
            </Grid> */}
        </StyledExtraResourceActions>
    );

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

    const renderCustomBottomNavbar = (
        <StyledBottomNavigation>
            <NavbarContainer>{renderExtraResourceActions}</NavbarContainer>
        </StyledBottomNavigation>
    );

    const renderCustomBottomNavbarSecondary = (
        <StyledBottomNavigation>
            <NavbarContainer>
                <Grid container>
                    <Grid item xs={6} container justify="flex-start">
                        {renderStarButton}
                    </Grid>
                    <Grid item xs={6} container justify="flex-end">
                        {renderUpVoteButton}
                        {renderDownVoteButton}
                    </Grid>
                </Grid>
            </NavbarContainer>
        </StyledBottomNavigation>
    );

    const renderPDFViewer = <SkolePDFViewer file={file} />;
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

const StyledExtraResourceActions = styled(Grid)`
    #vote-section,
    #page-controls {
        justify-content: space-around;

        @media only screen and (min-width: ${breakpoints.MD}) {
            &#vote-section {
                justify-content: flex-start;
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
