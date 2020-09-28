import {
    Box,
    CardActionArea,
    CardHeader,
    List,
    makeStyles,
    Paper,
    Tab,
    TableBody,
    TableCell,
    TableRow,
    Tabs,
    Tooltip,
    Typography,
} from '@material-ui/core';
import { AddCircleOutlineOutlined } from '@material-ui/icons';
import clsx from 'clsx';
import {
    CourseTableBody,
    ErrorLayout,
    FrontendPaginatedTable,
    IconButtonLink,
    InfoDialogContent,
    LoadingLayout,
    MainLayout,
    NotFoundBox,
    NotFoundLayout,
    OfflineLayout,
    ResponsiveDialog,
    TextLink,
} from 'components';
import { useAuthContext } from 'context';
import { CourseObjectType, SchoolObjectType, SubjectObjectType, useSchoolDetailQuery } from 'generated';
import {
    useActionsDialog,
    useFrontendPagination,
    useInfoDialog,
    useMediaQueries,
    useQueryOptions,
    useSearch,
    useShare,
    useSwipeableTabs,
} from 'hooks';
import { includeDefaultNamespaces, Link, useTranslation, withUserMe } from 'lib';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { AuthProps } from 'types';
import { urls } from 'utils';

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
});

const SchoolDetailPage: NextPage<AuthProps> = ({ authLoading, authNetworkError }) => {
    const classes = useStyles();
    const { isFallback } = useRouter();
    const queryOptions = useQueryOptions();
    const { data, loading: courseDataLoading, error } = useSchoolDetailQuery(queryOptions);
    const loading = authLoading || isFallback || courseDataLoading;
    const networkError = (!!error && !!error.networkError) || !!authNetworkError;
    const { verified, verificationRequiredTooltip } = useAuthContext();
    const { t } = useTranslation();
    const { isDesktop, isMobileOrTablet } = useMediaQueries();
    const { searchUrl } = useSearch();
    const school: SchoolObjectType = R.propOr(null, 'school', data);
    const schoolId = R.propOr('', 'id', school) as string;
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
    const notFound = t('school:notFound');
    const title = !!school ? schoolName : !isFallback ? notFound : '';
    const description = !!school ? t('school:description', { schoolName }) : !isFallback ? notFound : '';
    const addCourseTooltip = verificationRequiredTooltip || t('tooltips:addCourse');
    const { infoDialogOpen, infoDialogHeaderProps, renderInfoButton, handleCloseInfoDialog } = useInfoDialog();

    const {
        actionsDialogOpen,
        actionsDialogHeaderProps,
        handleCloseActionsDialog,
        renderActionsButton,
        renderShareAction,
    } = useActionsDialog({ text: schoolName });

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

    const renderAddCourseButton = (
        <Tooltip title={addCourseTooltip}>
            <span>
                <IconButtonLink
                    href={{ pathname: urls.createCourse, query: { school: schoolId } }}
                    icon={AddCircleOutlineOutlined}
                    disabled={verified === false}
                    color={isMobileOrTablet ? 'secondary' : 'default'}
                    size="small"
                />
            </span>
        </Tooltip>
    );

    const renderSubjectsTableBody = (
        <TableBody>
            {paginatedSubjects.map((s: SubjectObjectType, i: number) => (
                <Link href={{ ...searchUrl, query: { ...searchUrl.query, subject: s.id } }} key={i}>
                    <CardActionArea>
                        <TableRow>
                            <TableCell>
                                <Typography variant="body2">{R.propOr('-', 'name', s)}</Typography>
                            </TableCell>
                        </TableRow>
                    </CardActionArea>
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

    const renderAction = (
        <>
            {renderAddCourseButton}
            {renderShareButton}
            {renderInfoButton}
            {renderActionsButton}
        </>
    );

    const renderSchoolHeader = isDesktop && <CardHeader title={schoolName} action={renderAction} />;

    const renderTabs = (
        <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={`${t('common:subjects')} (${subjectCount})`} />
            <Tab label={`${t('common:courses')} (${courseCount})`} />
        </Tabs>
    );

    const renderSwipeableViews = (
        <Box flexGrow="1" position="relative">
            <SwipeableViews index={tabValue} onChangeIndex={handleIndexChange}>
                {renderSubjects}
                {renderCourses}
            </SwipeableViews>
        </Box>
    );

    const renderContent = (
        <Paper className={clsx('paper-container', classes.root)}>
            {renderSchoolHeader}
            {renderTabs}
            {renderSwipeableViews}
        </Paper>
    );

    const renderInfoDialogContent = <InfoDialogContent infoItems={infoItems} />;

    const renderInfoDialog = (
        <ResponsiveDialog
            open={infoDialogOpen}
            onClose={handleCloseInfoDialog}
            dialogHeaderProps={infoDialogHeaderProps}
        >
            {renderInfoDialogContent}
        </ResponsiveDialog>
    );

    const renderActionsDialogContent = <List>{renderShareAction}</List>;

    const renderActionsDrawer = (
        <ResponsiveDialog
            open={actionsDialogOpen}
            onClose={handleCloseActionsDialog}
            dialogHeaderProps={actionsDialogHeaderProps}
        >
            {renderActionsDialogContent}
        </ResponsiveDialog>
    );

    const seoProps = {
        title,
        description,
    };

    const layoutProps = {
        seoProps,
        tabLabelLeft: `${t('common:subjects')} (${subjectCount})`,
        tabLabelRight: `${t('common:courses')} (${courseCount})`,
        topNavbarProps: {
            dynamicBackUrl: true,
            headerLeft: renderAddCourseButton,
            headerRight: renderActionsButton,
            headerRightSecondary: renderInfoButton,
        },
    };

    if (loading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    if (networkError) {
        return <OfflineLayout seoProps={seoProps} />;
    } else if (!!error) {
        return <ErrorLayout seoProps={seoProps} />;
    }

    if (!!school) {
        return (
            <MainLayout {...layoutProps}>
                {renderContent}
                {renderInfoDialog}
                {renderActionsDrawer}
            </MainLayout>
        );
    } else {
        return <NotFoundLayout />;
    }
};

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: true,
    };
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['school']),
    },
    revalidate: 1,
});

export default withUserMe(SchoolDetailPage);
