import {
    Box,
    Button,
    CardContent,
    CardHeader,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputBase,
} from '@material-ui/core';
import { ArrowBackOutlined, ClearAllOutlined, FilterListOutlined, SearchOutlined } from '@material-ui/icons';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDeviceContext } from 'src/context';
import styled from 'styled-components';

import {
    CitiesDocument,
    CityObjectType,
    CountriesDocument,
    CountryObjectType,
    CourseObjectType,
    PaginatedCourseObjectType,
    SchoolObjectType,
    SchoolsDocument,
    SchoolTypeObjectType,
    SchoolTypesDocument,
    SearchCoursesDocument,
    SubjectObjectType,
    SubjectsDocument,
} from '../../generated/graphql';
import {
    AutoCompleteField,
    CourseTableBody,
    FormSubmitSection,
    MainLayout,
    ModalHeader,
    NativeSelectField,
    NotFoundBox,
    PaginatedTable,
    StyledCard,
    StyledDrawer,
    StyledTable,
} from '../components';
import { includeDefaultNamespaces, Router } from '../i18n';
import { withApolloSSR, withAuthSync } from '../lib';
import { I18nProps, SkolePageContext, UseDrawer } from '../types';
import { getPaginationQuery, getQueryWithPagination, useDrawer, useForm } from '../utils';

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

interface Props extends I18nProps {
    searchCourses?: PaginatedCourseObjectType;
    school?: SchoolObjectType;
    subject?: SubjectObjectType;
    schoolType?: SchoolTypeObjectType;
    country?: CountryObjectType;
    city?: CityObjectType;
}

