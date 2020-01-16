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
    Typography,
} from '@material-ui/core';
import { ButtonLink, MainLayout, NotFound, StyledCard, StyledList, TextLink } from '../../components';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { SchoolDetailDocument, SchoolType } from '../../../generated/graphql';
import { SchoolOutlined, SubjectOutlined } from '@material-ui/icons';
import { withApollo, withRedux } from '../../lib';

import React from 'react';
import { compose } from 'redux';
import { includeDefaultNamespaces } from '../../i18n';
import { useAuthSync } from '../../utils';
import { useTranslation } from 'react-i18next';

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

        const renderSchoolInfo = (
            <Box className="flex-flow" display="flex" justifyContent="space-around" alignItems="center">
                <CardContent>
                    <Box textAlign="left">
                        <Typography variant="body1">
                            {t('common:schoolType')}:{' '}
                            <TextLink
                                href={{
                                    pathname: '/search',
                                    query: { schoolType: R.propOr('', 'schoolType', school) },
                                }}
                                color="primary"
                            >
                                {schoolType}
                            </TextLink>
                        </Typography>
                        <Typography variant="body1">
                            {t('common:country')}:{' '}
                            <TextLink
                                href={{ pathname: '/search', query: { countryName: R.propOr('', 'country', school) } }}
                                color="primary"
                            >
                                {country}
                            </TextLink>
                        </Typography>
                        <Typography variant="body1">
                            {t('common:city')}:{' '}
                            <TextLink
                                href={{ pathname: '/search', query: { cityName: R.propOr('', 'city', school) } }}
                                color="primary"
                            >
                                {city}
                            </TextLink>
                        </Typography>
                    </Box>
                </CardContent>
                <CardContent>
                    <StyledList>
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
                                    <SubjectOutlined />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText>
                                {t('common:subjects')}: {subjectCount}
                            </ListItemText>
                        </ListItem>
                    </StyledList>
                </CardContent>
            </Box>
        );

        const renderSeeCoursesButton = (
            <ButtonLink
                href={{ pathname: '/search', query: { schoolName: R.propOr('', 'name', school) } }}
                variant="outlined"
                color="primary"
            >
                {t('school:seeCoursesButton')}
            </ButtonLink>
        );

        return (
            <MainLayout heading={schoolName} title={schoolName} backUrl>
                <StyledCard>
                    <CardHeader title={schoolName} />
                    <Divider />
                    {renderSchoolInfo}
                    {renderSeeCoursesButton}
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
