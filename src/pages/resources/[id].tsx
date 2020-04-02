import {
    Avatar,
    Box,
    CardContent,
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

import {
    CommentObjectType,
    DeleteResourceMutation,
    ResourceDetailDocument,
    ResourceObjectType,
    useDeleteResourceMutation,
    UserObjectType,
    VoteObjectType,
} from '../../../generated/graphql';
import { nextPage, prevPage, setCenter, setCurrentPage, setPages, toggleNotification } from '../../actions';
import {
    CreatorListItem,
    DiscussionBox,
    NotFound,
    ResourcePreview,
    StarButton,
    StyledBottomNavigation,
    StyledList,
    TabLayout,
    TextLink,
} from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext, State } from '../../types';
import { mediaURL, useOptions, usePrivatePage, useVotes } from '../../utils';

interface Props extends I18nProps {
    resource?: ResourceObjectType;
}

const ResourceDetailPage: I18nPage<Props> = ({ resource }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const confirm = useConfirm();
    const { user } = useSelector((state: State) => state.auth);
    const { pages, currentPage } = useSelector((state: State) => state.resource);

    useEffect(() => {
        return () =>
            batch(() => {
                dispatch(setPages([]));
                dispatch(setCurrentPage(0));
            });
    }, []);

    const {
        renderShareOption,
        renderReportOption,
        renderOptionsHeader,
        mobileDrawerProps,
        desktopDrawerProps,
        openOptions,
    } = useOptions();

    if (resource) {
        const file = mediaURL(resource.file);
        const resourceTitle = R.propOr('-', 'title', resource) as string;
        const resourceType = R.propOr('-', 'resourceType', resource);
        const courseId = R.propOr('', 'id', resource.course);
        const courseName = R.propOr('-', 'name', resource.course) as string;
        const schoolId = R.propOr('', 'id', resource.school);
        const schoolName = R.propOr('-', 'name', resource.school) as string;
        const creatorId = R.propOr('', 'id', resource.user) as string;
        const resourceId = R.propOr('', 'id', resource) as string;
        const comments = R.propOr([], 'comments', resource) as CommentObjectType[];
        const isOwnProfile = creatorId === useSelector((state: State) => R.path(['auth', 'user', 'id'], state));
        const initialVote = R.propOr(null, 'vote', resource) as VoteObjectType | null;
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

        const deleteResourceError = (): void => {
            dispatch(toggleNotification(t('notifications:deleteResourceError')));
        };

        const deleteResourceCompleted = ({ deleteResource }: DeleteResourceMutation): void => {
            if (!!deleteResource) {
                if (!!deleteResource.errors) {
                    deleteResourceError();
                } else {
                    Router.push('/courses/' + courseId);
                    dispatch(toggleNotification(t('notifications:resourceDeleted')));
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
                dispatch(toggleNotification(t('notifications:downloadResourceError')));
            }
        };

        const renderVoteButtons = (
            <Box>
                <IconButton onClick={handleVoteClick(1)} {...upVoteButtonProps}>
                    <KeyboardArrowUpOutlined />
                </IconButton>
                <IconButton onClick={handleVoteClick(-1)} {...downVoteButtonProps}>
                    <KeyboardArrowDownOutlined />
                </IconButton>
            </Box>
        );

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
                                {t('common:course')}:{' '}
                                <TextLink href={`/courses/${courseId}`} color="primary">
                                    {courseName}
                                </TextLink>
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
                                <TextLink href={`/schools/${schoolId}`} color="primary">
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
                    <CreatorListItem user={resource.user as UserObjectType} created={resource.created} />
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

        const optionProps = {
            renderOptions,
            renderOptionsHeader,
            openOptions,
            mobileDrawerProps,
            desktopDrawerProps,
        };

        const starButtonProps = {
            starred,
            resource: resourceId,
        };

        // previousPage, nextPage, setCenter

        const renderNavigationButtons = (
            <Box width="7rem" justifyContent="center" alignItems="center" display="flex">
                <IconButton
                    disableFocusRipple
                    disableRipple
                    disabled={currentPage === 0}
                    onClick={() => dispatch(prevPage())}
                    size="medium"
                >
                    <NavigateBeforeOutlined color={currentPage === 0 ? 'disabled' : 'primary'} />
                </IconButton>
                <Typography style={{ minWidth: '3rem' }} variant="body2">
                    {currentPage + 1 + ' / ' + pages.length}
                </Typography>
                <IconButton
                    disableFocusRipple
                    disableRipple
                    disabled={currentPage === pages.length - 1}
                    onClick={() => dispatch(nextPage())}
                    size="medium"
                >
                    <NavigateNextOutlined color={currentPage === pages.length - 1 ? 'disabled' : 'primary'} />
                </IconButton>
            </Box>
        );

        const renderCenterImageButton = (
            <IconButton
                disableFocusRipple
                disableRipple
                onClick={(): void => {
                    dispatch(setCenter());
                }}
            >
                <FullscreenOutlined color="primary" />
            </IconButton>
        );

        const renderResourceActions = (
            <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" padding="0 1rem">
                <Box display="flex">
                    <StarButton {...starButtonProps} />
                    {renderVoteButtons}
                </Box>
                {renderNavigationButtons}
                {renderCenterImageButton}
            </Box>
        );
        const renderCustomBottomNavbar = <StyledBottomNavigation>{renderResourceActions}</StyledBottomNavigation>;

        return (
            <TabLayout
                title={resourceTitle}
                titleSecondary={t('common:discussion')}
                backUrl
                renderInfo={renderInfo}
                tabLabelLeft={t('common:resource')}
                renderLeftContent={<ResourcePreview file={file} />}
                renderRightContent={<DiscussionBox {...discussionBoxProps} />}
                optionProps={optionProps}
                customBottomNavbar={renderCustomBottomNavbar}
                renderLeftFooter={renderResourceActions}
            />
        );
    } else {
        return <NotFound title={t('resource:notFound')} />;
    }
};

ResourceDetailPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePrivatePage(ctx);
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

export default compose(withApollo, withRedux)(ResourceDetailPage);
