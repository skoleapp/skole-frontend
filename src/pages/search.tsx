import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import Chip from '@material-ui/core/Chip';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBackOutlined from '@material-ui/icons/ArrowBackOutlined';
import ClearAllOutlined from '@material-ui/icons/ClearAllOutlined';
import FilterListOutlined from '@material-ui/icons/FilterListOutlined';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import {
  AutocompleteField,
  ContactLink,
  CourseTableBody,
  DialogHeader,
  Emoji,
  ErrorTemplate,
  FormSubmitSection,
  LoadingBox,
  MainTemplate,
  NativeSelectField,
  NotFoundBox,
  PaginatedTable,
  SkoleDialog,
  TextFormField,
} from 'components';
import { useDarkModeContext } from 'context';
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
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { ChangeEvent, SyntheticEvent, useMemo, useState } from 'react';
import { BORDER, BORDER_RADIUS, TOP_NAVBAR_HEIGHT_MOBILE } from 'styles';
import { SeoPageProps } from 'types';
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
    paddingTop: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    boxShadow: 'none',
    borderBottom: BORDER,
  },
  cardHeaderRoot: {
    borderBottom: BORDER,
  },
  cardHeaderTitle: {
    color: palette.text.secondary,
  },
  searchContainer: {
    padding: spacing(1),
    minHeight: TOP_NAVBAR_HEIGHT_MOBILE,
    backgroundColor: palette.background.paper,
    display: 'flex',
    alignItems: 'center',
  },
  searchForm: {
    flexGrow: 1,
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
  searchTerm: string;
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

const SearchPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const classes = useStyles();
  const { isMobile, isTabletOrDesktop, isXlDesktop } = useMediaQueries();
  const { t } = useTranslation();
  const { pathname, query } = useRouter();

  const variables = R.pick(
    [
      'searchTerm',
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
  const { formRef } = useForm<SearchFormValues>();
  const courses = R.pathOr([], ['courses', 'objects'], data);
  const school = R.propOr(null, 'school', data);
  const subject = R.propOr(null, 'subject', data);
  const schoolType = R.propOr(null, 'schoolType', data);
  const country = R.propOr(null, 'country', data);
  const city = R.propOr(null, 'city', data);
  const count = R.pathOr(0, ['courses', 'count'], data);
  const searchTerm = R.propOr('', 'searchTerm', query);
  const ordering = R.propOr('', 'ordering', query);
  const [searchValue, setSearchValue] = useState(searchTerm);
  const schoolName = R.prop('name', school);
  const subjectName = R.prop('name', subject);
  const schoolTypeName = R.prop('name', schoolType);
  const countryName = R.prop('name', country);
  const cityName = R.prop('name', city);
  const filtersHeader = t('common:filters');
  const filtersEmoji = '🔎';
  const resultsHeader = t('common:searchResults');
  const { darkMode } = useDarkModeContext();
  const iconButtonColor = darkMode ? 'secondary' : 'primary';

  const {
    open: filtersOpen,
    handleOpen: handleOpenFilters,
    handleClose: handleCloseFilters,
  } = useOpen();

  const dynamicInitialValues = {
    searchTerm,
    school,
    subject,
    schoolType,
    country,
    city,
    ordering,
  };

  // Only re-render when one of the dynamic values changes - the form values will reset every time.
  const initialValues = useMemo(() => dynamicInitialValues, Object.values(dynamicInitialValues));

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
    formRef.current?.resetForm();
    handleCloseFilters();
    await Router.push({ pathname, query: validQuery });
  };

  // Clear the query params and reset form.
  const handleClearFilters = async (): Promise<void> => {
    const paginationQuery = getPaginationQuery(query);
    formRef.current?.resetForm();
    setSearchValue('');
    handleCloseFilters();
    await Router.push({ pathname, query: paginationQuery });
  };

  const filtersArr = [
    {
      name: 'searchTerm',
      value: searchTerm,
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
      query: { ...queryWithPagination, searchTerm: searchValue },
    });
  };

  const handlePreSubmit = async ({
    searchTerm,
    school: _school,
    subject: _subject,
    schoolType: _schoolType,
    country: _country,
    city: _city,
    ordering,
  }: SearchFormValues): Promise<void> => {
    const school = R.propOr('', 'slug', _school);
    const subject = R.propOr('', 'slug', _subject);
    const schoolType = R.propOr('', 'slug', _schoolType);
    const country = R.propOr('', 'slug', _country);
    const city = R.propOr('', 'slug', _city);

    const filteredValues = {
      ...queryWithPagination, // Define this first to override the values.
      searchTerm,
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

    filterName === 'searchTerm' && (await handleClearSearchInput());
    await Router.push({ pathname, query });
  };

  const renderFilterNames = !!validFilters.length && (
    <Box className={classes.filterNames}>
      {validFilters.map(({ name, value }, i) => (
        <Chip className={classes.chip} key={i} label={value} onDelete={handleDeleteFilter(name)} />
      ))}
    </Box>
  );

  const renderCourseSearchTermField = isTabletOrDesktop && (
    <Field name="searchTerm" label={t('forms:searchTerm')} component={TextFormField} />
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
      className="Mui-InputLabel-shrink" // We want the label to be always shrunk.
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
      {renderCourseSearchTermField}
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

  const notFoundLinkProps = {
    href: urls.addCourse,
    text: t('search:noCoursesLink'),
  };

  const renderLoading = <LoadingBox />;
  const renderCourses = <CourseTableBody courses={courses} dense={!isXlDesktop} />;

  const renderTable = (
    <Box className={classes.tableContainer}>
      <PaginatedTable count={count} renderTableBody={renderCourses} extraFilters={initialValues} />
    </Box>
  );

  const renderNotFound = <NotFoundBox text={t('search:noCourses')} linkProps={notFoundLinkProps} />;
  const renderResults = loading ? renderLoading : courses.length ? renderTable : renderNotFound;

  const renderClearFiltersButton = (
    <IconButton onClick={handleClearFilters} size="small" color={iconButtonColor}>
      <ClearAllOutlined />
    </IconButton>
  );

  const renderDialogHeader = (
    <DialogHeader
      onCancel={handleCloseFilters}
      text={filtersHeader}
      emoji={filtersEmoji}
      renderHeaderLeft={renderClearFiltersButton}
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

  const renderFiltersEmoji = <Emoji emoji={filtersEmoji} />;
  const renderResultsEmoji = <Emoji emoji="🎓" />;

  const renderFiltersHeaderTitle = (
    <>
      {filtersHeader}
      {renderFiltersEmoji}
    </>
  );

  const renderFilterResultsHeader = (
    <CardHeader
      classes={{
        root: classes.cardHeaderRoot,
        title: classes.cardHeaderTitle,
      }}
      title={renderFiltersHeaderTitle}
    />
  );

  const renderResultsHeaderTitle = (
    <>
      {resultsHeader}
      {renderResultsEmoji}
    </>
  );

  const renderResultsHeader = (
    <CardHeader
      classes={{
        root: classes.cardHeaderRoot,
        title: classes.cardHeaderTitle,
      }}
      title={renderResultsHeaderTitle}
    />
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
    <IconButton onClick={handleClearSearchInput} color={iconButtonColor} size="small">
      <ArrowBackOutlined />
    </IconButton>
  ) : (
    <IconButton onClick={handleSearchIconClick} color={iconButtonColor} size="small">
      <SearchOutlined />
    </IconButton>
  );

  const renderSearchNavbarEndAdornment = (
    <IconButton onClick={handleOpenFilters} size="small" color={iconButtonColor}>
      <FilterListOutlined />
    </IconButton>
  );

  const customTopNavbar = (
    <AppBar className={classes.topNavbar}>
      <Box className={classes.searchContainer}>
        <form className={classes.searchForm} onSubmit={handleSubmitSearchInput}>
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
    seoProps,
    customTopNavbar,
    topNavbarProps: {
      hideSearch: true,
    },
  };

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" seoProps={seoProps} />;
  }

  if (error) {
    return <ErrorTemplate variant="error" seoProps={seoProps} />;
  }

  return (
    <MainTemplate {...layoutProps}>
      {renderMobileContent}
      {renderDesktopContent}
    </MainTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const t = await getT(locale, 'search');

  return {
    props: {
      _ns: await loadNamespaces(['search'], locale),
      seoProps: {
        title: t('title'),
      },
    },
  };
};

export default withUserMe(SearchPage);
