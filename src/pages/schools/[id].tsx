import { TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { withApolloSSR, withAuthSync } from 'src/lib';

import {
    CourseObjectType,
    SchoolDetailDocument,
    SchoolObjectType,
    SubjectObjectType,
} from '../../../generated/graphql';
import {
    CourseTableBody,
    FrontendPaginatedTable,
    InfoModalContent,
    NotFoundBox,
    NotFoundLayout,
    StyledList,
    TabLayout,
    TextLink,
} from '../../components';
import { includeDefaultNamespaces, Link } from '../../i18n';
import { I18nProps, SkolePageContext } from '../../types';
import { useFrontendPagination, useOptions, useSearch } from '../../utils';

interface Props extends I18nProps {
    school?: SchoolObjectType;
}

const SchoolDetailPage: NextPage<Props> = ({ school }) => {
    const { t } = useTranslation();
    const { searchUrl } = useSearch();
    const schoolName = R.propOr('', 'name', school) as string;
    const { renderShareOption, renderOptionsHeader, drawerProps } = useOptions(schoolName);
    const schoolTypeName = R.pathOr('', ['schoolType', 'name'], school) as string;
    const schoolTypeId = R.pathOr('', ['schoolType', 'id'], school) as string;
    const country = R.pathOr('', ['country', 'name'], school) as string;
    const city = R.pathOr('', ['city', 'name'], school) as string;
    const subjects = R.propOr([], 'subjects', school) as SubjectObjectType[];
    const courses = R.propOr([], 'courses', school) as CourseObjectType[];
    const subjectCount = subjects.length;
    const courseCount = courses.length;
    const countryId = R.pathOr('', ['country', 'id'], school);
    const cityId = R.pathOr('', ['city', 'id'], school);
    const { paginatedItems: paginatedSubjects, ...subjectPaginationProps } = useFrontendPagination(subjects);
    const { paginatedItems: paginatedCourses, ...coursePaginationProps } = useFrontendPagination(courses);

    const schoolTypeLink = {
        ...searchUrl,
        query: { ...searchUrl.query, schoolType: schoolTypeId },
    };

    const countryLink = {
        ...searchUrl,
        query: { ...searchUrl.query, country: countryId },
    };

    const cityLink = {
        ...searchUrl,
        query: { ...searchUrl.query, city: cityId },
    };

    const renderSchoolTypeLink = (
        <TextLink href={schoolTypeLink} color="primary">
            {schoolTypeName}
        </TextLink>
    );

    const renderCountryLink = (
        <TextLink href={countryLink} color="primary">
            {country}
        </TextLink>
    );

    const renderCityLink = (
        <TextLink href={cityLink} color="primary">
            {city}
        </TextLink>
    );

    const infoItems = [
        {
            label: t('common:name'),
            value: schoolName,
        },
        {
            label: t('common:courses'),
            value: courseCount,
        },
        {
            label: t('common:subjects'),
            value: subjectCount,
        },
        {
            label: t('common:schoolType'),
            value: renderSchoolTypeLink,
        },
        {
            label: t('common:country'),
            value: renderCountryLink,
        },
        {
            label: t('common:city'),
            value: renderCityLink,
        },
    ];

    const renderInfo = <InfoModalContent infoItems={infoItems} />;
    const renderOptions = <StyledList>{renderShareOption}</StyledList>;

    const renderSubjectsTableBody = (
        <TableBody>
            {paginatedSubjects.map((s: SubjectObjectType, i: number) => (
                <Link href={{ ...searchUrl, query: { ...searchUrl.query, subject: s.id } }} key={i}>
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
        titleRight: t('common:score'),
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
        },
        headerDesktop: schoolName,
        tabLabelLeft: `${t('common:subjects')} (${subjectCount})`,
        tabLabelRight: `${t('common:courses')} (${courseCount})`,
        renderInfo,
        infoHeader: t('school:infoHeader'),
        infoTooltip: t('school:infoTooltip'),
        optionProps: {
            renderOptions,
            renderOptionsHeader,
            drawerProps,
            optionsTooltip: t('school:optionsTooltip'),
        },
        renderLeftContent: renderSubjects,
        renderRightContent: renderCourses,
        responsive: true,
    };

    if (school) {
        return <TabLayout {...layoutProps} />;
    } else {
        return <NotFoundLayout />;
    }
};

export const getServerSideProps: GetServerSideProps = withApolloSSR(async ctx => {
    const { apolloClient, query } = ctx as SkolePageContext;
    const namespaces = { namespacesRequired: includeDefaultNamespaces(['school']) };

    try {
        const { data } = await apolloClient.query({
            query: SchoolDetailDocument,
            variables: query,
        });

        return { props: { ...data, ...namespaces } };
    } catch {
        return { props: { ...namespaces } };
    }
});

export default withAuthSync(SchoolDetailPage);
