import {
    Avatar,
    CardContent,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from '@material-ui/core';
import { FlagOutlined, HouseOutlined, LocationCityOutlined, SchoolOutlined, SubjectOutlined } from '@material-ui/icons';
import Link from 'next/link';
import * as R from 'ramda';
import React from 'react';

import {
    CourseObjectType,
    SchoolDetailDocument,
    SchoolObjectType,
    SubjectObjectType,
} from '../../../generated/graphql';
import {
    CourseTableBody,
    FrontendPaginatedTable,
    NotFoundBox,
    NotFoundLayout,
    StyledList,
    TabLayout,
    TextLink,
} from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo } from '../../lib';
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
        const { paginatedItems: paginatedSubjects, ...subjectPaginationProps } = useFrontendPagination(subjects);
        const { paginatedItems: paginatedCourses, ...coursePaginationProps } = useFrontendPagination(courses);

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

        const renderOptions = <StyledList>{renderShareOption}</StyledList>;

        const renderSubjectsTableBody = (
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
        );

        const commonTableHeadProps = {
            titleLeft: t('common:name'),
        };

        const renderSubjects = !!subjects.length ? (
            <FrontendPaginatedTable
                tableHeadProps={commonTableHeadProps}
                renderTableBody={renderSubjectsTableBody}
                paginationProps={subjectPaginationProps}
            />
        ) : (
            <NotFoundBox text={t('school:noSubjects')} />
        );

        const courseTableHeadProps = {
            ...commonTableHeadProps,
            titleRight: 'common:points',
        };

        const renderCourses = !!courses.length ? (
            <FrontendPaginatedTable
                tableHeadProps={courseTableHeadProps}
                renderTableBody={<CourseTableBody courses={paginatedCourses} />}
                paginationProps={coursePaginationProps}
            />
        ) : (
            <NotFoundBox text={t('school:noCourses')} />
        );

        const layoutProps = {
            seoProps: {
                title: schoolName,
                description: t('school:description'),
            },
            topNavbarProps: {
                dynamicBackUrl: true,
                header: schoolName,
            },
            headerDesktop: schoolName,
            headerSecondary: t('common:courses'),
            tabLabelLeft: `${t('common:subjects')} (${subjectCount})`,
            tabLabelRight: `${t('common:courses')} (${courseCount})`,
            renderInfo,
            optionProps: {
                renderOptions,
                renderOptionsHeader,
                drawerProps,
            },
            renderLeftContent: renderSubjects,
            renderRightContent: renderCourses,
            singleColumn: true,
        };

        return <TabLayout {...layoutProps} />;
    } else {
        return <NotFoundLayout />;
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

export default withApollo(withAuthSync(SchoolDetailPage));
