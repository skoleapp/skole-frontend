import {
  AppBar,
  Box,
  Button,
  CardHeader,
  Chip,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  InputBase,
  makeStyles,
  Paper,
} from '@material-ui/core';
import {
  ArrowBackOutlined,
  ClearAllOutlined,
  FilterListOutlined,
  SearchOutlined,
} from '@material-ui/icons';
import {
  AutocompleteField,
  CourseTableBody,
  DialogHeader,
  ErrorTemplate,
  FormSubmitSection,
  LoadingBox,
  MainTemplate,
  NativeSelectField,
  NotFoundBox,
  OfflineTemplate,
  PaginatedTable,
  ContactLink,
  SkoleDialog,
  TextFormField,
  BackButton,
} from 'components';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  AutocompleteCitiesDocument,
  AutocompleteCountriesDocument,
  AutocompleteSchoolsDocument,
  AutocompleteSchoolTypesDocument,
  AutocompleteSubjectsDocument,
  CityObjectType,
  CountryObjectType,
  SchoolObjectType,
  SchoolTypeObjectType,
  SubjectObjectType,
  useCoursesQuery,
} from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext, useMediaQueries, useOpen } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import { BORDER, BORDER_RADIUS, TOP_NAVBAR_HEIGHT_MOBILE } from 'theme';
import { getPaginationQuery, getQueryWithPagination, urls } from 'utils';

const useStyles = makeStyles(({ palette, spacing, breakpoints }) => ({
  rootContainer: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    paddingLeft: 'env(safe-area-inset-left)',
    paddingRight: 'env(safe-area-inset-right)',
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  topNavbar: {
    height: `calc(${TOP_NAVBAR_HEIGHT_MOBILE} + env(safe-area-inset-top))`,
    display: 'flex',
    justifyContent: 'flex-end',
    boxShadow: 'none',
    backgroundColor: palette.common.white,
    borderBottom: BORDER,
  },
  cardHeaderRoot: {
    borderBottom: BORDER,
    padding: spacing(3),
    position: 'relative',
    height: '3.5rem',
  },
  cardHeaderAvatar: {
    position: 'absolute',
    top: spacing(2),
    left: spacing(2),
  },
  searchContainer: {
    padding: spacing(1),
    minHeight: TOP_NAVBAR_HEIGHT_MOBILE,
  },
  searchInputBaseInput: {
    paddingLeft: spacing(2),
  },
  filterNames: {
    display: 'flex',
    flexFlow: 'row wrap',
    padding: spacing(2),
  },
  chip: {
    margin: spacing(1),
  },
  tableContainer: {
    flexGrow: 1,
    display: 'flex',
  },
  dialogContent: {
    padding: spacing(2),
  },
}));

interface SearchFormValues {
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

const SearchPage: NextPage = () => {
  const classes = useStyles();
  const { isMobile, isTabletOrDesktop } = useMediaQueries();
  const { t } = useTranslation();
  const { pathname, query } = useRouter();

  const variables = R.pick(
    [
      'courseName',
      'courseCode',
      'school',
      'subject',
      'schoolType',
      'country',
      'city',
      'ordering',
      'page',
      'pageSize',
    ],
    query,
  );

  const context = useLanguageHeaderContext();
  const { data, loading, error } = useCoursesQuery({ variables, context });
  const { formRef, resetForm } = useForm<SearchFormValues>();
  const courses = R.pathOr([], ['courses', 'objects'], data);
  const school = R.propOr(null, 'school', data);
  const subject = R.propOr(null, 'subject', data);
  const schoolType = R.propOr(null, 'schoolType', data);
  const country = R.propOr(null, 'country', data);
  const city = R.propOr(null, 'city', data);
  const count = R.pathOr(0, ['courses', 'count'], data);
  const courseName = R.propOr('', 'courseName', query);
  const courseCode = R.propOr('', 'courseCode', query);
  const ordering = R.propOr('', 'ordering', query);
  const [searchValue, setSearchValue] = useState(courseName);
  const schoolName = R.prop('name', school);
  const subjectName = R.prop('name', subject);
  const schoolTypeName = R.prop('name', schoolType);
  const countryName = R.prop('name', country);
  const cityName = R.prop('name', city);

  const {
    open: filtersOpen,
    handleOpen: handleOpenFilters,
    handleClose: handleCloseFilters,
  } = useOpen();

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

  const paginationQuery = getPaginationQuery(query); // Query that holds only pagination.

  // Query that holds pagination plus all search params.
  const queryWithPagination = getQueryWithPagination({
    query,
    extraFilters: initialValues,
  });

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>): void => setSearchValue(e.target.value);

