import { Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { Field, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';

import {
    CitiesDocument,
    CityType,
    CountriesDocument,
    CountryType,
    CourseType,
    SchoolsDocument,
    SchoolType,
    SchoolTypeObjectType,
    SchoolTypesDocument,
    SearchCoursesDocument,
    SubjectsDocument,
    SubjectType,
} from '../../generated/graphql';
import { AutoCompleteField, FilterLayout, FormSubmitSection, StyledForm } from '../components';
import { includeDefaultNamespaces, Router } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { getFullCourseName, useAuthSync, useFilters } from '../utils';

interface FilterSearchResultsFormValues {
    courseName: string;
    courseCode: string;
    school: SchoolType | null;
    subject: SubjectType | null;
    schoolType: SchoolTypeObjectType | null;
    country: CountryType | null;
    city: CityType | null;
}

interface Props {
    courses?: CourseType[];
    school?: SchoolType;
    subject?: SubjectType;
    schoolType?: SchoolTypeObjectType;
    country?: CountryType;
    city?: CityType;
}

const SearchPage: I18nPage<Props> = ({ courses, school, subject, schoolType, country, city }) => {
    const filterProps = useFilters<FilterSearchResultsFormValues>();
    const { handleSubmit, submitButtonText, renderClearFiltersButton, ref } = filterProps;
    const { query } = useRouter();
    const { t } = useTranslation();

    const handlePreSubmit = (values: FilterSearchResultsFormValues): void => {
        const { courseName, courseCode, school, subject, schoolType, country, city } = values;

        const filteredValues: FilterSearchResultsFormValues = {
            courseName,
            courseCode,
            school: R.propOr('', 'id', school),
            subject: R.propOr('', 'id', subject),
            schoolType: R.propOr('', 'id', schoolType),
            country: R.propOr('', 'id', country),
            city: R.propOr('', 'id', city),
        };

        handleSubmit(filteredValues);
    };

    // Pre-load query params to the form.
    const initialValues = {
        courseName: R.propOr('', 'courseName', query) as string,
        courseCode: R.propOr('', 'courseName', query) as string,
        school: school || null,
        subject: subject || null,
        schoolType: schoolType || null,
        country: country || null,
        city: city || null,
    };

    const renderCardContent = (
        <Formik onSubmit={handlePreSubmit} initialValues={initialValues} ref={ref}>
            {(props): JSX.Element => (
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
                    <FormSubmitSection submitButtonText={submitButtonText} {...props} />
                    {renderClearFiltersButton}
                </StyledForm>
            )}
        </Formik>
    );

    const renderTableContent = (
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
    );

    return (
        <FilterLayout<FilterSearchResultsFormValues>
            title={t('search:title')}
            renderCardContent={renderCardContent}
            renderTableContent={renderTableContent}
            backUrl
            {...filterProps}
        />
    );
};

SearchPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    const { apolloClient, query } = ctx;
    const nameSpaces = { namespacesRequired: includeDefaultNamespaces(['search']) };

    try {
        const { data } = await apolloClient.query({
            query: SearchCoursesDocument,
            variables: query,
        });

        return { ...data, ...nameSpaces };
    } catch {
        return nameSpaces;
    }
};

export default compose(withApollo, withRedux)(SearchPage);
