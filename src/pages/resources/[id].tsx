import {
    Avatar,
    Box,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    SwipeableDrawer,
    Tab,
    Tabs,
    Typography,
} from '@material-ui/core';
import {
    CloudDownloadOutlined,
    CloudUploadOutlined,
    DeleteOutline,
    FlagOutlined,
    InfoOutlined,
    LibraryAddOutlined,
    MoreHorizOutlined,
    OpenInNewOutlined,
    SchoolOutlined,
    ScoreOutlined,
    ShareOutlined,
} from '@material-ui/icons';
import { useConfirm } from 'material-ui-confirm';
import moment from 'moment';
import Router from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';
import styled from 'styled-components';

import {
    CommentObjectType,
    DeleteResourceMutation,
    PerformVoteMutation,
    ResourceDetailDocument,
    ResourceObjectType,
    useDeleteResourceMutation,
    usePerformVoteMutation,
    VoteObjectType,
} from '../../../generated/graphql';
import { toggleNotification } from '../../actions';
import { DiscussionBox, MainLayout, ModalHeader, NotFound, StyledCard, TabPanel, TextLink } from '../../components';
import { ResourcePreview } from '../../components/shared/ResourcePreview';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext, State } from '../../types';
import { mediaURL, useOpen, usePrivatePage, useTabs } from '../../utils';

interface Props extends I18nProps {
    resource?: ResourceObjectType;
}

