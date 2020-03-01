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
import { CloudDownload, ScoreOutlined, InfoOutlined } from '@material-ui/icons';
import moment from 'moment';
import * as R from 'ramda';
import React, { useState } from 'react';
import { compose } from 'redux';

import { ResourceDetailDocument, ResourceObjectType, CommentObjectType } from '../../../generated/graphql';
import {
    ResourceLayout,
    NotFound,
    StyledCard,
    TextLink,
    StyledModal,
    ModalHeader,
    ResourcePreview,
    DiscussionBox,
} from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { usePrivatePage, useTabs } from '../../utils';

interface Props extends I18nProps {
    resource?: ResourceObjectType;
}

const ResourceDetailPage: I18nPage<Props> = ({ resource }) => {
    const { tabValue, handleTabChange } = useTabs();
    const { t } = useTranslation();

    const [pages, setPages]: any[] = useState([]);
    const [currentPage, setCurrentPage]: any = useState(0);

    const [courseInfoVisible, setCourseInfoVisible] = useState(false);
    const handleOpenCourseInfo = (): void => setCourseInfoVisible(true);
    const handleCloseCourseInfo = (): void => setCourseInfoVisible(false);

    if (resource) {
        const resourceTitle = R.propOr('-', 'title', resource) as string;
        const resourceType = R.propOr('-', 'resourceType', resource);
        const resourceCourseId = R.propOr('', 'id', resource.course);
        const resourceCourseName = R.propOr('-', 'name', resource.course) as string;
        const resourceSchoolId = R.propOr('', 'id', resource.school);
        const resourceSchoolName = R.propOr('-', 'name', resource.school) as string;
        const creatorId = R.propOr('', 'id', resource.user);
        const creatorName = R.propOr('-', 'username', resource.user) as string;
        const created = moment(resource.created).format('LL');
        const modified = moment(resource.modified).format('LL');
        const points = R.propOr('-', 'points', resource);

        const comments = R.propOr([], 'comments', resource) as CommentObjectType[];

        const discussionBoxProps = {
            comments,
            target: { resource: Number(resource.id) },
        };

        const renderResourceInfo = (
            <Grid container alignItems="center">
                <Grid item container sm={6} justify="center">
                    <CardContent>
                        <Box textAlign="left">
                            <Typography variant="body2">
                                {t('common:resourceType')}: {resourceType}
                            </Typography>
                            <Typography variant="body2">
                                {t('common:course')}:{' '}
                                <TextLink href={`/courses/${resourceCourseId}`} color="primary">
                                    {resourceCourseName}
                                </TextLink>
                            </Typography>
                            <Typography variant="body2">
                                {t('common:school')}:{' '}
                                <TextLink href={`/schools/${resourceSchoolId}`} color="primary">
                                    {resourceSchoolName}
                                </TextLink>
                            </Typography>
                            <Typography variant="body2">
                                {t('common:creator')}:{' '}
                                <TextLink href={`/users/${creatorId}`} color="primary">
                                    {creatorName}
                                </TextLink>
                            </Typography>
                            <Typography variant="body2">
                                {t('common:created')}: {created}
                            </Typography>
                            <Typography variant="body2">
                                {t('common:modified')}: {modified}
                            </Typography>
                        </Box>
                    </CardContent>
                </Grid>
                <Grid item container sm={6} justify="center">
                    <CardContent>
                        <List>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <ScoreOutlined />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText>
                                    {t('common:points')}: {points}
                                </ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar>
                                        <CloudDownload />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText>{t('common:downloads')}: 0</ListItemText>
                            </ListItem>
                        </List>
                    </CardContent>
                </Grid>
            </Grid>
        );

        const renderCourseInfoModal = (
            <StyledModal open={!!courseInfoVisible} onClose={handleCloseCourseInfo}>
                <Fade in={!!courseInfoVisible}>
                    <Paper>
                        <ModalHeader onCancel={handleCloseCourseInfo} />
                        <Box textAlign="center">
                            <CardHeader title={resourceTitle} />
                            {renderResourceInfo}
                        </Box>
                    </Paper>
                </Fade>
            </StyledModal>
        );

        const renderCourseInfoButton = (
            <IconButton color="secondary" onClick={handleOpenCourseInfo}>
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
                            <Tab label={t('resource:resourceDiscussion')} />
                        </Tabs>
                        <CardHeader className="md-up" title={resourceTitle} />
                        {tabValue === 0 && (
                            <ResourcePreview
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                pages={pages}
                                setPages={setPages}
                                resource={resource}
                            />
                        )}
                        {tabValue === 1 && <DiscussionBox {...discussionBoxProps} />}
                    </StyledCard>
                </Grid>
                <Grid item container xs={12} sm={12} md={5} lg={4} className="md-up">
                    <StyledCard marginLeft>
                        <CardHeader title={t('resource:resourceDiscussion')} />
                        <Divider />
                        <DiscussionBox {...discussionBoxProps} />
                    </StyledCard>
                </Grid>
            </Grid>
        );

        return (
            <ResourceLayout
                resource={resource}
                showBottomNavigation={tabValue === 1}
                title={resourceTitle}
                backUrl
                maxWidth="xl"
                headerRight={renderCourseInfoButton}
            >
                {renderContent}
                {renderCourseInfoModal}
            </ResourceLayout>
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
