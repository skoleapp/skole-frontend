import {
    Avatar,
    CardContent,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from '@material-ui/core';
import { FlagOutlined, HouseOutlined, LocationCityOutlined, SchoolOutlined, SubjectOutlined } from '@material-ui/icons';
import Link from 'next/link';
import * as R from 'ramda';
import React from 'react';
import { compose } from 'redux';

import {
    CourseObjectType,
    SchoolDetailDocument,
    SchoolObjectType,
    SubjectObjectType,
} from '../../../generated/graphql';
import { CourseTableBody, NotFound, StyledList, StyledTable, TabLayout, TextLink } from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { useFrontendPagination, useOptions, withAuthSync } from '../../utils';

interface Props extends I18nProps {
    school?: SchoolObjectType;
}

const SchoolDetailPage: I18nPage<Props> = ({ school }) => {
    const { t } = useTranslation();
    const { renderShareOption, renderOptionsHeader, drawerProps } = useOptions();

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

        const {
            renderTablePagination: renderSubjectsTablePagination,
            paginatedItems: paginatedSubjects,
            renderNotFound: subjectsNotFound,
        } = useFrontendPagination({
            items: subjects,
            notFoundText: 'school:noSubjects',
        });

        const {
            renderTablePagination: renderCoursesTablePagination,
            paginatedItems: paginatedCourses,
            renderNotFound: coursesNotFound,
            renderTableHead: renderCoursesTableHead,
        } = useFrontendPagination({
            items: courses,
            titleLeft: 'common:name',
            titleRight: 'common:points',
            notFoundText: 'school:noCourses',
        });

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

        const renderOptions = <StyledList>{renderShareOption}</StyledList>;

        const optionProps = {
            renderOptions,
            renderOptionsHeader,
            drawerProps,
        };

        const renderSubjects = !!subjects.length ? (
            <StyledTable disableBoxShadow>
                <TableContainer>
                    <Table>
                        <TableBody>
                            {paginatedSubjects.map((s: SubjectObjectType, i: number) => (
                                <Link href={{ pathname: '/search', query: { subject: s.id } }} key={i}>
                                    <TableRow>
                                        <TableCell>
                                            <Typography variant="subtitle1">{R.propOr('-', 'name', s)}</Typography>
                                        </TableCell>
                                    </TableRow>
                                </Link>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {renderSubjectsTablePagination}
            </StyledTable>
        ) : (
            subjectsNotFound
        );

        const renderCourses = !!courses.length ? (
            <StyledTable disableBoxShadow>
                <TableContainer>
                    <Table>
                        {renderCoursesTableHead}
                        <CourseTableBody courses={paginatedCourses} />
                    </Table>
                </TableContainer>
                {renderCoursesTablePagination}
            </StyledTable>
        ) : (
            coursesNotFound
        );

        return (
            <TabLayout
                title={schoolName}
                titleSecondary={t('common:courses')}
                tabLabelLeft={t('common:subjects')}
                renderInfo={renderInfo}
                optionProps={optionProps}
                renderLeftContent={renderSubjects}
                renderRightContent={renderCourses}
                singleColumn
                dynamicBackUrl
            />
        );
    } else {
        return <NotFound title={t('school:notFound')} />;
    }
};

SchoolDetailPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
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

export default compose(withAuthSync, withApollo, withRedux)(SchoolDetailPage);
