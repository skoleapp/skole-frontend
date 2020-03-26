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
    CloudUploadOutlined,
    DeleteOutline,
    KeyboardArrowDownOutlined,
    KeyboardArrowUpOutlined,
    LibraryAddOutlined,
    SchoolOutlined,
    ScoreOutlined,
} from '@material-ui/icons';
import { useConfirm } from 'material-ui-confirm';
import moment from 'moment';
import Router from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';

import {
    CommentObjectType,
    DeleteResourceMutation,
    ResourceDetailDocument,
    ResourceObjectType,
    useDeleteResourceMutation,
    VoteObjectType,
} from '../../../generated/graphql';
import { toggleNotification } from '../../actions';
import {
    DiscussionBox,
    NotFound,
    PDFViewer,
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
        const creatorName = R.propOr('-', 'username', resource.user) as string;
        const created = moment(resource.created).format('LL');
        const comments = R.propOr([], 'comments', resource) as CommentObjectType[];
        const isOwnProfile = creatorId === useSelector((state: State) => R.path(['auth', 'user', 'id'], state));
        const initialVote = R.propOr(null, 'vote', resource) as VoteObjectType | null;
        const initialPoints = R.propOr(0, 'points', resource) as number;
        const { points, upVoteButtonProps, downVoteButtonProps, handleVote } = useVotes({ initialVote, initialPoints });

        const discussionBoxProps = {
            comments,
            target: { resource: Number(resource.id) },
        };

        const createdInfoProps = { creatorId, creatorName, created };

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
                                <LibraryAddOutlined />
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
            </StyledList>
        );

        const optionProps = {
            renderOptions,
            renderOptionsHeader,
            openOptions,
            mobileDrawerProps,
            desktopDrawerProps,
        };

        const renderExtraDesktopActions = (
            <Box display="flex" paddingLeft="0.5rem" paddingBottom="0.5rem">
                <StarButton />
                {renderDownVoteButton}
                {renderUpVoteButton}
            </Box>
        );

        const renderCustomBottomNavbar = (
            <StyledBottomNavigation>
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" margin="0 1rem">
                    <StarButton />
                    <Box display="flex">
                        <Box marginRight="1rem">{renderUpVoteButton}</Box>
                        {renderDownVoteButton}
                    </Box>
                </Box>
            </StyledBottomNavigation>
        );

        return (
            <TabLayout
                title={resourceTitle}
                titleSecondary={t('common:discussion')}
                backUrl
                renderInfo={renderInfo}
                tabLabelLeft={t('common:resource')}
                renderLeftContent={<PDFViewer file={file} />}
                renderRightContent={<DiscussionBox {...discussionBoxProps} />}
                createdInfoProps={createdInfoProps}
                optionProps={optionProps}
                customBottomNavbar={renderCustomBottomNavbar}
                extraDesktopActions={renderExtraDesktopActions}
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
