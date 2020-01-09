import * as R from 'ramda';

import { AutoCompleteField, FormSubmitSection, Layout, StyledCard, StyledForm, StyledTable } from '../components';
import {
    Box,
    Button,
    CardContent,
    CardHeader,
    FormControl,
    Grid,
    IconButton,
    SwipeableDrawer,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from '@material-ui/core';
import { Cancel, Clear, FilterList } from '@material-ui/icons';
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
import { getFullCourseName, useAuthSync, useDrawer, useForm } from '../utils';
import { withApollo, withRedux } from '../lib';

import { ParsedUrlQueryInput } from 'querystring';
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
    const { query, pathname } = useRouter();
    const { ref, setSubmitting, resetForm } = useForm<FilterSearchResultsFormValues>();
    const { t } = useTranslation();
    const { open, toggleDrawer, closeDrawer } = useDrawer();

    // Pick non-empty values and reload the page with new query params.
    const handleSubmit = async (values: FilterSearchResultsFormValues): Promise<void> => {
        const { courseName, courseCode, school, subject, schoolType, country, city } = values;

        const filteredValues = {
            courseName,
            courseCode,
            school: R.propOr('', 'id', school),
            subject: R.propOr('', 'id', subject),
            schoolType: R.propOr('', 'id', schoolType),
            country: R.propOr('', 'id', country),
            city: R.propOr('', 'id', city),
        };

        const query: ParsedUrlQueryInput = R.pickBy((val: string): boolean => !!val, filteredValues);
        await Router.push({ pathname, query });
        setSubmitting(false);
        closeDrawer();
    };

    // Clear the query params and reset form.
    const handleClearFilters = async (): Promise<void> => {
        await Router.push(pathname);
        resetForm();
        closeDrawer();
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
        <Formik onSubmit={handleSubmit} initialValues={initialValues} ref={ref}>
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
                    <FormSubmitSection submitButtonText={t('search:applyFiltersButton')} {...props} />
                    <FormControl fullWidth>
                        <Button
                            onClick={handleClearFilters}
                            variant="outlined"
                            color="primary"
                            endIcon={<Clear />}
                            fullWidth
                        >
                            {t('search:clearFiltersButton')}
                        </Button>
                    </FormControl>
                </StyledForm>
            )}
        </Formik>
    );

    const renderCourses =
        courses && courses.length ? (
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
        );

    const renderExitDrawerButton = (
        <IconButton onClick={toggleDrawer(false)}>
            <Cancel />
        </IconButton>
    );

    const renderMobileContent = (
        <Box className="md-down">
            <Box marginBottom="0.5rem">
                <StyledCard>
                    <CardHeader title={t('search:title')} />
                    <CardContent>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={toggleDrawer(true)}
                            endIcon={<FilterList />}
                            fullWidth
                        >
                            {t('search:filtersButton')}
                        </Button>
                    </CardContent>
                </StyledCard>
            </Box>
            <SwipeableDrawer anchor="bottom" open={open} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
                <StyledCard scrollable>
                    <CardHeader subheader={t('search:filtersSubHeader')} action={renderExitDrawerButton} />
                    <CardContent>{renderForm}</CardContent>
                </StyledCard>
            </SwipeableDrawer>
            <StyledTable>
                <Table>
                    <TableBody>{renderCourses}</TableBody>
                </Table>
            </StyledTable>
        </Box>
    );

    const renderDesktopContent = (
        <StyledCard className="md-up">
            <Grid container>
                <Grid item xs={5} md={4} lg={3}>
                    <CardHeader subheader={t('search:filtersSubHeader')} />
                    <CardContent>{renderForm}</CardContent>
                </Grid>
                <Grid item xs={7} md={8} lg={9}>
                    <CardHeader subheader={t('search:coursesSubHeader')} />
                    <CardContent>
                        <StyledTable disableBoxShadow>
                            <Table>
                                <TableBody>{renderCourses}</TableBody>
                            </Table>
                        </StyledTable>
                    </CardContent>
                </Grid>
            </Grid>
        </StyledCard>
    );

    return (
        <Layout title={t('search:title')} backUrl disableSearch>
            {renderMobileContent}
            {renderDesktopContent}
        </Layout>
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
