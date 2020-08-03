import { Box, Grid, Tab, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import {
    CourseTableBody,
    ErrorLayout,
    FrontendPaginatedTable,
    InfoModalContent,
    LoadingLayout,
    MainLayout,
    NotFoundBox,
    NotFoundLayout,
    OfflineLayout,
    StyledCard,
    StyledDrawer,
    StyledList,
    StyledSwipeableViews,
    StyledTabs,
    TextLink,
} from 'components';
import { useDeviceContext } from 'context';
import { CourseObjectType, SchoolObjectType, SubjectObjectType, useSchoolDetailQuery } from 'generated';
import { useActionsDrawer, useFrontendPagination, useInfoDrawer, useSearch, useShare, useSwipeableTabs } from 'hooks';
import { Link, useTranslation, withAuth } from 'lib';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';

const SchoolDetailPage: NextPage = () => {
    const { query } = useRouter();
    const { t } = useTranslation();
    const isMobile = useDeviceContext();
    const { searchUrl } = useSearch();
    const { data, loading, error } = useSchoolDetailQuery({ variables: query });
    const school: SchoolObjectType = R.propOr(null, 'school', data);
    const schoolName = R.propOr('', 'name', school) as string;
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
    const { tabValue, handleTabChange, handleIndexChange } = useSwipeableTabs();
    const { renderShareButton } = useShare({ text: schoolName });

    const {
        renderInfoHeader,
        renderInfoButton,
        open: infoOpen,
        anchor: infoAnchor,
        onClose: handleCloseInfo,
    } = useInfoDrawer();

    const {
        renderActionsHeader,
        handleCloseActions,
        renderActionsButton,
        renderShareAction,
        open: actionsOpen,
        anchor: actionsAnchor,
    } = useActionsDrawer({ text: schoolName });

    const infoDrawerProps = { open: infoOpen, anchor: infoAnchor, onClose: handleCloseInfo };
    const actionsDrawerProps = { open: actionsOpen, anchor: actionsAnchor, onClose: handleCloseActions };

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

    const renderSchoolName = <Typography variant="subtitle1">{schoolName}</Typography>;

    const renderSchoolHeader = !isMobile && (
        <Box className="custom-header">
            <Grid container justify="space-between">
                <Box display="flex" justifyContent="flex-start" alignItems="center">
                    {renderSchoolName}
                </Box>
                <Box display="flex" justifyContent="flex-end" alignItems="center">
                    {renderShareButton}
                    {renderInfoButton}
                    {renderActionsButton}
                </Box>
            </Grid>
        </Box>
    );

    const renderTabs = (
        <StyledTabs value={tabValue} onChange={handleTabChange}>
            <Tab label={`${t('common:subjects')} (${subjectCount})`} />
            <Tab label={`${t('common:courses')} (${courseCount})`} />
        </StyledTabs>
    );

    const renderSwipeableViews = (
        <StyledSwipeableViews index={tabValue} onChangeIndex={handleIndexChange}>
            <Box display="flex" flexGrow="1" position="relative">
                {renderSubjects}
            </Box>
            <Box display="flex" flexGrow="1">
                {renderCourses}
            </Box>
        </StyledSwipeableViews>
    );

    const renderContent = (
        <StyledCard>
            {renderSchoolHeader}
            {renderTabs}
            {renderSwipeableViews}
        </StyledCard>
    );

    const renderInfo = <InfoModalContent infoItems={infoItems} />;

    const renderInfoDrawer = (
        <StyledDrawer {...infoDrawerProps}>
            {renderInfoHeader}
            {renderInfo}
        </StyledDrawer>
    );

    const renderActions = <StyledList>{renderShareAction}</StyledList>;

    const renderActionsDrawer = (
        <StyledDrawer {...actionsDrawerProps}>
            {renderActionsHeader}
            {renderActions}
        </StyledDrawer>
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
    };

    if (loading) {
        return <LoadingLayout />;
    }

    if (!!error) {
        if (!!error.networkError) {
            return <OfflineLayout />;
        }

        return <ErrorLayout />;
    }

    if (!!school) {
        return (
            <MainLayout {...layoutProps}>
                {renderContent}
                {renderInfoDrawer}
                {renderActionsDrawer}
            </MainLayout>
        );
    } else {
        return <NotFoundLayout />;
    }
};

export default withAuth(SchoolDetailPage);
