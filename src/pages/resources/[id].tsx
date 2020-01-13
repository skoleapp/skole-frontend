import * as R from 'ramda';

import {
    Avatar,
    Box,
    CardContent,
    CardHeader,
    Divider,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tab,
    Typography,
} from '@material-ui/core';
import { CloudDownload, ScoreOutlined } from '@material-ui/icons';
import {
    Download,
    FormGridContainer,
    Layout,
    NotFound,
    StyledCard,
    StyledList,
    StyledTabs,
    TabPanel,
    TextLink,
} from '../../components';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { ResourceDetailDocument, ResourcePartType, ResourceType } from '../../../generated/graphql';
import { getFilePath, useAuthSync, useTabs } from '../../utils';
import { withApollo, withRedux } from '../../lib';

import Image from 'material-ui-image';
import React from 'react';
import { compose } from 'redux';
import { includeDefaultNamespaces } from '../../i18n';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

interface Props extends I18nProps {
    resource?: ResourceType;
}

const ResourceDetailPage: I18nPage<Props> = ({ resource }) => {
    const { tabValue, handleTabChange } = useTabs();
    const { t, i18n } = useTranslation();

    if (resource) {
        const resourceTitle = R.propOr('-', 'title', resource) as string;
        const resourceType = R.propOr('-', 'resourceType', resource);
        const resourceCourseId = R.propOr('', 'id', resource.course);
        const resourceCourseName = R.propOr('-', 'name', resource.course) as string;
        const resourceSchoolId = R.propOr('', 'id', resource.school);
        const resourceSchoolName = R.propOr('-', 'name', resource.school) as string;
        const creatorId = R.propOr('', 'id', resource.creator);
        const creatorName = R.propOr('-', 'username', resource.creator) as string;
        moment.locale(i18n.language); // Set moment language.
        const created = moment(resource.created).format('LL');
        const modified = moment(resource.modified).format('LL');
        const points = R.propOr('-', 'points', resource);
        const resourceParts = R.propOr([], 'resourceParts', resource) as ResourcePartType[];

        const renderResourceInfo = (
            <Box className="flex-flow" display="flex" justifyContent="space-around" alignItems="center">
                <CardContent>
                    <Box textAlign="left">
                        <Typography variant="body1">
                            {t('common:resourceType')}: {resourceType}
                        </Typography>
                        <Typography variant="body1">
                            {t('common:course')}:{' '}
                            <TextLink href={`/courses/${resourceCourseId}`} color="primary">
                                {resourceCourseName}
                            </TextLink>
                        </Typography>
                        <Typography variant="body1">
                            {t('common:school')}:{' '}
                            <TextLink href={`/schools/${resourceSchoolId}`} color="primary">
                                {resourceSchoolName}
                            </TextLink>
                        </Typography>
                        <Typography variant="body1">
                            {t('common:creator')}:{' '}
                            <TextLink href={`/users/${creatorId}`} color="primary">
                                {creatorName}
                            </TextLink>
                        </Typography>
                        <Typography variant="body1">
                            {t('common:created')}: {created}
                        </Typography>
                        <Typography variant="body1">
                            {t('common:modified')}: {modified}
                        </Typography>
                    </Box>
                </CardContent>
                <CardContent>
                    <StyledList>
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
                    </StyledList>
                </CardContent>
            </Box>
        );

        const renderTabs = (
            <StyledTabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="on"
            >
                <Tab label="General" />
                {resourceParts.map((r: ResourcePartType, i: number) => (
                    <Tab key={i} label={r.title} />
                ))}
            </StyledTabs>
        );

        const renderGeneralDiscussionThread = (
            <TabPanel value={tabValue} index={0}>
                <CardContent>Here will be general discussion thread...</CardContent>
            </TabPanel>
        );

        const renderResourceParts = resourceParts.map((r: ResourcePartType, i: number) => (
            <TabPanel key={i} value={tabValue} index={i + 1}>
                <CardContent>
                    <Box textAlign="left">
                        <Typography variant="body1">
                            {t('common:resourcePartType')}: {R.propOr('-', 'resourcePartType', r)}
                        </Typography>
                        <Typography variant="body1">
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
                        <Typography variant="body1">{R.propOr('-', 'text', r)}</Typography>
                    </Box>
                </CardContent>
                <Divider />
                <CardContent>
                    <Image src={getFilePath(r)} />
                </CardContent>
                <CardContent>
                    <FormGridContainer>
                        <Download url={getFilePath(r)} fileName={r.title} />
                    </FormGridContainer>
                </CardContent>
                <Divider />
                <CardContent>Here will be {r.title} discussion thread...</CardContent>
            </TabPanel>
        ));

        return (
            <Layout title={resourceTitle} backUrl>
                <StyledCard>
                    <CardHeader title={resourceTitle} />
                    <Divider />
                    {renderResourceInfo}
                    <Divider />
                    {renderTabs}
                    {renderGeneralDiscussionThread}
                    {renderResourceParts}
                </StyledCard>
            </Layout>
        );
    } else {
        return <NotFound title={t('resource:notFound')} />;
    }
};

ResourceDetailPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
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
