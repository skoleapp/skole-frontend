import {
    Box,
    CardActionArea,
    CardHeader,
    Grid,
    List,
    ListItemIcon,
    ListItemText,
    makeStyles,
    MenuItem,
    Paper,
    Tab,
    TableBody,
    TableCell,
    TableRow,
    Tabs,
    Tooltip,
    Typography,
} from '@material-ui/core';
import { AddCircleOutlineOutlined, AssignmentOutlined, SchoolOutlined } from '@material-ui/icons';
import clsx from 'clsx';
import {
    CourseTableBody,
    ErrorLayout,
    IconButtonLink,
    InfoDialogContent,
    LoadingLayout,
    MainLayout,
    NotFoundBox,
    NotFoundLayout,
    OfflineLayout,
    PaginatedTable,
    ResponsiveDialog,
    TextLink,
} from 'components';
import { useAuthContext } from 'context';
import { CourseObjectType, SchoolObjectType, SchoolQueryVariables, SubjectObjectType, useSchoolQuery } from 'generated';
import { withUserMe } from 'hocs';
import {
    useActionsDialog,
    useInfoDialog,
    useLanguageHeaderContext,
    useMediaQueries,
    useSearch,
    useShare,
    useSwipeableTabs,
} from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import { BORDER_RADIUS } from 'theme';
import { urls } from 'utils';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        [breakpoints.up('lg')]: {
            borderRadius: BORDER_RADIUS,
        },
    },
    icon: {
        marginRight: spacing(0.5),
        marginLeft: spacing(1.5),
        width: '1rem',
        height: '1rem',
    },
    courseIcon: {
        marginLeft: 0,
    },
}));

const SchoolDetailPage: NextPage = () => {
    const classes = useStyles();
    const { verified, verificationRequiredTooltip } = useAuthContext();
    const { t } = useTranslation();
    const { isDesktop, isMobileOrTablet } = useMediaQueries();
    const { searchUrl } = useSearch();
    const { query } = useRouter();
    const variables: SchoolQueryVariables = R.pick(['id', 'page', 'pageSize'], query);
    const context = useLanguageHeaderContext();
    const { data, loading, error } = useSchoolQuery({ variables, context });
    const school: SchoolObjectType = R.propOr(null, 'school', data);
    const schoolId: string = R.propOr('', 'id', school);
    const schoolName: string = R.propOr('', 'name', school);
    const schoolTypeName: string = R.pathOr('', ['schoolType', 'name'], school);
    const schoolTypeId: string = R.pathOr('', ['schoolType', 'id'], school);
    const country: string = R.pathOr('', ['country', 'name'], school);
    const city: string = R.pathOr('', ['city', 'name'], school);
    const subjects: SubjectObjectType[] = R.pathOr([], ['subjects', 'objects'], school);
    const courses: CourseObjectType[] = R.pathOr([], ['courses', 'objects'], school);
    const subjectCount = R.pathOr(0, ['subjects', 'count'], data);
    const courseCount = R.pathOr(0, ['courses', 'count'], data);
    const countryId: string = R.pathOr('', ['country', 'id'], school);
    const cityId: string = R.pathOr('', ['city', 'id'], school);
    const { tabValue, handleTabChange, handleIndexChange } = useSwipeableTabs();
    const { renderShareButton } = useShare({ text: schoolName });
    const addCourseTooltip = verificationRequiredTooltip || t('tooltips:addCourse');
    const { infoDialogOpen, infoDialogHeaderProps, renderInfoButton, handleCloseInfoDialog } = useInfoDialog();
    const addCourseHref = { pathname: urls.createCourse, query: { school: schoolId } };

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
            <Typography component="span">
                <IconButtonLink
                    href={addCourseHref}
                    icon={AddCircleOutlineOutlined}
                    disabled={verified === false}
                    color={isMobileOrTablet ? 'secondary' : 'default'}
                    size="small"
                />
            </Typography>
        </Tooltip>
    );

    const renderCourseIcon = <SchoolOutlined className={clsx(classes.icon, classes.courseIcon)} />;
    const renderResourceIcon = <AssignmentOutlined className={classes.icon} />;

    const renderSubjectsTableBody = (
        <TableBody>
            {subjects.map((s: SubjectObjectType, i: number) => (
                <Link href={{ ...searchUrl, query: { ...searchUrl.query, subject: s.id } }} key={i}>
                    <CardActionArea>
                        <TableRow>
                            <TableCell>
                                <Typography variant="body2">{R.propOr('-', 'name', s)}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    <Grid container alignItems="center">
                                        {renderCourseIcon}
                                        {s.courseCount}
                                        {renderResourceIcon}
                                        {s.resourceCount}
                                    </Grid>
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </CardActionArea>
                </Link>
            ))}
        </TableBody>
    );

    const renderCourseTableBody = <CourseTableBody courses={courses} />;

    const commonTableHeadProps = {
        titleLeft: t('common:name'),
    };

    const courseTableHeadProps = {
        ...commonTableHeadProps,
        titleRight: t('common:score'),
    };

    const renderSubjects = !!subjects.length ? (
        <PaginatedTable
            tableHeadProps={commonTableHeadProps}
            renderTableBody={renderSubjectsTableBody}
            count={subjectCount}
        />
    ) : (
        <NotFoundBox text={t('school:noSubjects')} />
    );

    const renderCourses = !!courses.length ? (
        <PaginatedTable
            tableHeadProps={courseTableHeadProps}
            renderTableBody={renderCourseTableBody}
            count={courseCount}
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
        <Paper className={classes.root}>
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

    const renderAddCourseAction = (
        <Link href={addCourseHref}>
            <MenuItem>
                <ListItemIcon>
                    <AddCircleOutlineOutlined />
                </ListItemIcon>
                <ListItemText>{t('school:addCourse')}</ListItemText>
            </MenuItem>
        </Link>
    );

    const renderActionsDialogContent = (
        <List>
            {renderShareAction}
            {renderAddCourseAction}
        </List>
    );

    const renderActionsDrawer = (
        <ResponsiveDialog
            open={actionsDialogOpen}
            onClose={handleCloseActionsDialog}
            dialogHeaderProps={actionsDialogHeaderProps}
        >
            {renderActionsDialogContent}
        </ResponsiveDialog>
    );

    const layoutProps = {
        seoProps: {
            title: schoolName,
            description: t('school:description', { schoolName }),
        },
        topNavbarProps: {
            dynamicBackUrl: true,
            headerLeft: renderAddCourseButton,
            headerRight: renderActionsButton,
            headerRightSecondary: renderInfoButton,
        },
    };

    if (loading) {
        return <LoadingLayout />;
    }

    if (!!error && !!error.networkError) {
        return <OfflineLayout />;
    } else if (!!error) {
        return <ErrorLayout />;
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
        fallback: 'blocking',
    };
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        _ns: await loadNamespaces(['school'], locale),
    },
});

export default withUserMe(SchoolDetailPage);
