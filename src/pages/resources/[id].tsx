import {
    Avatar,
    CardContent,
    Grid,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
    MenuItem,
    Tooltip,
    Typography,
} from '@material-ui/core';
import {
    CloudDownloadOutlined,
    CloudUploadOutlined,
    DeleteOutline,
    FullscreenOutlined,
    HouseOutlined,
    KeyboardArrowDownOutlined,
    KeyboardArrowUpOutlined,
    NavigateBeforeOutlined,
    NavigateNextOutlined,
    SchoolOutlined,
    ScoreOutlined,
    TitleOutlined,
} from '@material-ui/icons';
import { useConfirm } from 'material-ui-confirm';
import Router from 'next/router';
import * as R from 'ramda';
import React from 'react';
import styled from 'styled-components';

import {
    CommentObjectType,
    DeleteResourceMutation,
    ResourceDetailDocument,
    ResourceObjectType,
    useDeleteResourceMutation,
    VoteObjectType,
} from '../../../generated/graphql';
import {
    CreatorListItem,
    DiscussionBox,
    NavbarContainer,
    NotFoundLayout,
    PDFViewer,
    StarButton,
    StyledBottomNavigation,
    StyledList,
    TabLayout,
    TextLink,
} from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo } from '../../lib';
import { breakpoints } from '../../styles';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import {
    mediaURL,
    useNotificationsContext,
    useOptions,
    usePDFViewerContext,
    useVotes,
    withAuthSync,
} from '../../utils';
import { useAuth } from '../../utils';

interface Props extends I18nProps {
    resource?: ResourceObjectType;
}

const ResourceDetailPage: I18nPage<Props> = ({ resource }) => {
    const { t } = useTranslation();
    const { toggleNotification } = useNotificationsContext();
    const confirm = useConfirm();
    const { user } = useAuth();
    const { pages, currentPage, prevPage, nextPage, setCenter } = usePDFViewerContext();

    const { renderShareOption, renderReportOption, renderOptionsHeader, drawerProps } = useOptions(
        t('resource:optionsHeader'),
    );

    if (!!resource) {
        const resourceTitle = R.propOr('-', 'title', resource) as string;
        const file = mediaURL(resource.file);
        const resourceType = R.propOr('-', 'resourceType', resource);
        const courseId = R.propOr('', 'id', resource.course);
        const courseName = R.propOr('-', 'name', resource.course) as string;
        const schoolId = R.propOr('', 'id', resource.school);
        const schoolName = R.propOr('-', 'name', resource.school) as string;
        const creatorId = R.propOr('', 'id', resource.user) as string;
        const resourceId = R.propOr('', 'id', resource) as string;
        const comments = R.propOr([], 'comments', resource) as CommentObjectType[];
        const initialVote = (R.propOr(null, 'vote', resource) as unknown) as VoteObjectType | null;
        const initialScore = R.propOr(0, 'score', resource) as number;
        const starred = !!resource.starred;
        const isOwner = !!user && user.id === creatorId;

        const { score, upVoteButtonProps, downVoteButtonProps, handleVote } = useVotes({
            initialVote,
            initialScore,
            isOwner,
        });

        const discussionBoxProps = {
            comments,
            target: { resource: Number(resource.id) },
            formKey: 'resource',
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
                } else {
                    Router.push('/courses/' + courseId);
                    toggleNotification(t('notifications:resourceDeleted'));
                }
            }
        };

        const [deleteResource] = useDeleteResourceMutation({
            onCompleted: deleteResourceCompleted,
            onError: deleteResourceError,
        });

        const handleDeleteResource = (): void => {
            confirm({ title: t('resource:deleteResource'), description: t('resource:confirmDesc') }).then(() => {
                deleteResource({ variables: { id: resource.id } });
            });
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
                a.download = resource.title;
                a.href = blobUrl;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } catch {
                toggleNotification(t('notifications:downloadResourceError'));
            }
        };

        const renderCourseLink = <TextLink {...staticBackUrl}>{courseName}</TextLink>;

        const renderInfo = (
            <CardContent>
                <StyledList>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <TitleOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:title')}: {resourceTitle}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <CloudUploadOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:resourceType')}: {resourceType}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <SchoolOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:course')}: {renderCourseLink}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <HouseOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:school')}:{' '}
                                <TextLink href="/schools/[id]" as={`/schools/${schoolId}`} color="primary">
                                    {schoolName}
                                </TextLink>
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <ScoreOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:score')}: {score}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    <CreatorListItem user={resource.user} created={resource.created} />
                </StyledList>
            </CardContent>
        );

        const renderOptions = (
            <StyledList>
                {renderShareOption}
                {renderReportOption}
                {isOwner && (
                    <MenuItem>
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
            <Tooltip title={isOwner ? t('resource:ownResourceVoteTooltip') : t('resource:upvoteTooltip')}>
                <span>
                    <IconButton onClick={handleVoteClick(1)} {...upVoteButtonProps}>
                        <KeyboardArrowUpOutlined />
                    </IconButton>
                </span>
            </Tooltip>
        );

        const renderDownVoteButton = (
            <Tooltip title={isOwner ? t('resource:ownResourceVoteTooltip') : t('resource:downvoteTooltip')}>
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
                <Grid item xs={4} container alignItems="center" id="page-controls">
                    <Tooltip title={t('common:previousPageTooltip')}>
                        <span>
                            <IconButton disabled={currentPage === 0} onClick={prevPage} size="small">
                                <NavigateBeforeOutlined color={currentPage === 0 ? 'disabled' : 'inherit'} />
                            </IconButton>
                        </span>
                    </Tooltip>
                    <Typography variant="body2">{currentPage + 1 + ' / ' + pages.length}</Typography>
                    <Tooltip title={t('common:nextPageTooltip')}>
                        <span>
                            <IconButton disabled={currentPage === pages.length - 1} onClick={nextPage} size="small">
                                <NavigateNextOutlined
                                    color={currentPage === pages.length - 1 ? 'disabled' : 'inherit'}
                                />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Grid>
                <Grid item xs={4} container justify="flex-end">
                    <Tooltip title={t('resource:fullscreenTooltip')}>
                        <IconButton onClick={setCenter} size="small">
                            <FullscreenOutlined />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </StyledExtraResourceActions>
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

        const renderPDFViewer = <PDFViewer file={file} />;
        const renderDiscussionBox = <DiscussionBox {...discussionBoxProps} />;

        const layoutProps = {
            seoProps: {
                title: resourceTitle,
                description: t('resource:description'),
            },
            topNavbarProps: {
                staticBackUrl: staticBackUrl,
            },
            headerDesktop: resourceTitle,
            headerSecondary: t('common:discussion'),
            subheaderDesktop: renderCourseLink,
            extraDesktopActions: renderExtraResourceActions,
            renderInfo,
            infoTooltip: t('resource:infoTooltip'),
            infoHeader: t('resource:infoHeader'),
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

ResourceDetailPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    const { query } = ctx;
    const nameSpaces = { namespacesRequired: includeDefaultNamespaces(['resource']) };

    try {
        const { data } = await ctx.apolloClient.query({
            query: ResourceDetailDocument,
            variables: query,
        });

        return { ...data, ...nameSpaces };
    } catch {
        return nameSpaces;
    }
};

export default withApollo(withAuthSync(ResourceDetailPage));
