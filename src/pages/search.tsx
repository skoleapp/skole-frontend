import {
    Box,
    Button,
    CardContent,
    Chip,
    CircularProgress,
    FormControl,
    Grid,
    IconButton,
    InputBase,
    Typography,
} from '@material-ui/core';
import { ArrowBackOutlined, ClearAllOutlined, FilterListOutlined, SearchOutlined } from '@material-ui/icons';
import {
    AutoCompleteField,
    CourseTableBody,
    ErrorLayout,
    FormSubmitSection,
    LoadingLayout,
    MainLayout,
    ModalHeader,
    NativeSelectField,
    NotFoundBox,
    OfflineLayout,
    PaginatedTable,
    StyledCard,
    StyledDrawer,
    StyledTable,
} from 'components';
import { useDeviceContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
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
import { useDrawer, useForm } from 'hooks';
import { includeDefaultNamespaces, useTranslation, withAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import styled from 'styled-components';
import { AuthProps, UseDrawer } from 'types';
import { getPaginationQuery, getQueryWithPagination, redirect } from 'utils';

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
    const { t } = useTranslation();
    const { ref, resetForm, setSubmitting } = useForm<FilterSearchResultsFormValues>();
    const { pathname, query } = useRouter();
    const isMobile = useDeviceContext();
    const { onClose: handleCloseFilters, handleOpen: handleOpenFilters, ...fullDrawerProps } = useDrawer();
    const drawerProps = R.omit(['renderHeader'], fullDrawerProps) as Omit<UseDrawer, 'renderHeader'>;
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
        const fakeEvent = (new Event('Fake event!') as unknown) as SyntheticEvent;
        handleCloseFilters(fakeEvent);
    };

    // Clear the query params and reset form.
    const handleClearFilters = async (e: SyntheticEvent): Promise<void> => {
        const paginationQuery = getPaginationQuery(query);
        await redirect({ pathname, query: paginationQuery });
        resetForm();
        setSearchValue('');
        handleCloseFilters(e);
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

    const queryWithPagination = getQueryWithPagination({ query, extraFilters: initialValues });
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
        <Box id="filter-names" className="border-bottom">
            {validFilters.map(({ name, value }, i) => (
                <Chip key={i} label={value} onDelete={handleDeleteFilter(name)} />
            ))}
        </Box>
    );

    const renderCourseNameField = !isMobile && (
        <Field
            name="courseName"
            label={t('forms:courseName')}
            placeholder={t('forms:courseName')}
            variant="outlined"
            component={TextField}
            fullWidth
            autoComplete="off"
        />
    );

    const renderCourseCodeField = (
        <Field
            name="courseCode"
            label={t('forms:courseCode')}
            placeholder={t('forms:courseCode')}
            variant="outlined"
            component={TextField}
            fullWidth
            autoComplete="off"
        />
    );

    const renderSubjectField = (
        <Field
            name="subject"
            label={t('forms:subject')}
            placeholder={t('forms:subject')}
            dataKey="subjects"
            document={SubjectsDocument}
            component={AutoCompleteField}
            variant="outlined"
            fullWidth
        />
    );

    const renderSchoolField = (
        <Field
            name="school"
            label={t('forms:school')}
            placeholder={t('forms:school')}
            dataKey="schools"
            document={SchoolsDocument}
            component={AutoCompleteField}
            variant="outlined"
            fullWidth
        />
    );

    const renderSchoolTypeField = (
        <Field
            name="schoolType"
            label={t('forms:schoolType')}
            placeholder={t('forms:schoolType')}
            dataKey="schoolTypes"
            document={SchoolTypesDocument}
            component={AutoCompleteField}
            variant="outlined"
            fullWidth
        />
    );

    const renderCityField = (
        <Field
            name="city"
            label={t('forms:city')}
            placeholder={t('forms:city')}
            dataKey="cities"
            document={CitiesDocument}
            component={AutoCompleteField}
            variant="outlined"
            fullWidth
        />
    );

    const renderCountryField = (
        <Field
            name="country"
            label={t('forms:country')}
            placeholder={t('forms:country')}
            dataKey="countries"
            document={CountriesDocument}
            component={AutoCompleteField}
            variant="outlined"
            fullWidth
        />
    );

    const renderOrderingField = (
        <Field name="ordering" label={t('forms:ordering')} component={NativeSelectField} fullWidth>
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
        !isMobile && (
            <FormControl fullWidth>
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

    const renderFilterSearchResultsForm = (
        <Formik onSubmit={handlePreSubmit} initialValues={initialValues} ref={ref}>
            {renderSearchFormContent}
        </Formik>
    );

    const tableHeadProps = {
        titleLeft: t('common:name'),
        titleRight: t('common:score'),
    };

    const renderTableContent = !!courseObjects.length ? (
        <PaginatedTable
            count={count}
            tableHeadProps={tableHeadProps}
            renderTableBody={<CourseTableBody courses={courseObjects} />}
            extraFilters={initialValues}
        />
    ) : (
        <NotFoundBox text={t('search:noCourses')} />
    );

    const renderMobileClearFiltersButton = (
        <IconButton onClick={handleClearFilters}>
            <ClearAllOutlined />
        </IconButton>
    );

    const renderMobileContent = isMobile && (
        <Box flexGrow="1" display="flex" flexDirection="column">
            {renderFilterNames}
            <StyledTable>{renderTableContent}</StyledTable>
            <StyledDrawer fullHeight {...drawerProps}>
                <ModalHeader
                    onCancel={handleCloseFilters}
                    text={t('common:filters')}
                    headerRight={renderMobileClearFiltersButton}
                />
                <CardContent>{renderFilterSearchResultsForm}</CardContent>
            </StyledDrawer>
        </Box>
    );

    const renderFiltersHeader = <Typography variant="subtitle1">{t('common:filters')}</Typography>;
    const renderSearchResultsHeader = <Typography variant="subtitle1">{t('common:searchResults')}</Typography>;

    const renderDesktopContent = !isMobile && (
        <Grid container>
            <Grid item container xs={5} md={4} lg={3}>
                <StyledCard>
                    <Box className="custom-header" display="flex" alignItems="center">
                        {renderFiltersHeader}
                    </Box>
                    <CardContent>{renderFilterSearchResultsForm}</CardContent>
                </StyledCard>
            </Grid>
            <Grid item container xs={7} md={8} lg={9}>
                <StyledCard marginLeft>
                    <Box className="custom-header" display="flex" alignItems="center">
                        {renderSearchResultsHeader}
                    </Box>
                    {renderFilterNames}
                    <StyledTable>{renderTableContent}</StyledTable>
                </StyledCard>
            </Grid>
        </Grid>
    );

    const renderSearchNavbarStartAdornment = !!searchValue ? (
        <IconButton onClick={handleClearSearchInput} color="primary" disabled={searchInputSubmitting}>
            <ArrowBackOutlined />
        </IconButton>
    ) : (
        <IconButton onClick={handleSearchIconClick} color="primary" disabled={searchInputSubmitting}>
            <SearchOutlined />
        </IconButton>
    );

    // Loading spinner container has exact same padding as IconButton.
    const renderSearchNavbarEndAdornment = searchInputSubmitting ? (
        <Box padding="12px">
            <CircularProgress color="primary" size={20} />
        </Box>
    ) : (
        <IconButton onClick={handleOpenFilters} color="primary">
            <FilterListOutlined />
        </IconButton>
    );

    const customTopNavbar = (
        <Box id="search-navbar">
            <form onSubmit={handleSubmitSearchInput}>
                <InputBase
                    placeholder={t('forms:searchCourses')}
                    id="search-navbar-input-base"
                    value={searchValue}
                    onChange={onSearchChange}
                    startAdornment={renderSearchNavbarStartAdornment}
                    endAdornment={renderSearchNavbarEndAdornment}
                    disabled={searchInputSubmitting}
                    autoComplete="off"
                    fullWidth
                />
            </form>
        </Box>
    );

    const seoProps = {
        title: t('search:title'),
        description: t('search:description'),
    };

    const layoutProps = {
        seoProps,
        topNavbarProps: {
            disableSearch: true,
        },
        customTopNavbar,
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
        <StyledSearchPage>
            <MainLayout {...layoutProps}>
                {renderMobileContent}
                {renderDesktopContent}
            </MainLayout>
        </StyledSearchPage>
    );
};

const StyledSearchPage = styled(Box)`
    .MuiGrid-root {
        flex-grow: 1;
    }

    #search-navbar {
        background-color: var(--white);
    }

    #filter-names {
        background-color: var(--white);
        display: flex;
        flex-flow: row wrap;
        padding-top: 0.25rem;
        padding-left: 0.25rem;

        .MuiChip-root {
            margin: 0 0.25rem 0.25rem 0;
        }
    }
`;

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['search']),
    },
});

export default withAuth(SearchPage);
