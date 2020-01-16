import * as R from 'ramda';

import { AutoCompleteField, FormSubmitSection, MainLayout, StyledForm } from '../components';
import {
    CitiesDocument,
    CityType,
    CountriesDocument,
    CountryType,
    CourseType,
    SchoolType,
    SchoolTypeObjectType,
    SchoolTypesDocument,
    SchoolsDocument,
    SearchCoursesDocument,
    SubjectType,
    SubjectsDocument,
} from '../../generated/graphql';
import { Field, Formik } from 'formik';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { Router, includeDefaultNamespaces } from '../i18n';
import { Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { getFullCourseName, useAuthSync, useSearchLayout } from '../utils';
import { withApollo, withRedux } from '../lib';

import React from 'react';
import { TextField } from 'formik-material-ui';
import { compose } from 'redux';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

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
    const { query } = useRouter();
    const { t } = useTranslation();

    const {
        ref,
        handleSubmit,
        renderClearFiltersButton,
        renderMobileContent,
        renderDesktopContent,
        submitButtonText,
    } = useSearchLayout<FilterSearchResultsFormValues>();

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

    const renderForm = (
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

    const responsiveContentProps = {
        title: t('common:courses'),
        renderForm,
        renderTableContent,
    };

    return (
        <MainLayout title={t('search:title')} backUrl disableSearch>
            {renderMobileContent(responsiveContentProps)}
            {renderDesktopContent(responsiveContentProps)}
        </MainLayout>
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
