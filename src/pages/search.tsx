import * as R from 'ramda';

import {
    AutoCompleteField,
    FormSubmitSection,
    Layout,
    SlimCardContent,
    StyledCard,
    StyledForm,
    StyledTable,
} from '../components';
import { Box, Button, CardHeader, Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import {
    CitiesDocument,
    CountriesDocument,
    CourseType,
    SchoolTypesDocument,
    SchoolsDocument,
    SearchDocument,
    SubjectsDocument,
} from '../../generated/graphql';
import { Field, Formik, FormikProps } from 'formik';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { Router, includeDefaultNamespaces } from '../i18n';
import { getFullCourseName, useAuthSync, useForm } from '../utils';
import { withApollo, withRedux } from '../lib';

import { ParsedUrlQueryInput } from 'querystring';
import React from 'react';
import { TextField } from 'formik-material-ui';
import { compose } from 'redux';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

interface Props {
    courses?: CourseType[];
}

export interface FilterSearchResultsFormValues {
    courseName: string;
    courseCode: string;
    schoolName: string;
    subjectName: string;
    schoolType: string;
    countryName: string;
    cityName: string;
}

const SearchPage: I18nPage<Props> = ({ courses }) => {
    const { query, pathname } = useRouter();
    const { ref, setSubmitting, resetForm } = useForm<FilterSearchResultsFormValues>();
    const { t } = useTranslation();

    // Pick non-empty values and reload the page with new query params.
    const handleSubmit = async (values: FilterSearchResultsFormValues): Promise<void> => {
        const { courseName, courseCode, schoolName, subjectName, schoolType, countryName, cityName } = values;

        const filteredValues = {
            courseName,
            courseCode,
            schoolName,
            subjectName,
            schoolType,
            countryName,
            cityName,
        };

        const query: ParsedUrlQueryInput = R.pickBy((val: string): boolean => !!val, filteredValues);
        await Router.push({ pathname, query });
        setSubmitting(false);
    };

    // Clear the query params and reset form.
    const handleClearFilters = async (): Promise<void> => {
        await Router.push(pathname);
        resetForm();
    };

    const courseName = R.propOr('', 'courseName', query) as string;
    const courseCode = R.propOr('', 'courseCode', query) as string;
    const schoolName = R.propOr('', 'schoolName', query) as string;
    const subjectName = R.propOr('', 'subjectName', query) as string;
    const schoolType = R.propOr('', 'schoolType', query) as string;
    const countryName = R.propOr('', 'countryName', query) as string;
    const cityName = R.propOr('', 'cityName', query) as string;

    // Pre-load query params to the form.
    const initialValues = {
        courseName,
        courseCode,
        schoolName,
        subjectName,
        schoolType,
        countryName,
        cityName,
    };

    const renderForm = (props: FormikProps<FilterSearchResultsFormValues>): JSX.Element => (
        <StyledForm>
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
                name="schoolName"
                label={t('forms:school')}
                placeholder={t('forms:school')}
                dataKey="schools"
                document={SchoolsDocument}
                component={AutoCompleteField}
            />
            <Field
                name="subjectName"
                label={t('forms:subject')}
                placeholder={t('forms:subject')}
                dataKey="subjects"
                document={SubjectsDocument}
                component={AutoCompleteField}
            />
            <Field
                name="schoolType"
                label={t('forms:schoolType')}
                placeholder={t('forms:schoolType')}
                dataKey="schoolTypes"
                document={SchoolTypesDocument}
                component={AutoCompleteField}
            />
            <Field
                name="countryName"
                label={t('forms:country')}
                placeholder={t('forms:country')}
                dataKey="countries"
                document={CountriesDocument}
                component={AutoCompleteField}
            />
            <Field
                name="cityName"
                label={t('forms:city')}
                placeholder={t('forms:city')}
                dataKey="cities"
                document={CitiesDocument}
                component={AutoCompleteField}
            />
            <SlimCardContent>
                <FormSubmitSection submitButtonText={t('search:applyFiltersButton')} {...props} />
                <Button onClick={handleClearFilters} variant="outlined" color="primary" fullWidth>
                    {t('search:clearFiltersButton')}
                </Button>
            </SlimCardContent>
        </StyledForm>
    );

    return (
        <Layout title={t('search:title')} backUrl disableSearch>
            <Box marginBottom="0.5rem">
                <StyledCard>
                    <CardHeader title={t('search:title')} />
                    <SlimCardContent>
                        <Formik onSubmit={handleSubmit} initialValues={initialValues} ref={ref}>
                            {renderForm}
                        </Formik>
                    </SlimCardContent>
                </StyledCard>
            </Box>
            <StyledTable>
                <Table>
                    <TableBody>
                        {courses && courses.length ? (
                            courses.map((c: CourseType, i: number) => (
                                <TableRow key={i} onClick={(): Promise<boolean> => Router.push(`/courses/${c.id}`)}>
                                    <TableCell>
                                        <Typography variant="subtitle1">{getFullCourseName(c)}</Typography>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle1">{t('search:noCourses')}</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </StyledTable>
        </Layout>
    );
};

SearchPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    const { apolloClient, query } = ctx;

    try {
        const { data } = await apolloClient.query({
            query: SearchDocument,
            variables: { ...query },
        });

        return { ...data, namespacesRequired: includeDefaultNamespaces(['search']) };
    } catch {
        return { namespacesRequired: includeDefaultNamespaces(['search']) };
    }
};

export default compose(withApollo, withRedux)(SearchPage);
