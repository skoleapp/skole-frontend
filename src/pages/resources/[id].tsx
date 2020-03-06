import {
    Avatar,
    Box,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tab,
    Tabs,
    Typography,
    Fade,
    Paper,
    IconButton,
} from '@material-ui/core';
import {
    ScoreOutlined,
    InfoOutlined,
    CloudUploadOutlined,
    LibraryAddOutlined,
    SchoolOutlined,
} from '@material-ui/icons';

import * as R from 'ramda';
import React, { useState } from 'react';
import { compose } from 'redux';

import {
    ResourceDetailDocument,
    ResourceObjectType,
    CommentObjectType,
    usePerformVoteMutation,
    PerformVoteMutation,
    VoteObjectType,
} from '../../../generated/graphql';
import {
    MainLayout,
    NotFound,
    StyledCard,
    TextLink,
    StyledModal,
    ModalHeader,
    DiscussionBox,
    TabPanel,
} from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { usePrivatePage, useTabs, mediaURL } from '../../utils';
import { ResourcePreview } from '../../components/shared/ResourcePreview';
import { toggleNotification } from '../../actions';
import { useDispatch } from 'react-redux';

interface Props extends I18nProps {
    resource?: ResourceObjectType;
}

const ResourceDetailPage: I18nPage<Props> = ({ resource }) => {
    const { tabValue, handleTabChange } = useTabs();
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [pages, setPages]: any[] = useState([]);
    const [currentPage, setCurrentPage]: any = useState(0);

    const [resourceInfoVisible, setResourceInfoVisible] = useState(false);
    const handleOpenResourceInfo = (): void => setResourceInfoVisible(true);
    const handleCloseResourceInfo = (): void => setResourceInfoVisible(false);

    if (resource) {
        const file = mediaURL(resource.file);
        const resourceTitle = R.propOr('-', 'title', resource) as string;
        const resourceType = R.propOr('-', 'resourceType', resource);
        const courseId = R.propOr('', 'id', resource.course);
        const courseName = R.propOr('-', 'name', resource.course) as string;
        const schoolId = R.propOr('', 'id', resource.school);
        const schoolName = R.propOr('-', 'name', resource.school) as string;

        const initialPoints = R.propOr('-', 'points', resource);
        const comments = R.propOr([], 'comments', resource) as CommentObjectType[];

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

        const renderResourceInfoModal = (
            <StyledModal open={!!resourceInfoVisible} onClose={handleCloseResourceInfo}>
                <Fade in={!!resourceInfoVisible}>
                    <Paper>
                        <ModalHeader onCancel={handleCloseResourceInfo} />
                        <Box textAlign="center">
                            <CardHeader title={resourceTitle} />
                            {renderResourceInfo}
                        </Box>
                    </Paper>
                </Fade>
            </StyledModal>
        );

        const renderResourceInfoButton = (
            <IconButton color="secondary" onClick={handleOpenResourceInfo}>
                <InfoOutlined />
            </IconButton>
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
                        <CardHeader className="md-up" title={resourceTitle} />

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
                headerRight={renderResourceInfoButton}
            >
                {renderContent}
                {renderResourceInfoModal}
            </MainLayout>
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
