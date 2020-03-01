import {
    Avatar,
    Box,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    IconButton,
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
    CloudUploadOutlined,
    InfoOutlined,
    LibraryAddOutlined,
    SchoolOutlined,
    ScoreOutlined,
} from '@material-ui/icons';
import moment from 'moment';
import * as R from 'ramda';
import React, { useState } from 'react';
import { compose } from 'redux';

import { CommentObjectType, ResourceDetailDocument, ResourceObjectType } from '../../../generated/graphql';
import { DiscussionBox, MainLayout, ModalHeader, NotFound, StyledCard, TabPanel, TextLink } from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { mediaURL, usePrivatePage, useTabs } from '../../utils';

interface Props extends I18nProps {
    resource?: ResourceObjectType;
}

const ResourceDetailPage: I18nPage<Props> = ({ resource }) => {
    const { tabValue, handleTabChange } = useTabs();
    const { t } = useTranslation();
    const [resourceInfoVisible, setResourceInfoVisible] = useState(false);
    const handleOpenResourceInfo = (): void => setResourceInfoVisible(true);
    const handleCloseResourceInfo = (): void => setResourceInfoVisible(false);

    // const [pages, setPages]: any[] = useState([]);
    // const [currentPage, setCurrentPage]: any = useState(0);

    if (resource) {
        const title = R.propOr('-', 'title', resource) as string;
        const resourceType = R.propOr('-', 'resourceType', resource);
        const courseId = R.propOr('-', 'id', resource.course) as string;
        const courseName = R.propOr('-', 'name', resource.course) as string;
        const schoolId = R.propOr('', 'id', resource.school);
        const schoolName = R.propOr('-', 'name', resource.school) as string;
        const creatorId = R.propOr('', 'id', resource.user);
        const creatorName = R.propOr('-', 'username', resource.user) as string;
        const created = moment(resource.created).format('LL');
        const points = R.propOr('-', 'points', resource);
        const comments = R.propOr([], 'comments', resource) as CommentObjectType[];

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

        const discussionBoxProps = {
            comments,
            target: { resource: Number(resource.id) },
        };

        const renderFile = <img src={mediaURL(resource.file)} />;

        const renderMobileContent = (
            <Grid container className="md-down">
                <StyledCard>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab label={t('common:resource')} />
                        <Tab label={t('common:discussion')} />
                    </Tabs>
                    <TabPanel value={tabValue} index={0}>
                        {/* <ResourcePreview
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                pages={pages}
                                setPages={setPages}
                                resource={resource}
                            /> */}
                        {renderFile}
                    </TabPanel>
                    <TabPanel value={tabValue} index={1} flexGrow="1" display="flex">
                        <DiscussionBox {...discussionBoxProps} />
                    </TabPanel>
                </StyledCard>
            </Grid>
        );

        const renderDesktopContent = (
            <Grid container className="md-up">
                <Grid item container xs={12} md={7} lg={8}>
                    <StyledCard>
                        <CardHeader title={title} />
                        <Divider />
                        {renderResourceInfo}
                        {renderCreatedInfo}
                        <Divider />
                        <CardContent>{renderFile}</CardContent>
                    </StyledCard>
                </Grid>
                <Grid item container xs={12} md={5} lg={4}>
                    <StyledCard marginLeft>
                        <CardHeader title={t('common:discussion')} />
                        <Divider />
                        <DiscussionBox {...discussionBoxProps} />
                    </StyledCard>
                </Grid>
            </Grid>
        );

        const renderResourceInfoButton = (
            <IconButton color="secondary" onClick={handleOpenResourceInfo}>
                <InfoOutlined />
            </IconButton>
        );

        const renderResourceInfoModal = (
            <SwipeableDrawer
                anchor="bottom"
                open={!!resourceInfoVisible}
                onOpen={(): void => setResourceInfoVisible(true)}
                onClose={handleCloseResourceInfo}
            >
                <Paper>
                    <ModalHeader onCancel={handleCloseResourceInfo} />
                    <CardHeader title={title} />
                    {renderCreatedInfo}
                    <Divider />
                    {renderResourceInfo}
                </Paper>
            </SwipeableDrawer>
        );

        return (
            <MainLayout title={title} backUrl headerRight={renderResourceInfoButton}>
                {renderMobileContent}
                {renderDesktopContent}
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