  // Pick non-empty values and reload the page with new query params.
  const handleSubmitFilters = async (filteredValues: Record<symbol, unknown>): Promise<void> => {
    const validQuery = R.pickBy((val: string): boolean => !!val, filteredValues);
    resetForm();
    handleCloseFilters();
    await Router.push({ pathname, query: validQuery });
  };

  // Clear the query params and reset form.
  const handleClearFilters = async (): Promise<void> => {
    const paginationQuery = getPaginationQuery(query);
    resetForm();
    setSearchValue('');
    handleCloseFilters();
    await Router.push({ pathname, query: paginationQuery });
  };

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
      value: schoolName,
    },
    {
      name: 'subject',
      value: subjectName,
    },
    {
      name: 'schoolType',
      value: schoolTypeName,
    },
    {
      name: 'country',
      value: countryName,
    },
    {
      name: 'city',
      value: cityName,
    },
  ];

  const validFilters: ValidFilter[] = filtersArr.filter((f) => !!f.value);

  const handleSearchIconClick = (): void => {
    const input = document.getElementById('search-navbar-input-base');
    !!input && input.focus();
  };

  const handleClearSearchInput = async (): Promise<void> => {
    setSearchValue('');
    await Router.push({ pathname, query: { ...paginationQuery } });
  };

  const handleSubmitSearchInput = async (e: SyntheticEvent): Promise<void> => {
    e.preventDefault();
    await Router.push({
      pathname,
      query: { ...queryWithPagination, courseName: searchValue },
    });
  };

  const handlePreSubmit = async ({
    courseName,
    courseCode,
    school: _school,
    subject: _subject,
    schoolType: _schoolType,
    country: _country,
    city: _city,
    ordering,
  }: SearchFormValues): Promise<void> => {
    const school = R.propOr('', 'id', _school);
    const subject = R.propOr('', 'id', _subject);
    const schoolType = R.propOr('', 'id', _schoolType);
    const country = R.propOr('', 'id', _country);
    const city = R.propOr('', 'id', _city);

    const filteredValues = {
      ...queryWithPagination, // Define this first to override the values.
      courseName,
      courseCode,
      school,
      subject,
      schoolType,
      country,
      city,
      ordering,
    };

    await handleSubmitFilters(filteredValues);
  };

  const handleDeleteFilter = (filterName: string) => async (): Promise<void> => {
    const query = R.pickBy((_: string, key: string) => key !== filterName, queryWithPagination);

    filterName === 'courseName' && (await handleClearSearchInput());
    await Router.push({ pathname, query });
  };

  const renderFilterNames = !!validFilters.length && (
    <Box className={classes.filterNames}>
      {validFilters.map(({ name, value }, i) => (
        <Chip className={classes.chip} key={i} label={value} onDelete={handleDeleteFilter(name)} />
      ))}
    </Box>
  );

  const renderCourseNameField = isTabletOrDesktop && (
    <Field name="courseName" label={t('forms:courseName')} component={TextFormField} />
  );

  const renderCourseCodeField = (
    <Field name="courseCode" label={t('forms:courseCode')} component={TextFormField} />
  );

  const renderSubjectField = (
    <Field
      name="subject"
      label={t('forms:subject')}
      dataKey="autocompleteSubjects"
      searchKey="name"
      document={AutocompleteSubjectsDocument}
      component={AutocompleteField}
    />
  );

  const renderSchoolField = (
    <Field
      name="school"
      label={t('forms:school')}
      dataKey="autocompleteSchools"
      searchKey="name"
      document={AutocompleteSchoolsDocument}
      component={AutocompleteField}
    />
  );

  const renderSchoolTypeField = (
    <Field
      name="schoolType"
      label={t('forms:schoolType')}
      dataKey="autocompleteSchoolTypes"
      document={AutocompleteSchoolTypesDocument}
      component={AutocompleteField}
    />
  );

  const renderCityField = (
    <Field
      name="city"
      label={t('forms:city')}
      dataKey="autocompleteCities"
      document={AutocompleteCitiesDocument}
      component={AutocompleteField}
    />
  );

  const renderCountryField = (
    <Field
      name="country"
      label={t('forms:country')}
      dataKey="autocompleteCountries"
      document={AutocompleteCountriesDocument}
      component={AutocompleteField}
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

  const renderContactUsLink = <ContactLink />;

  const renderFormSubmitSection = (props: FormikProps<SearchFormValues>): JSX.Element => (
    <FormSubmitSection submitButtonText={t('common:apply')} {...props} />
  );

  const renderClearButton = (props: FormikProps<SearchFormValues>): JSX.Element | false =>
    isTabletOrDesktop && (
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

  const renderSearchFormFields = (props: FormikProps<SearchFormValues>): JSX.Element => (
    <Form>
      {renderCourseNameField}
      {renderCourseCodeField}
      {renderSubjectField}
      {renderSchoolField}
      {renderSchoolTypeField}
      {renderCityField}
      {renderCountryField}
      {renderOrderingField}
      {renderContactUsLink}
      {renderFormSubmitSection(props)}
      {renderClearButton(props)}
    </Form>
  );

  const renderFilterResultsForm = (
    <DialogContent className={classes.dialogContent}>
      <Formik
        onSubmit={handlePreSubmit}
        initialValues={initialValues}
        innerRef={formRef}
        enableReinitialize
      >
        {renderSearchFormFields}
      </Formik>
    </DialogContent>
  );

  const tableHeadProps = {
    titleLeft: t('common:course'),
    titleRight: t('common:score'),
  };

  const notFoundLinkProps = {
    href: urls.addCourse,
    text: t('search:noCoursesLink'),
  };

  const renderLoading = <LoadingBox />;
  const renderCourses = <CourseTableBody courses={courses} />;

  const renderTable = (
    <Box className={classes.tableContainer}>
      <PaginatedTable
        count={count}
        tableHeadProps={tableHeadProps}
        renderTableBody={renderCourses}
        extraFilters={initialValues}
      />
    </Box>
  );

  const renderNotFound = <NotFoundBox text={t('search:noCourses')} linkProps={notFoundLinkProps} />;
  const renderResults = loading ? renderLoading : courses.length ? renderTable : renderNotFound;

  const renderClearFiltersButton = (
    <IconButton onClick={handleClearFilters} size="small">
      <ClearAllOutlined />
    </IconButton>
  );

  const renderDialogHeader = (
    <DialogHeader
      onCancel={handleCloseFilters}
      text={t('common:filters')}
      headerLeft={renderClearFiltersButton}
    />
  );

  const renderFilterResultsDrawer = (
    <SkoleDialog open={filtersOpen} onClose={handleCloseFilters}>
      {renderDialogHeader}
      {renderFilterResultsForm}
    </SkoleDialog>
  );

  const renderMobileContent = isMobile && (
    <Paper className={classes.container}>
      {renderFilterNames}
      {renderResults}
      {renderFilterResultsDrawer}
    </Paper>
  );

  const renderBackButton = <BackButton onClick={() => Router.back()} />;

  const renderFilterResultsHeader = (
    <CardHeader
      classes={{ root: classes.cardHeaderRoot, avatar: classes.cardHeaderAvatar }}
      title={t('common:filters')}
      avatar={renderBackButton}
    />
  );

  const renderResultsHeader = (
    <CardHeader className={classes.cardHeaderRoot} title={t('common:searchResults')} />
  );

  const renderDesktopContent = isTabletOrDesktop && (
    <Grid container spacing={2} className={classes.rootContainer}>
      <Grid item container xs={12} md={4} lg={3}>
        <Paper className={classes.container}>
          {renderFilterResultsHeader}
          {renderFilterResultsForm}
        </Paper>
      </Grid>
      <Grid item container xs={12} md={8} lg={9}>
        <Paper className={classes.container}>
          {renderResultsHeader}
          {renderFilterNames}
          {renderResults}
        </Paper>
      </Grid>
    </Grid>
  );

  const renderSearchNavbarStartAdornment = searchValue ? (
    <IconButton onClick={handleClearSearchInput} color="primary" size="small">
      <ArrowBackOutlined />
    </IconButton>
  ) : (
    <IconButton onClick={handleSearchIconClick} color="primary" size="small">
      <SearchOutlined />
    </IconButton>
  );

  const renderSearchNavbarEndAdornment = (
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
            fullWidth
          />
        </form>
      </Box>
    </AppBar>
  );

  const layoutProps = {
    seoProps: {
      title: t('search:title'),
      description: t('search:description'),
    },
    customTopNavbar,
    topNavbarProps: {
      hideSearch: true,
    },
  };

  if (!!error && !!error.networkError) {
    return <OfflineTemplate />;
  }

  if (error) {
    return <ErrorTemplate />;
  }

  return (
    <MainTemplate {...layoutProps}>
      {renderMobileContent}
      {renderDesktopContent}
    </MainTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['search'], locale),
  },
});

export default withUserMe(SearchPage);
