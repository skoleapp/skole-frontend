import * as R from 'ramda';

import {
    Avatar,
    Box,
    CardContent,
    Divider,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Tab,
    Typography,
} from '@material-ui/core';
import {
    ButtonLink,
    MainLayout,
    NotFound,
    SettingsButton,
    StyledCard,
    StyledList,
    StyledTabs,
    TabPanel,
} from '../../components';
import { CloudUploadOutlined, SchoolOutlined, ScoreOutlined } from '@material-ui/icons';
import { I18nPage, I18nProps, SkoleContext, State } from '../../types';
import { UserDetailDocument, UserType } from '../../../generated/graphql';
import { getAvatar, useAuthSync, useTabs } from '../../utils';
import { withApollo, withRedux } from '../../lib';

import React from 'react';
import { compose } from 'redux';
import { includeDefaultNamespaces } from '../../i18n';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

interface Props extends I18nProps {
    user?: UserType;
}

const UserPage: I18nPage<Props> = ({ user }) => {
    const { t, i18n } = useTranslation();

    if (user) {
        const { tabValue, handleTabChange } = useTabs();
        const username = R.propOr('-', 'username', user) as string;
        const email = R.propOr('-', 'email', user) as string;
        const title = R.propOr('-', 'title', user) as string;
        const bio = R.propOr('-', 'bio', user) as string;
        const points = R.propOr('-', 'points', user);
        const courseCount = R.propOr('-', 'courseCount', user);
        const resourceCount = R.propOr('-', 'resourceCount', user);
        moment.locale(i18n.language); // Set moment language.
        const joined = moment(user.created).format('LL');
        const isOwnProfile = user.id === useSelector((state: State) => R.path(['auth', 'user', 'id'], state));

        const renderPrivateContent = (
            <>
                <ButtonLink href="/account/edit-profile" color="primary" variant="outlined" fullWidth>
                    {t('profile:editProfileButton')}
                </ButtonLink>
                <Box className="sm-up" marginLeft="0.5rem">
                    <SettingsButton color="primary" />
                </Box>
            </>
        );

        const renderTopSection = (
            <Box className="flex-flow" display="flex" justifyContent="space-around" alignItems="center">
                <CardContent>
                    <Avatar className="main-avatar" src={getAvatar(user)} />
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
                                    <SchoolOutlined />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText>
                                {t('common:courses')}: {courseCount}
                            </ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <CloudUploadOutlined />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText>
                                {t('common:resources')}: {resourceCount}
                            </ListItemText>
                        </ListItem>
                        <ListItem>{isOwnProfile && renderPrivateContent}</ListItem>
                    </StyledList>
                </CardContent>
            </Box>
        );

        const renderAccountInfo = (
            <CardContent>
                <Box textAlign="left" marginTop="1rem">
                    <Box display="flex" flexDirection="column" marginY="0.5rem">
                        <Typography className="label" variant="body2" color="textSecondary">
                            {t('common:username')}
                        </Typography>
                        <Typography variant="body1">{username}</Typography>
                    </Box>
                    {isOwnProfile && (
                        <Box display="flex" flexDirection="column" marginY="0.5rem">
                            <Typography className="label" variant="body2" color="textSecondary">
                                {t('common:email')}
                            </Typography>
                            <Typography variant="body1">{email}</Typography>
                        </Box>
                    )}
                    <Box display="flex" flexDirection="column" marginY="0.5rem">
                        <Typography className="label" variant="body2" color="textSecondary">
                            {t('common:title')}
                        </Typography>
                        <Typography variant="body1">{title}</Typography>
                    </Box>
                    <Typography className="label" variant="body2" color="textSecondary">
                        {t('common:joined')} {joined}
                    </Typography>
                </Box>
            </CardContent>
        );

        const renderBioSection = (
            <CardContent>
                <Box textAlign="left">
                    <Typography className="label" variant="body2" color="textSecondary">
                        {t('common:bio')}
                    </Typography>
                    <Typography variant="body1">{bio}</Typography>
                </Box>
            </CardContent>
        );

        const renderTabs = (
            <StyledTabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="primary"
                textColor="primary"
            >
                <Tab label={t('common:courses')} />
                <Tab label={t('common:resources')} />
            </StyledTabs>
        );

        const renderTabContent = (
            <CardContent>
                <TabPanel value={tabValue} index={0}>
                    Courses will be here...
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    Resources will be here...
                </TabPanel>
            </CardContent>
        );

        return (
            <MainLayout heading={username} title={username} backUrl>
                <StyledCard>
                    {renderTopSection}
                    <Divider />
                    {renderAccountInfo}
                    <Divider />
                    {renderBioSection}
                    <Divider />
                    {renderTabs}
                    {renderTabContent}
                </StyledCard>
            </MainLayout>
        );
    } else {
        return <NotFound title={t('profile:notFound')} />;
    }
};

UserPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
    await useAuthSync(ctx);
    const { query, apolloClient } = ctx;
    const nameSpaces = { namespacesRequired: includeDefaultNamespaces(['profile']) };

    try {
        const { data } = await apolloClient.query({
            query: UserDetailDocument,
            variables: query,
        });

        return { ...data, ...nameSpaces };
    } catch {
        return nameSpaces;
    }
};

export default compose(withRedux, withApollo)(UserPage);
