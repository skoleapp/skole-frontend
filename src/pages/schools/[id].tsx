import {
    Avatar,
    CardContent,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@material-ui/core';
import { FlagOutlined, HouseOutlined, LocationCityOutlined, SchoolOutlined, SubjectOutlined } from '@material-ui/icons';
import * as R from 'ramda';
import React from 'react';
import { compose } from 'redux';

import {
    CourseObjectType,
    SchoolDetailDocument,
    SchoolObjectType,
    SubjectObjectType,
} from '../../../generated/graphql';
import { NotFound, StyledList, StyledTable, TabLayout, TextLink } from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces, Router } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { useOptions, usePrivatePage } from '../../utils';

interface Props extends I18nProps {
    school?: SchoolObjectType;
}

const SchoolDetailPage: I18nPage<Props> = ({ school }) => {
    const { t } = useTranslation();
    const { renderShareOption, renderReportOption } = useOptions();

    if (school) {
        const schoolName = R.propOr('-', 'name', school) as string;
        const schoolType = R.propOr('-', 'schoolType', school) as string;
        const country = R.propOr('-', 'country', school) as string;
        const city = R.propOr('-', 'city', school) as string;
        const courseCount = R.propOr('-', 'courseCount', school);
        const subjectCount = R.propOr('-', 'subjectCount', school);
        const subjects = R.propOr([], 'subjects', school) as SubjectObjectType[];
        const courses = R.propOr([], 'courses', school) as CourseObjectType[];

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

        const renderInfo = (
            <CardContent>
                <StyledList>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <SchoolOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:courses')}: {courseCount}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <SubjectOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:subjects')}: {subjectCount}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <HouseOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:schoolType')}:{' '}
                                <TextLink href={schoolTypeLink} color="primary">
                                    {schoolType}
                                </TextLink>
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <FlagOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:country')}:{' '}
                                <TextLink href={countryLink} color="primary">
                                    {country}
                                </TextLink>
                            </Typography>
                        </ListItemText>
                    </ListItem>
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <LocationCityOutlined />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText>
                            <Typography variant="body2">
                                {t('common:city')}:{' '}
                                <TextLink href={cityLink} color="primary">
                                    {city}
                                </TextLink>
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
            </StyledList>
        );

        const renderSubjects = subjects.length ? (
            <StyledTable disableBoxShadow>
                <Table>
                    <TableBody>
                        {subjects.map((s: SubjectObjectType, i: number) => (
                            <TableRow
                                key={i}
                                onClick={(): Promise<boolean> =>
                                    Router.push({ pathname: '/search', query: { subject: s.id } })
                                }
                            >
                                <TableCell>
                                    <Typography variant="subtitle1">{R.propOr('-', 'name', s)}</Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </StyledTable>
        ) : (
            <CardContent>
                <Typography variant="subtitle1">{t('school:noSubjects')}</Typography>
            </CardContent>
        );

        const renderCourses = courses.length ? (
            <StyledTable disableBoxShadow>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle1" color="textSecondary">
                                    {t('common:name')}
                                </Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="subtitle1" color="textSecondary">
                                    {t('common:points')}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {courses.map((c: CourseObjectType, i: number) => (
                            <TableRow key={i} onClick={(): Promise<boolean> => Router.push(`/courses/${c.id}`)}>
                                <TableCell>
                                    <Typography variant="subtitle1">{R.propOr('-', 'name', c)}</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="subtitle1">{R.propOr('-', 'points', c)}</Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </StyledTable>
        ) : (
            <CardContent>
                <Typography variant="subtitle1">{t('school:noCourses')}</Typography>
            </CardContent>
        );

        return (
            <TabLayout
                title={schoolName}
                titleSecondary={t('common:courses')}
                tabLabelLeft={t('common:subjects')}
                renderInfo={renderInfo}
                renderOptions={renderOptions}
                renderLeftContent={renderSubjects}
                renderRightContent={renderCourses}
                singleColumn
                backUrl
            />
        );
    } else {
        return <NotFound title={t('school:notFound')} />;
    }
};

SchoolDetailPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
    await usePrivatePage(ctx);
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