const SearchPage: NextPage<Props> = ({ searchCourses, school, subject, schoolType, country, city }) => {
    const { t } = useTranslation();
    const { ref, resetForm, setSubmitting } = useForm<FilterSearchResultsFormValues>();
    const { onClose: handleCloseFilters, handleOpen: handleOpenFilters, ...fullDrawerProps } = useDrawer();
    const drawerProps = R.omit(['renderHeader'], fullDrawerProps) as Omit<UseDrawer, 'renderHeader'>;
    const { pathname, query } = useRouter();
    const isMobile = useDeviceContext();
    const courseObjects = R.propOr([], 'objects', searchCourses) as CourseObjectType[];
    const count = R.propOr(0, 'count', searchCourses) as number;
    const [searchValue, setSearchValue] = useState(query.courseName || '');
    const onSearchChange = (e: ChangeEvent<HTMLInputElement>): void => setSearchValue(e.target.value);

    // Pick non-empty values and reload the page with new query params.
    const handleSubmitFilters = async (filteredValues: {}): Promise<void> => {
        const validQuery: ParsedUrlQueryInput = R.pickBy((val: string): boolean => !!val, filteredValues);
        await Router.push({ pathname, query: validQuery });
        setSubmitting(false);
        const fakeEvent = (new Event('Fake event!') as unknown) as SyntheticEvent;
        handleCloseFilters(fakeEvent);
    };

    // Clear the query params and reset form.
    const handleClearFilters = async (e: SyntheticEvent): Promise<void> => {
        const paginationQuery = getPaginationQuery(query);
        await Router.push({ pathname, query: paginationQuery });
        resetForm();
        handleCloseFilters(e);
    };

    // Pre-load query params to the form.
    const initialValues = {
        courseName: R.propOr('', 'courseName', query) as string,
        courseCode: R.propOr('', 'courseCode', query) as string,
        school: school || null,
        subject: subject || null,
        schoolType: schoolType || null,
        country: country || null,
        city: city || null,
        ordering: R.propOr('', 'ordering', query) as string,
    };

    const queryWithPagination = getQueryWithPagination({ query, extraFilters: initialValues });
    const paginationQuery = getPaginationQuery(query);

    const handleSearchIconClick = (): void => {
        const input = document.getElementById('search-navbar-input-base');
        !!input && input.focus();
    };

    const handleSearchInputUnFocus = async (): Promise<void> => {
        setSearchValue('');
        await Router.push({ pathname, query: { ...paginationQuery } });
    };

    const handleSubmitSearchInput = (e: SyntheticEvent): void => {
        e.preventDefault();
        Router.push({ pathname, query: { ...paginationQuery, courseName: searchValue } });
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

    const renderCardContent = (
        <Formik onSubmit={handlePreSubmit} initialValues={initialValues} ref={ref}>
            {(props): JSX.Element => (
                <Form>
                    {!isMobile && (
                        <Field
                            name="courseName"
                            label={t('forms:courseName')}
                            placeholder={t('forms:courseName')}
                            variant="outlined"
                            component={TextField}
                            fullWidth
                        />
                    )}
                    <Field
                        name="courseCode"
                        label={t('forms:courseCode')}
                        placeholder={t('forms:courseCode')}
                        variant="outlined"
                        component={TextField}
                        fullWidth
                    />
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
                    <Field name="ordering" label={t('forms:ordering')} component={NativeSelectField} fullWidth>
                        <option value="name">{t('forms:nameOrdering')}</option>
                        <option value="-name">{t('forms:nameOrderingReverse')}</option>
                        <option value="score">{t('forms:scoreOrdering')}</option>
                        <option value="-score">{t('forms:scoreOrderingReverse')}</option>
                    </Field>
                    <FormSubmitSection submitButtonText={t('common:apply')} {...props} />
                    {!isMobile && (
                        <FormControl fullWidth>
                            <Button
                                onClick={handleClearFilters}
                                variant="outlined"
                                color="primary"
                                endIcon={<ClearAllOutlined />}
                                fullWidth
                            >
                                {t('common:clear')}
                            </Button>
                        </FormControl>
                    )}
                </Form>
            )}
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
        <Box flexGrow="1" display="flex">
            <StyledTable>{renderTableContent}</StyledTable>
            <StyledDrawer fullHeight {...drawerProps}>
                <ModalHeader
                    onCancel={handleCloseFilters}
                    text={t('common:filters')}
                    headerRight={renderMobileClearFiltersButton}
                />
                <CardContent>{renderCardContent}</CardContent>
            </StyledDrawer>
        </Box>
    );

    const renderDesktopContent = !isMobile && (
        <Grid container>
            <Grid item container xs={5} md={4} lg={3}>
                <StyledCard>
                    <CardHeader title={t('common:filters')} />
                    <Divider />
                    <CardContent>{renderCardContent}</CardContent>
                </StyledCard>
            </Grid>
            <Grid item container xs={7} md={8} lg={9}>
                <StyledCard marginLeft>
                    <CardHeader title={t('common:searchResults')} />
                    <Divider />
                    <StyledTable>{renderTableContent}</StyledTable>
                </StyledCard>
            </Grid>
        </Grid>
    );

    const customTopNavbar = (
        <Box id="search-navbar">
            <form onSubmit={handleSubmitSearchInput}>
                <Box display="flex" justifyContent="center">
                    <Box id="search-navbar-input">
                        {!!searchValue ? (
                            <IconButton onClick={handleSearchInputUnFocus} color="primary">
                                <ArrowBackOutlined />
                            </IconButton>
                        ) : (
                            <IconButton onClick={handleSearchIconClick}>
                                <SearchOutlined color="primary" />
                            </IconButton>
                        )}
                        <InputBase
                            placeholder={t('forms:searchCourses')}
                            id="search-navbar-input-base"
                            onBlur={handleSearchInputUnFocus}
                            value={searchValue}
                            onChange={onSearchChange}
                        />
                    </Box>
                    <IconButton onClick={handleOpenFilters} color="primary">
                        <FilterListOutlined />
                    </IconButton>
                </Box>
            </form>
        </Box>
    );

    const layoutProps = {
        seoProps: {
            title: t('search:title'),
            description: t('search:description'),
        },
        topNavbarProps: {
            disableSearch: true,
        },
        customTopNavbar,
    };

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

        #search-navbar-input {
            display: flex;
            align-items: center;
            width: 100%;

            .MuiInputBase-root {
                flex-grow: 1;

                input {
                    padding: 0.75rem;
                }
            }
        }
    }
`;

export const getServerSideProps: GetServerSideProps = withApolloSSR(async ctx => {
    const { apolloClient, query } = ctx as SkolePageContext;
    const namespaces = { namespacesRequired: includeDefaultNamespaces(['search']) };

    try {
        const { data } = await apolloClient.query({
            query: SearchCoursesDocument,
            variables: query,
        });

        return { props: { ...data, ...namespaces } };
    } catch (err) {
        return { props: { namespaces } };
    }
});

export default withAuthSync(SearchPage);
