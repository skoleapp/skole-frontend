import * as R from 'ramda';

import {
    Box,
    Button,
    CardHeader,
    FormControl,
    InputLabel,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from '@material-ui/core';
import {
    CityType,
    CountryType,
    CourseType,
    SchoolType,
    SchoolTypeObjectType,
    SearchDocument,
    SubjectType,
} from '../../generated/graphql';
import { Field, Formik, FormikProps } from 'formik';
import { FormSubmitSection, Layout, SlimCardContent, StyledCard, StyledForm, StyledTable } from '../components';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { Router, includeDefaultNamespaces } from '../i18n';
import { Select, TextField } from 'formik-material-ui';
import { getFullCourseName, useAuthSync, useForm } from '../utils';
import { withApollo, withRedux } from '../lib';

import { ParsedUrlQueryInput } from 'querystring';
import React from 'react';
import { compose } from 'redux';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

interface Props {
    courses?: CourseType[];
    schools?: SchoolType[];
    subjects?: SubjectType[];
    schoolTypes?: SchoolTypeObjectType[];
    countries?: CountryType[];
    cities?: CityType[];
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

const SearchPage: I18nPage<Props> = ({ courses, schools, subjects, schoolTypes, countries, cities }) => {
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
                component={TextField}
                label={t('forms:courseName')}
                placeholder={t('forms:courseName')}
                fullWidth
            />
            <Field
                name="courseCode"
                component={TextField}
                label={t('forms:courseCode')}
                placeholder={t('forms:courseCode')}
                fullWidth
            />
            <FormControl fullWidth>
                <InputLabel>{t('forms:school')}</InputLabel>
                <Field component={Select} name="schoolName" fullWidth>
                    <MenuItem value="">---</MenuItem>
                    {schools &&
                        schools.map((s: SchoolType, i: number) => (
                            <MenuItem key={i} value={s.name}>
                                {s.name}
                            </MenuItem>
                        ))}
                </Field>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>{t('forms:subject')}</InputLabel>
                <Field component={Select} name="subjectName" fullWidth>
                    <MenuItem value="">---</MenuItem>
                    {subjects &&
                        subjects.map((s: SubjectType, i: number) => (
                            <MenuItem key={i} value={s.name}>
                                {s.name}
                            </MenuItem>
                        ))}
                </Field>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>{t('forms:schoolType')}</InputLabel>
                <Field component={Select} name="schoolType" fullWidth>
                    <MenuItem value="">---</MenuItem>
                    {schoolTypes &&
                        schoolTypes.map((s: SchoolTypeObjectType, i: number) => (
                            <MenuItem key={i} value={s.name}>
                                {s.name}
                            </MenuItem>
                        ))}
                </Field>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>{t('forms:country')}</InputLabel>
                <Field component={Select} name="countryName" fullWidth>
                    <MenuItem value="">---</MenuItem>
                    {countries &&
                        countries.map((c: CountryType, i: number) => (
                            <MenuItem key={i} value={c.name}>
                                {c.name}
                            </MenuItem>
                        ))}
                </Field>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>{t('forms:city')}</InputLabel>
                <Field component={Select} name="cityName" fullWidth>
                    <MenuItem value="">---</MenuItem>
                    {cities &&
                        cities.map((c: CityType, i: number) => (
                            <MenuItem key={i} value={c.name}>
                                {c.name}
                            </MenuItem>
                        ))}
                </Field>
            </FormControl>
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

        return { ...data, namespacesRequired: includeDefaultNamespaces(['search', 'forms']) };
    } catch {
        return { namespacesRequired: includeDefaultNamespaces(['search', 'forms']) };
    }
};

export default compose(withApollo, withRedux)(SearchPage);
