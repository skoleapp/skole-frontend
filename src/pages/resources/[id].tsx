import {
    Avatar,
    CardContent,
    Grid,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemText,
    MenuItem,
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
} from '@material-ui/icons';
import { useConfirm } from 'material-ui-confirm';
import Router from 'next/router';
import * as R from 'ramda';
import React, { useEffect } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';

import {
    CommentObjectType,
    DeleteResourceMutation,
    ResourceDetailDocument,
    ResourceObjectType,
    useDeleteResourceMutation,
    VoteObjectType,
} from '../../../generated/graphql';
import { nextPage, prevPage, setCenter, setCurrentPage, setPages } from '../../actions';
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
import { useSkoleContext } from '../../context';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { breakpoints } from '../../styles';
import { I18nPage, I18nProps, SkoleContext, State } from '../../types';
import { mediaURL, useOptions, useVotes, withAuthSync } from '../../utils';
import { useAuth } from '../../utils';

interface Props extends I18nProps {
    resource?: ResourceObjectType;
}

const ResourceDetailPage: I18nPage<Props> = ({ resource }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { toggleNotification } = useSkoleContext();
    const confirm = useConfirm();
    const { user } = useAuth();
    const { pages, currentPage } = useSelector((state: State) => state.resource);
    const { renderShareOption, renderReportOption, renderOptionsHeader, drawerProps } = useOptions();

    useEffect(() => {
        return (): void =>
            batch(() => {
                dispatch(setPages([]));
                dispatch(setCurrentPage(0));
            });
    }, []);

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
        const isOwnProfile = creatorId === useSelector((state: State) => R.path(['auth', 'user', 'id'], state));
        const initialVote = (R.propOr(null, 'vote', resource) as unknown) as VoteObjectType | null;
        const initialPoints = R.propOr(0, 'points', resource) as number;
        const starred = !!resource.starred;
        const isOwner = !!user && user.id === creatorId;

        const { points, upVoteButtonProps, downVoteButtonProps, handleVote } = useVotes({
            initialVote,
            initialPoints,
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

        const handlePreviousPage = (): void => {
            dispatch(prevPage());
        };

        const handleNextPage = (): void => {
            dispatch(nextPage());
        };

        const handleCenterImage = (): void => {
            dispatch(setCenter());
        };

        const renderCourseLink = <TextLink {...staticBackUrl}>{courseName}</TextLink>;

        const renderInfo = (
            <CardContent>
                <StyledList>
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
                                {t('common:points')}: {points}
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
                {isOwnProfile && (
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

        const renderStarButton = <StarButton starred={starred} resource={resourceId} />;

        const renderUpVoteButton = (
            <IconButton onClick={handleVoteClick(1)} {...upVoteButtonProps}>
                <KeyboardArrowUpOutlined />
            </IconButton>
        );

        const renderDownVoteButton = (
            <IconButton onClick={handleVoteClick(-1)} {...downVoteButtonProps}>
                <KeyboardArrowDownOutlined />
            </IconButton>
        );

        const renderExtraResourceActions = (
            <StyledExtraResourceActions container alignItems="center">
                <Grid item xs={4} container id="vote-section">
                    {renderStarButton}
                    {renderUpVoteButton}
                    {renderDownVoteButton}
                </Grid>
                <Grid item xs={4} container alignItems="center" id="page-controls">
                    <IconButton disabled={currentPage === 0} onClick={handlePreviousPage} size="small">
                        <NavigateBeforeOutlined color={currentPage === 0 ? 'disabled' : 'inherit'} />
                    </IconButton>
                    <Typography variant="body2">{currentPage + 1 + ' / ' + pages.length}</Typography>
                    <IconButton disabled={currentPage === pages.length - 1} onClick={handleNextPage} size="small">
                        <NavigateNextOutlined color={currentPage === pages.length - 1 ? 'disabled' : 'inherit'} />
                    </IconButton>
                </Grid>
                <Grid item xs={4} container justify="flex-end">
                    <IconButton onClick={handleCenterImage} size="small">
                        <FullscreenOutlined />
                    </IconButton>
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
                header: resourceTitle,
                staticBackUrl: staticBackUrl,
            },
            headerSecondary: t('common:discussion'),
            subheaderDesktop: renderCourseLink,
            renderInfo,
            optionProps: {
                renderOptions,
                renderOptionsHeader,
                drawerProps,
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

export default compose(withAuthSync, withApollo, withRedux)(ResourceDetailPage);
