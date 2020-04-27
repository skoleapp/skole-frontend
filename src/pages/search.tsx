import { Box, CardContent, CardHeader, Divider, Drawer, Grid, IconButton, MenuItem } from '@material-ui/core';
import { ClearAllOutlined, FilterListOutlined } from '@material-ui/icons';
import { Field, Form, Formik, FormikActions } from 'formik';
import { TextField } from 'formik-material-ui';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
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
    NotFoundBox,
    PaginatedTable,
    SelectField,
    StyledCard,
    StyledTable,
} from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces } from '../i18n';
import { withApolloSSR, withAuthSync } from '../lib';
import { I18nProps, SkolePageContext } from '../types';
import { getPaginationQuery, useFilters } from '../utils';

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
    const {
        handleSubmit,
        submitButtonText,
        renderDesktopClearFiltersButton,
        ref,
        drawerProps,
        handleClearFilters,
    } = useFilters<FilterSearchResultsFormValues>();

    const { handleOpen, ...commonDrawerProps } = drawerProps;
    const { onClose: handleCloseDrawer } = drawerProps;
    const { query } = useRouter();
    const { t } = useTranslation();
    const isMobile = useDeviceContext();
    const courseObjects = R.propOr([], 'objects', searchCourses) as CourseObjectType[];
    const count = R.propOr(0, 'count', searchCourses) as number;

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

    const handlePreSubmit = <T extends FilterSearchResultsFormValues>(values: T, actions: FormikActions<T>): void => {
        const { courseName, courseCode, school, subject, schoolType, country, city, ordering } = values;
        const paginationQuery = getPaginationQuery({ query, extraFilters: initialValues });

        const filteredValues: FilterSearchResultsFormValues = {
            ...paginationQuery, // Define this first to override the values.
            courseName,
            courseCode,
            school: R.propOr('', 'id', school),
            subject: R.propOr('', 'id', subject),
            schoolType: R.propOr('', 'id', schoolType),
            country: R.propOr('', 'id', country),
            city: R.propOr('', 'id', city),
            ordering,
        };

        handleSubmit(filteredValues, actions);
    };

    const renderCardContent = (
        <Formik onSubmit={handlePreSubmit} initialValues={initialValues} ref={ref}>
            {(props): JSX.Element => (
                <Form>
                    <Field
                        name="courseName"
                        label={t('forms:courseName')}
                        placeholder={t('forms:courseName')}
                        variant="outlined"
                        component={TextField}
                        fullWidth
                    />
                    <Field
                        name="courseCode"
                        label={t('forms:courseCode')}
                        placeholder={t('forms:courseCode')}
                        variant="outlined"
                        component={TextField}
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
                        name="country"
                        label={t('forms:country')}
                        placeholder={t('forms:country')}
                        dataKey="countries"
                        document={CountriesDocument}
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
                    <Field name="ordering" label={t('forms:ordering')} component={SelectField} fullWidth>
                        <MenuItem value="name">{t('forms:nameOrdering')}</MenuItem>
                        <MenuItem value="-name">{t('forms:nameOrderingReverse')}</MenuItem>
                        <MenuItem value="score">{t('forms:scoreOrdering')}</MenuItem>
                        <MenuItem value="-score">{t('forms:scoreOrderingReverse')}</MenuItem>
                    </Field>
                    <FormSubmitSection submitButtonText={submitButtonText} {...props} />
                    {renderDesktopClearFiltersButton}
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

    const renderFiltersButton = (
        <IconButton onClick={handleOpen} color="secondary">
            <FilterListOutlined />
        </IconButton>
    );

    const renderMobileContent = isMobile && (
        <Box flexGrow="1" display="flex">
            <StyledTable>{renderTableContent}</StyledTable>
            <Drawer {...commonDrawerProps}>
                <ModalHeader
                    onCancel={handleCloseDrawer}
                    text={t('common:filters')}
                    headerRight={renderMobileClearFiltersButton}
                />
                <CardContent>{renderCardContent}</CardContent>
            </Drawer>
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

    const layoutProps = {
        seoProps: {
            title: t('search:title'),
            description: t('search:description'),
        },
        topNavbarProps: {
            header: t('search:header'),
            headerRight: renderFiltersButton,
            dynamicBackUrl: true,
            disableSearch: true,
        },
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
