import {
    Avatar,
    Box,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from '@material-ui/core';
import { SchoolOutlined, SubjectOutlined } from '@material-ui/icons';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';

import { SchoolDetailDocument, SchoolType } from '../../../generated/graphql';
import { ButtonLink, MainLayout, NotFound, StyledCard, StyledList, TextLink } from '../../components';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { useAuthSync } from '../../utils';

interface Props extends I18nProps {
    school?: SchoolType;
}

const SchoolDetailPage: I18nPage<Props> = ({ school }) => {
    const { t } = useTranslation();

    if (school) {
        const schoolName = R.propOr('-', 'name', school) as string;
        const schoolType = R.propOr('-', 'schoolType', school) as string;
        const country = R.propOr('-', 'country', school) as string;
        const city = R.propOr('-', 'city', school) as string;
        const courseCount = R.propOr('-', 'courseCount', school);
        const subjectCount = R.propOr('-', 'subjectCount', school);

        const schoolTypeLink = {
            pathname: '/search',
            query: { schoolType: R.propOr('', 'schoolType', school) as boolean[] },
        };

        const countryLink = {
            pathname: '/search',
            query: { countryName: R.propOr('', 'country', school) as boolean[] },
        };

        const cityLink = {
            pathname: '/search',
            query: { cityName: R.propOr('', 'city', school) as boolean[] },
        };

        const seeCoursesLink = {
            pathname: '/search',
            query: { schoolName: R.propOr('', 'name', school) as boolean[] },
        };

        return (
            <MainLayout heading={schoolName} title={schoolName} backUrl>
                <StyledCard>
                    <CardHeader title={schoolName} />
                    <Divider />
                    <Grid container alignItems="center">
                        <Grid item container sm={6} justify="center">
                            <CardContent>
                                <Box textAlign="left">
                                    <Typography variant="body1">
                                        {t('common:schoolType')}:{' '}
                                        <TextLink href={schoolTypeLink} color="primary">
                                            {schoolType}
                                        </TextLink>
                                    </Typography>
                                    <Typography variant="body1">
                                        {t('common:country')}:{' '}
                                        <TextLink href={countryLink} color="primary">
                                            {country}
                                        </TextLink>
                                    </Typography>
                                    <Typography variant="body1">
                                        {t('common:city')}:{' '}
                                        <TextLink href={cityLink} color="primary">
                                            {city}
                                        </TextLink>
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Grid>
                        <Grid item container direction="column" sm={6} justify="center">
                            <CardContent>
                                <StyledList>
                                    <ListItem divider>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <SchoolOutlined />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText>
                                            {t('common:courses')}: {courseCount}
                                        </ListItemText>
                                    </ListItem>
                                    <ListItem divider>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <SubjectOutlined />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText>
                                            {t('common:subjects')}: {subjectCount}
                                        </ListItemText>
                                    </ListItem>
                                </StyledList>
                            </CardContent>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid container justify="center">
                        <Grid item xs={12} sm={6} md={4} lg={3}>
                            <CardContent>
                                <ButtonLink href={seeCoursesLink} variant="outlined" color="primary" fullWidth>
                                    {t('school:seeCoursesButton')}
                                </ButtonLink>
                            </CardContent>
                        </Grid>
                    </Grid>
                </StyledCard>
            </MainLayout>
        );
    } else {
        return <NotFound title={t('school:notFound')} />;
    }
};

SchoolDetailPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
    await useAuthSync(ctx);
    const { apolloClient, query } = ctx;
    const nameSpaces = { namespacesRequired: includeDefaultNamespaces(['school']) };

    try {
        const { data } = await apolloClient.query({
            query: SchoolDetailDocument,
            variables: query,
        });

        return { ...data, ...nameSpaces };
    } catch {
        return nameSpaces;
    }
};

export default compose(withApollo, withRedux)(SchoolDetailPage);
