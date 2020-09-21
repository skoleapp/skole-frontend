import {
    AppBar,
    Box,
    Button,
    CardHeader,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
    FormControl,
    Grid,
    IconButton,
    InputBase,
    makeStyles,
    Paper,
    useTheme,
} from '@material-ui/core';
import { ArrowBackOutlined, ClearAllOutlined, FilterListOutlined, SearchOutlined } from '@material-ui/icons';
import clsx from 'clsx';
import {
    AutoCompleteField,
    CourseTableBody,
    DialogHeader,
    ErrorLayout,
    FormSubmitSection,
    LoadingLayout,
    MainLayout,
    NativeSelectField,
    NotFoundBox,
    OfflineLayout,
    PaginatedTable,
    TextFormField,
    Transition,
} from 'components';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
    CitiesDocument,
    CityObjectType,
    CountriesDocument,
    CountryObjectType,
    CourseObjectType,
    SchoolObjectType,
    SchoolsDocument,
    SchoolTypeObjectType,
    SchoolTypesDocument,
    SubjectObjectType,
    SubjectsDocument,
    useSearchCoursesQuery,
} from 'generated';
import { useForm, useMediaQueries, useOpen } from 'hooks';
import { includeDefaultNamespaces, useTranslation, withAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import { TOP_NAVBAR_HEIGHT_MOBILE } from 'theme';
import { AuthProps } from 'types';
import { getPaginationQuery, getQueryWithPagination, redirect, urls } from 'utils';

const useStyles = makeStyles(({ palette, spacing }) => ({
    rootContainer: {
        flexGrow: 1,
    },
    container: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    topNavbar: {
        height: `calc(${TOP_NAVBAR_HEIGHT_MOBILE} + env(safe-area-inset-top))`,
        display: 'flex',
        justifyContent: 'flex-end',
        boxShadow: 'none',
    },
    searchContainer: {
        backgroundColor: palette.common.white,
        padding: spacing(1),
        minHeight: TOP_NAVBAR_HEIGHT_MOBILE,
    },
    searchInputBaseInput: {
        paddingLeft: spacing(2),
    },
    filterNames: {
        backgroundColor: palette.common.white, // For mobile.
        display: 'flex',
        flexFlow: 'row wrap',
        paddingTop: spacing(2),
        paddingLeft: spacing(2),
    },
    chip: {
        margin: `0 ${spacing(1)} ${spacing(1)} 0`,
    },
}));

interface FilterSearchResultsFormValues {
    courseName: string;
    courseCode: string;
    school: SchoolObjectType | null;
    subject: SubjectObjectType | null;
    schoolType: SchoolTypeObjectType | null;
    country: CountryObjectType | null;
    city: CityObjectType | null;
    ordering: string;
}

interface ValidFilter {
    name: string;
    value: string;
}

const SearchPage: NextPage<AuthProps> = ({ authLoading, authNetworkError }) => {
    const classes = useStyles();
    const { isMobileOrTablet, isDesktop } = useMediaQueries();
    const { spacing } = useTheme();
    const { t } = useTranslation();
    const { ref, resetForm, setSubmitting } = useForm<FilterSearchResultsFormValues>();
    const { pathname, query } = useRouter();
    const { open: filtersOpen, handleOpen: handleOpenFilters, handleClose: handleCloseFilters } = useOpen();
    const { data, loading, error } = useSearchCoursesQuery({ variables: query });
    const courseObjects: CourseObjectType[] = R.pathOr([], ['searchCourses', 'objects'], data);
    const school: SchoolObjectType = R.propOr(null, 'school', data);
    const subject: SubjectObjectType = R.propOr(null, 'subject', data);
    const schoolType: SchoolTypeObjectType = R.propOr(null, 'schoolType', data);
    const country: CountryObjectType = R.propOr(null, 'county', data);
    const city: CityObjectType = R.propOr(null, 'city', data);
    const count = R.pathOr(0, ['searchCourses', 'count'], data) as number;
    const courseName = R.propOr('', 'courseName', query) as string;
    const courseCode = R.propOr('', 'courseCode', query) as string;
    const ordering = R.propOr('', 'ordering', query) as string;
    const [searchValue, setSearchValue] = useState(courseName);
    const [searchInputSubmitting, setSearchInputSubmitting] = useState(false);
    const onSearchChange = (e: ChangeEvent<HTMLInputElement>): void => setSearchValue(e.target.value);

    // Pick non-empty values and reload the page with new query params.
    const handleSubmitFilters = async (filteredValues: {}): Promise<void> => {
        const validQuery: ParsedUrlQueryInput = R.pickBy((val: string): boolean => !!val, filteredValues);
        await redirect({ pathname, query: validQuery });
        setSubmitting(false);
        handleCloseFilters();
    };

    // Clear the query params and reset form.
    const handleClearFilters = async (): Promise<void> => {
        const paginationQuery = getPaginationQuery(query);
        await redirect({ pathname, query: paginationQuery });
        resetForm();
        setSearchValue('');
        handleCloseFilters();
    };

    // Pre-load query params to the form.
    const initialValues = {
        courseName,
        courseCode,
        school,
        subject,
        schoolType,
        country,
        city,
        ordering,
    };

    // Query that holds pagination plus all search params.
    const queryWithPagination = getQueryWithPagination({ query, extraFilters: initialValues });

    // Query that holds only pagination.
    const paginationQuery = getPaginationQuery(query);

    const filtersArr = [
        {
            name: 'courseName',
            value: courseName,
        },
        {
            name: 'courseCode',
            value: courseCode,
        },
        {
            name: 'school',
            value: R.propOr(undefined, 'name', school) as string,
        },
        {
            name: 'subject',
            value: R.propOr(undefined, 'name', subject) as string,
        },
        {
            name: 'schoolType',
            value: R.propOr(undefined, 'name', schoolType) as string,
        },
        {
            name: 'country',
            value: R.propOr(undefined, 'name', country) as string,
        },
        {
            name: 'city',
            value: R.propOr(undefined, 'name', city) as string,
        },
    ];

    const validFilters: ValidFilter[] = filtersArr.filter(f => !!f.value);

    const handleSearchIconClick = (): void => {
        const input = document.getElementById('search-navbar-input-base');
        !!input && input.focus();
    };

    const handleClearSearchInput = async (): Promise<void> => {
        setSearchInputSubmitting(true);
        setSearchValue('');
        await redirect({ pathname, query: { ...paginationQuery } });
        setSearchInputSubmitting(false);
    };

    const handleSubmitSearchInput = async (e: SyntheticEvent): Promise<void> => {
        e.preventDefault();
        setSearchInputSubmitting(true);
        await redirect({ pathname, query: { ...queryWithPagination, courseName: searchValue } });
        setSearchInputSubmitting(false);
    };

    const handlePreSubmit = <T extends FilterSearchResultsFormValues>(values: T): void => {
        const { courseName, courseCode, school, subject, schoolType, country, city, ordering } = values;

        const filteredValues: FilterSearchResultsFormValues = {
            ...queryWithPagination, // Define this first to override the values.
            courseName,
            courseCode,
            school: R.propOr('', 'id', school),
            subject: R.propOr('', 'id', subject),
            schoolType: R.propOr('', 'id', schoolType),
            country: R.propOr('', 'id', country),
            city: R.propOr('', 'id', city),
            ordering,
        };

        handleSubmitFilters(filteredValues);
    };

    const handleDeleteFilter = (filterName: string) => async (): Promise<void> => {
        setSubmitting(true);
        setSearchInputSubmitting(true);

        const query: ParsedUrlQueryInput = R.pickBy(
            (_: string, key: string) => key !== filterName,
            queryWithPagination,
        );

        filterName === 'courseName' && handleClearSearchInput();
        await redirect({ pathname, query });
        resetForm();
        setSearchInputSubmitting(false);
    };

    const renderFilterNames = !!validFilters.length && (
        <Box className={classes.filterNames}>
            {validFilters.map(({ name, value }, i) => (
                <Chip className={classes.chip} key={i} label={value} onDelete={handleDeleteFilter(name)} />
            ))}
        </Box>
    );

    const renderCourseNameField = !isMobileOrTablet && (
        <Field name="courseName" label={t('forms:courseName')} component={TextFormField} />
    );

    const renderCourseCodeField = <Field name="courseCode" label={t('forms:courseCode')} component={TextFormField} />;

    const renderSubjectField = (
        <Field
            name="subject"
            label={t('forms:subject')}
            dataKey="subjects"
            document={SubjectsDocument}
            component={AutoCompleteField}
        />
    );

    const renderSchoolField = (
        <Field
            name="school"
            label={t('forms:school')}
            dataKey="schools"
            document={SchoolsDocument}
            component={AutoCompleteField}
        />
    );

    const renderSchoolTypeField = (
        <Field
            name="schoolType"
            label={t('forms:schoolType')}
            dataKey="schoolTypes"
            document={SchoolTypesDocument}
            component={AutoCompleteField}
        />
    );

    const renderCityField = (
        <Field
            name="city"
            label={t('forms:city')}
            dataKey="cities"
            document={CitiesDocument}
            component={AutoCompleteField}
        />
    );

    const renderCountryField = (
        <Field
            name="country"
            label={t('forms:country')}
            dataKey="countries"
            document={CountriesDocument}
            component={AutoCompleteField}
        />
    );

    const renderOrderingField = (
        <Field
            name="ordering"
            label={t('forms:ordering')}
            component={NativeSelectField}
            className="Mui-InputLabel-shrink" // We want the label to be always shrinked.
        >
            <option value="best">{t('forms:bestOrdering')}</option>
            <option value="score">{t('forms:scoreOrdering')}</option>
            <option value="name">{t('forms:nameOrdering')}</option>
            <option value="-name">{t('forms:nameOrderingReverse')}</option>
        </Field>
    );

    const renderFormSubmitSection = (props: FormikProps<FilterSearchResultsFormValues>): JSX.Element => (
        <FormSubmitSection submitButtonText={t('common:apply')} {...props} />
    );

    const renderClearButton = (props: FormikProps<FilterSearchResultsFormValues>): JSX.Element | false =>
        !isMobileOrTablet && (
            <FormControl>
                <Button
                    onClick={handleClearFilters}
                    variant="outlined"
                    color="primary"
                    endIcon={<ClearAllOutlined />}
                    disabled={props.isSubmitting}
                    fullWidth
                >
                    {t('common:clear')}
                </Button>
            </FormControl>
        );

    const renderSearchFormContent = (props: FormikProps<FilterSearchResultsFormValues>): JSX.Element => (
        <Form>
            {renderCourseNameField}
            {renderCourseCodeField}
            {renderSubjectField}
            {renderSchoolField}
            {renderSchoolTypeField}
            {renderCityField}
            {renderCountryField}
            {renderOrderingField}
            {renderFormSubmitSection(props)}
            {renderClearButton(props)}
        </Form>
    );

    const renderFilterResultsForm = (
        <DialogContent>
            <Formik onSubmit={handlePreSubmit} initialValues={initialValues} ref={ref}>
                {renderSearchFormContent}
            </Formik>
        </DialogContent>
    );

    const tableHeadProps = {
        titleLeft: t('common:name'),
        titleRight: t('common:score'),
    };

    const notFoundLinkProps = {
        href: urls.createCourse,
        text: t('search:noCoursesLink'),
    };

    const renderResults = !!courseObjects.length ? (
        <PaginatedTable
            count={count}
            tableHeadProps={tableHeadProps}
            renderTableBody={<CourseTableBody courses={courseObjects} />}
            extraFilters={initialValues}
        />
    ) : (
        <NotFoundBox text={t('search:noCourses')} linkProps={notFoundLinkProps} />
    );

    const renderClearFiltersButton = (
        <IconButton onClick={handleClearFilters}>
            <ClearAllOutlined />
        </IconButton>
    );

    const renderDialogHeader = (
        <DialogHeader onCancel={handleCloseFilters} text={t('common:filters')} headerRight={renderClearFiltersButton} />
    );

    const renderFilterResultsDrawer = (
        <Dialog
            open={filtersOpen}
            onClose={handleCloseFilters}
            fullScreen={isMobileOrTablet}
            fullWidth={isDesktop}
            TransitionComponent={Transition}
        >
            {renderDialogHeader}
            {renderFilterResultsForm}
        </Dialog>
    );

    const renderMobileContent = isMobileOrTablet && (
        <Grid container direction="column" className={classes.container}>
            {renderFilterNames}
            {renderResults}
            {renderFilterResultsDrawer}
        </Grid>
    );

    const renderFilterResultsHeader = <CardHeader title={t('common:filters')} />;
    const renderResultsHeader = <CardHeader title={t('common:searchResults')} />;

    const renderDesktopContent = !isMobileOrTablet && (
        <Grid container spacing={2} className={classes.rootContainer}>
            <Grid item container xs={5} md={4} lg={3}>
                <Paper className={clsx('paper-container', classes.container)}>
                    {renderFilterResultsHeader}
                    {renderFilterResultsForm}
                </Paper>
            </Grid>
            <Grid item container xs={7} md={8} lg={9}>
                <Paper className={clsx('paper-container', classes.container)}>
                    {renderResultsHeader}
                    {renderFilterNames}
                    {renderResults}
                </Paper>
            </Grid>
        </Grid>
    );

    const renderSearchNavbarStartAdornment = !!searchValue ? (
        <IconButton onClick={handleClearSearchInput} color="primary" size="small" disabled={searchInputSubmitting}>
            <ArrowBackOutlined />
        </IconButton>
    ) : (
        <IconButton onClick={handleSearchIconClick} color="primary" size="small" disabled={searchInputSubmitting}>
            <SearchOutlined />
        </IconButton>
    );

    // Loading spinner container has exact same padding as the icon button.
    const renderSearchNavbarEndAdornment = searchInputSubmitting ? (
        <Box padding={spacing(2)}>
            <CircularProgress color="primary" size={20} />
        </Box>
    ) : (
        <IconButton onClick={handleOpenFilters} size="small" color="primary">
            <FilterListOutlined />
        </IconButton>
    );

    const customTopNavbar = (
        <AppBar className={classes.topNavbar}>
            <Box className={classes.searchContainer}>
                <form onSubmit={handleSubmitSearchInput}>
                    <InputBase
                        classes={{ input: classes.searchInputBaseInput }}
                        placeholder={t('forms:searchCourses')}
                        value={searchValue}
                        onChange={onSearchChange}
                        startAdornment={renderSearchNavbarStartAdornment}
                        endAdornment={renderSearchNavbarEndAdornment}
                        disabled={searchInputSubmitting}
                        fullWidth
                    />
                </form>
            </Box>
        </AppBar>
    );

    const seoProps = {
        title: t('search:title'),
        description: t('search:description'),
    };

    const layoutProps = {
        seoProps,
        customTopNavbar,
        topNavbarProps: {
            disableSearch: true,
        },
    };

    if (loading || authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    if ((!!error && !!error.networkError) || authNetworkError) {
        return <OfflineLayout seoProps={seoProps} />;
    } else if (!!error) {
        return <ErrorLayout seoProps={seoProps} />;
    }

    return (
        <MainLayout {...layoutProps}>
            {renderMobileContent}
            {renderDesktopContent}
        </MainLayout>
    );
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['search']),
    },
});

export default withAuth(SearchPage);