const ResourceDetailPage: I18nPage<Props> = ({ resource }) => {
    const { tabValue, handleTabChange } = useTabs();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const confirm = useConfirm();
    const { open, handleOpen, handleClose } = useOpen();

    const [pages, setPages]: any[] = useState([]);
    const [currentPage, setCurrentPage]: any = useState(0);

    const { open: optionsOpen, handleOpen: openOptions, handleClose: closeOptions } = useOpen();

    if (resource) {
        const file = mediaURL(resource.file);
        const resourceTitle = R.propOr('-', 'title', resource) as string;
        const resourceType = R.propOr('-', 'resourceType', resource);
        const courseId = R.propOr('', 'id', resource.course);
        const courseName = R.propOr('-', 'name', resource.course) as string;
        const schoolId = R.propOr('', 'id', resource.school);
        const schoolName = R.propOr('-', 'name', resource.school) as string;
        const creatorId = R.propOr('', 'id', resource.user) as string;
        const creatorName = R.propOr('-', 'username', resource.user) as string;
        const created = moment(resource.created).format('LL');
        const initialPoints = R.propOr('-', 'points', resource);
        const comments = R.propOr([], 'comments', resource) as CommentObjectType[];
        const isOwnProfile = creatorId === useSelector((state: State) => R.path(['auth', 'user', 'id'], state));

        const [vote, setVote] = useState(resource.vote);
        const [points, setPoints] = useState(initialPoints);

        const discussionBoxProps = {
            comments,
            target: { resource: Number(resource.id) },
        };

        const onError = (): void => {
            dispatch(toggleNotification(t('notifications:voteError')));
        };

        const onCompleted = ({ performVote }: PerformVoteMutation): void => {
            if (!!performVote) {
                if (!!performVote.errors) {
                    onError();
                } else {
                    setVote(performVote.vote as VoteObjectType);
                    setPoints(performVote.targetPoints);
                }
            }
        };

        const [performVote, { loading: voteSubmitting }] = usePerformVoteMutation({ onCompleted, onError });

        const handleVote = (status: number) => (): void => {
            performVote({ variables: { resource: resource.id, status } });
        };
        const voteProps = { vote, voteSubmitting, handleVote, points };

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

        const handleDelete = (): void => {
            confirm({ title: t('resource:deleteResource'), description: t('resource:confirmDesc') }).then(() => {
                deleteResource({ variables: { id: resource.id } });
            });
        };

        const handleShare = (e: SyntheticEvent): void => {
            e.stopPropagation();
            closeOptions();
            navigator.clipboard.writeText(window.location.href);
            dispatch(toggleNotification(t('notifications:linkCopied')));
        };

        const downloadResource = (url: string): void => {
            if (!!url) {
                fetch(url, {
                    headers: new Headers({
                        Origin: location.origin,
                    }),
                    mode: 'cors',
                })
                    .then(response => response.blob())
                    .then(blob => {
                        const blobUrl = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.download = resource.title;
                        a.href = blobUrl;

                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    })
                    .catch(e => console.error(e));
            }
        };

        const handleDownload = (): void => {
            downloadResource(mediaURL(resource.file));
        };

        const renderResourceInfo = (
            <CardContent>
                <List>
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
                </List>
            </CardContent>
        );

        const renderCreatedInfo = (
            <Box padding="0.5rem" textAlign="left">
                <Typography variant="body2" color="textSecondary">
                    {t('common:createdBy')}{' '}
                    <TextLink href={`/users/${creatorId}`} color="primary">
                        {creatorName}
                    </TextLink>{' '}
                    {created}
                </Typography>
            </Box>
        );
        const renderDesktopDrawer = (
            <SwipeableDrawer className="md-up" anchor="left" open={!!open} onOpen={handleOpen} onClose={handleClose}>
                <ModalHeader title={resourceTitle} onCancel={handleClose} />
                {renderResourceInfo}
                <Divider />
                {renderCreatedInfo}
            </SwipeableDrawer>
        );

        const renderOptions = (
            <StyledList>
                {isOwnProfile && (
                    <ListItem onClick={handleDelete}>
                        <ListItemText>
                            <DeleteOutline /> {t('resource:deleteResource')}
                        </ListItemText>
                    </ListItem>
                )}
                <ListItem onClick={handleShare}>
                    <ListItemText>
                        <ShareOutlined /> {t('common:share')}
                    </ListItemText>
                </ListItem>
                <ListItem disabled>
                    <ListItemText>
                        <FlagOutlined /> {t('common:reportAbuse')}
                    </ListItemText>
                </ListItem>
                <ListItem onClick={handleDownload}>
                    <ListItemText>
                        <CloudDownloadOutlined /> {t('common:downloadResource')}
                    </ListItemText>
                </ListItem>
                <Link target="_blank" rel="noopener noreferrer" href={mediaURL(resource.file)}>
                    <ListItem>
                        <ListItemText>
                            <OpenInNewOutlined /> {t('common:externalLink')}
                        </ListItemText>
                    </ListItem>
                </Link>
            </StyledList>
        );

        const renderDesktopOptionsDrawer = (
            <SwipeableDrawer
                className="md-up"
                anchor="left"
                open={!!optionsOpen}
                onOpen={openOptions}
                onClose={closeOptions}
            >
                <ModalHeader onCancel={closeOptions} />
                {renderOptions}
            </SwipeableDrawer>
        );

        const renderMobileDrawer = (
            <SwipeableDrawer
                className="md-down"
                anchor="bottom"
                open={!!open}
                onOpen={handleOpen}
                onClose={handleClose}
            >
                <Paper>
                    <ModalHeader title={resourceTitle} onCancel={handleClose} />
                    {renderCreatedInfo}
                    <Divider />
                    {renderResourceInfo}
                </Paper>
            </SwipeableDrawer>
        );

        const renderMobileOptionsDrawer = (
            <SwipeableDrawer
                className="md-down"
                anchor="bottom"
                open={!!optionsOpen}
                onOpen={openOptions}
                onClose={closeOptions}
            >
                <Paper>{renderOptions}</Paper>
            </SwipeableDrawer>
        );

        const renderDesktopActionButtons = (
            <>
                <IconButton color="primary" onClick={handleOpen}>
                    <InfoOutlined />
                </IconButton>
                <IconButton onClick={openOptions}>
                    <MoreHorizOutlined />
                </IconButton>
            </>
        );

        const renderMobileResourceInfoButton = (
            <Box display="flex" flex-direction="row">
                <IconButton color="secondary" onClick={handleOpen}>
                    <InfoOutlined />
                </IconButton>
                <IconButton color="secondary" onClick={openOptions}>
                    <MoreHorizOutlined />
                </IconButton>
            </Box>
        );

        const renderContent = (
            <Grid container>
                <Grid item container xs={12} sm={12} md={7} lg={8}>
                    <StyledCard>
                        <Tabs
                            className="md-down"
                            value={tabValue}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                        >
                            <Tab label={resourceTitle} />
                            <Tab label={t('common:discussion')} />
                        </Tabs>
                        <CardHeader action={renderDesktopActionButtons} className="md-up" title={resourceTitle} />

                        {tabValue === 0 && (
                            <ResourcePreview
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                pages={pages}
                                setPages={setPages}
                                file={file}
                                voteProps={voteProps}
                            />
                        )}

                        <TabPanel value={tabValue} index={1} flexGrow="1" display={tabValue === 1 ? 'flex' : 'none'}>
                            <DiscussionBox {...discussionBoxProps} />
                        </TabPanel>
                    </StyledCard>
                </Grid>
                <Grid item container xs={12} sm={12} md={5} lg={4} className="md-up">
                    <StyledCard marginLeft>
                        <CardHeader title={t('common:discussion')} />
                        <Divider />
                        <DiscussionBox {...discussionBoxProps} />
                    </StyledCard>
                </Grid>
            </Grid>
        );

        return (
            <MainLayout
                disableBottomNavbar={tabValue === 0}
                title={resourceTitle}
                backUrl
                maxWidth="xl"
                headerRight={renderMobileResourceInfoButton}
            >
                {renderContent}
                {renderDesktopDrawer}
                {renderDesktopOptionsDrawer}
                {renderMobileDrawer}
                {renderMobileOptionsDrawer}
            </MainLayout>
        );
    } else {
        return <NotFound title={t('resource:notFound')} />;
    }
};

const StyledList = styled(List)`
    .MuiListItem-root {
        padding: 1rem 1.5rem !important;
        :hover {
            background-color: rgb(245, 245, 245) !important;
            cursor: pointer;
        }
    }
    .MuiTypography-root {
        display: flex;
    }
    .MuiSvgIcon-root {
        margin-right: 1rem;
    }
`;

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
