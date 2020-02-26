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
} from '@material-ui/core';
import { CloudDownload, ScoreOutlined } from '@material-ui/icons';
import Image from 'material-ui-image';
import moment from 'moment';
import * as R from 'ramda';
import React from 'react';
import { compose } from 'redux';

import { ResourceDetailDocument, ResourceObjectType, ResourcePartObjectType } from '../../../generated/graphql';
import { Download, MainLayout, NotFound, StyledCard, TabPanel, TextLink } from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { usePrivatePage, useTabs } from '../../utils';
import { mediaURL } from '../../utils';

interface Props extends I18nProps {
    resource?: ResourceObjectType;
}

const ResourceDetailPage: I18nPage<Props> = ({ resource }) => {
    const { tabValue, handleTabChange } = useTabs();
    const { t } = useTranslation();

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
        const resourceParts = R.propOr([], 'resourceParts', resource) as ResourcePartObjectType[];

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

        const renderTabs = (
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="on"
            >
                <Tab label="General" />
                {resourceParts.map((r: ResourcePartObjectType, i: number) => (
                    <Tab key={i} label={r.title} />
                ))}
            </Tabs>
        );

        const renderGeneralDiscussionThread = (
            <TabPanel value={tabValue} index={0}>
                <CardContent>Here will be general discussion thread...</CardContent>
            </TabPanel>
        );

        const renderResourceParts = resourceParts.map((r: ResourcePartObjectType, i: number) => (
            <TabPanel key={i} value={tabValue} index={i + 1}>
                <CardContent>
                    <Box textAlign="left">
                        <Typography variant="body2">
                            {t('common:resourcePartType')}: {R.propOr('-', 'resourcePartType', r)}
                        </Typography>
                        <Typography variant="body2">
                            {t('common:exerciseNumber')}: {R.propOr('-', 'exerciseNumber', r)}
                        </Typography>
                    </Box>
                </CardContent>
                <Divider />
                <CardContent>
                    <Box textAlign="left">
                        <Typography className="label" variant="body2" color="textSecondary">
                            {t('common:description')}
                        </Typography>
                        <Typography variant="body2">{R.propOr('-', 'text', r)}</Typography>
                    </Box>
                </CardContent>
                <Divider />
                <CardContent>
                    <Image src={mediaURL(r.file)} />
                </CardContent>
                <CardContent>
                    <Download url={mediaURL(r.file)} fileName={r.title} />
                </CardContent>
                <Divider />
                <CardContent>Here will be {r.title} discussion thread...</CardContent>
            </TabPanel>
        ));

        return (
            <MainLayout title={resourceTitle} backUrl>
                <StyledCard>
                    <CardHeader title={resourceTitle} />
                    <Divider />
                    {renderResourceInfo}
                    <Divider />
                    {renderTabs}
                    {renderGeneralDiscussionThread}
                    {renderResourceParts}
                </StyledCard>
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
