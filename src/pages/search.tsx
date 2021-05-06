import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowBackOutlined from '@material-ui/icons/ArrowBackOutlined';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import ClearOutlined from '@material-ui/icons/ClearOutlined';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import clsx from 'clsx';
import {
  ActionRequiredTemplate,
  ErrorTemplate,
  FileDropDialog,
  MainTemplate,
  NotFoundBox,
  PaginatedTable,
  SkeletonThreadTableList,
  ThreadTableBody,
} from 'components';
import { useAuthContext, useMediaQueryContext, useThreadFormContext } from 'context';
import { useThreadsQuery } from 'generated';
import { withAuthRequired } from 'hocs';
import { useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React, {
  ChangeEvent,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { withDrag } from 'src/hocs/withDrag';
import { BORDER, BORDER_RADIUS, TOP_NAVBAR_HEIGHT_MOBILE } from 'styles';
import { getPaginationQuery, urls } from 'utils';

const useStyles = makeStyles(({ palette, spacing, breakpoints }) => ({
  container: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
  },
  topNavbar: {
    height: `calc(${TOP_NAVBAR_HEIGHT_MOBILE} + env(safe-area-inset-top))`,
    paddingTop: 0,
    paddingLeft: 0, // Override the default safe area inset.
    paddingRight: 0, // Override the default safe area inset.
    display: 'flex',
    justifyContent: 'flex-end',
    boxShadow: 'none',
    borderBottom: BORDER,
  },
  topNavbarSearchContainer: {
    padding: spacing(1),
    paddingLeft: `calc(${spacing(1)} + env(safe-area-inset-left))`,
    paddingRight: `calc(${spacing(1)} + env(safe-area-inset-right))`,
    minHeight: TOP_NAVBAR_HEIGHT_MOBILE,
    backgroundColor: palette.background.paper,
    display: 'flex',
    alignItems: 'center',
  },
  topNavbarSearchForm: {
    flexGrow: 1,
  },
  topNavbarSearchInputBase: {
    width: '100%',
    paddingLeft: spacing(2),
  },
  topNavbarSearchBackButton: {
    padding: spacing(1),
    marginLeft: spacing(-1),
  },
  cardHeader: {
    padding: spacing(2),
    borderBottom: BORDER,
  },
  searchForm: {
    width: '100%',
  },
  searchInputBase: {
    borderRadius: BORDER_RADIUS,
    padding: spacing(3),
    border: BORDER,
  },
  resultsInfo: {
    padding: spacing(2),
  },
  tableContainer: {
    flexGrow: 1,
    display: 'flex',
  },
  createThreadButton: {
    marginTop: spacing(4),
  },
}));

const SearchPage: NextPage = () => {
  const classes = useStyles();
  const { mdUp } = useMediaQueryContext();
  const { t } = useTranslation();
  const { pathname, query } = useRouter();
  const variables = R.pick(['searchTerm', 'page', 'pageSize'], query);
  const context = useLanguageHeaderContext();
  const { verified } = useAuthContext();
  const { data, loading, error } = useThreadsQuery({ variables, context });
  const threads = R.pathOr([], ['threads', 'objects'], data);
  const page = R.pathOr(1, ['threads', 'page'], data);
  const count = R.pathOr(0, ['threads', 'count'], data);
  const searchTerm = R.prop('searchTerm', query);
  const [searchInputValue, setSearchInputValue] = useState('');
  const { handleOpenThreadForm } = useThreadFormContext();
  const paginationQuery = getPaginationQuery(query); // Query that holds only pagination.

  useEffect(() => {
    setSearchInputValue(searchTerm);
  }, [searchTerm]);

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>): void =>
    setSearchInputValue(e.target.value);

  const handleSubmitSearch = useCallback(
    async (e: SyntheticEvent): Promise<void> => {
      e.preventDefault();
      setSearchInputValue('');
      await Router.push({ pathname: urls.search, query: { searchTerm: searchInputValue } });
      sa_event('submit_thread_search');
    },
    [searchInputValue],
  );

  const handleClearSearchInput = useCallback(async (): Promise<void> => {
    setSearchInputValue('');
    await Router.push({ pathname, query: paginationQuery });
  }, [paginationQuery, pathname]);

  const renderResultsInfo = useMemo(
    () =>
      !!searchTerm && (
        <Box className={classes.resultsInfo}>
          <Typography variant="body2" color="textSecondary">
            {t('search:resultsInfo', { searchTerm })}
          </Typography>
        </Box>
      ),
    [searchTerm, classes.resultsInfo, t],
  );

  const renderLoading = useMemo(() => loading && <SkeletonThreadTableList />, [loading]);
  const renderThreads = useMemo(() => <ThreadTableBody threads={threads} />, [threads]);

  const renderTable = useMemo(
    () =>
      threads.length && (
        <Box className={classes.tableContainer}>
          <PaginatedTable
            page={page}
            count={count}
            renderTableBody={renderThreads}
            extraFilters={{ searchTerm }}
          />
        </Box>
      ),
    [threads, classes.tableContainer, count, renderThreads, searchTerm, page],
  );

  const renderNotFound = useMemo(
    () => (
      <NotFoundBox text={t('search:noThreads', { searchTerm })}>
        <Button
          onClick={(): void => handleOpenThreadForm({ title: searchTerm })}
          className={classes.createThreadButton}
          variant="contained"
          endIcon={<ArrowForwardOutlined />}
        >
          {t('search:create', { searchTerm })}
        </Button>
      </NotFoundBox>
    ),
    [searchTerm, t, classes.createThreadButton, handleOpenThreadForm],
  );

  const renderResults = renderLoading || renderTable || renderNotFound;

  const renderSearchInputStartAdornment = useMemo(
    () => (
      <InputAdornment position="start">
        <SearchOutlined color="disabled" />
      </InputAdornment>
    ),
    [],
  );

  const renderSearchInputEndAdornment = useMemo(
    () =>
      searchInputValue && (
        <InputAdornment position="end">
          <IconButton onClick={handleClearSearchInput} size="small">
            <ClearOutlined />
          </IconButton>
        </InputAdornment>
      ),
    [searchInputValue, handleClearSearchInput],
  );

  const renderHeader = useMemo(
    () =>
      mdUp && (
        <Grid className={clsx('MuiCardHeader-root', classes.cardHeader)} container>
          <form className={classes.searchForm} onSubmit={handleSubmitSearch}>
            <InputBase
              value={searchInputValue}
              placeholder={t('forms:threadSearch')}
              autoComplete="off"
              onChange={handleSearchInputChange}
              className={classes.searchInputBase}
              fullWidth
              startAdornment={renderSearchInputStartAdornment}
              endAdornment={renderSearchInputEndAdornment}
            />
            <input type="submit" value="Submit" />
          </form>
        </Grid>
      ),
    [
      classes.cardHeader,
      classes.searchForm,
      classes.searchInputBase,
      handleSubmitSearch,
      mdUp,
      searchInputValue,
      t,
      renderSearchInputEndAdornment,
      renderSearchInputStartAdornment,
    ],
  );

  const renderTopNavbarSearchInputStartAdornment = useMemo(
    () =>
      searchInputValue ? (
        <InputAdornment position="start">
          <IconButton
            className={classes.topNavbarSearchBackButton}
            onClick={handleClearSearchInput}
            size="small"
          >
            <ArrowBackOutlined />
          </IconButton>
        </InputAdornment>
      ) : (
        <InputAdornment position="start">
          <SearchOutlined color="disabled" />
        </InputAdornment>
      ),
    [searchInputValue, classes.topNavbarSearchBackButton, handleClearSearchInput],
  );

  const customTopNavbar = useMemo(
    () => (
      <AppBar className={classes.topNavbar}>
        <Box className={classes.topNavbarSearchContainer}>
          <form className={classes.topNavbarSearchForm} onSubmit={handleSubmitSearch}>
            <InputBase
              className={classes.topNavbarSearchInputBase}
              placeholder={t('forms:threadSearch')}
              value={searchInputValue}
              onChange={handleSearchInputChange}
              startAdornment={renderTopNavbarSearchInputStartAdornment}
            />
          </form>
        </Box>
      </AppBar>
    ),
    [
      classes.topNavbar,
      classes.topNavbarSearchContainer,
      classes.topNavbarSearchForm,
      classes.topNavbarSearchInputBase,
      handleSubmitSearch,
      searchInputValue,
      t,
      renderTopNavbarSearchInputStartAdornment,
    ],
  );

  const renderFileDropDialog = useMemo(() => <FileDropDialog />, []);

  const layoutProps = {
    seoProps: {
      title: t('search:title'),
    },
    customTopNavbar,
    topNavbarProps: {
      hideSearch: true,
    },
  };

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" />;
  }

  if (error) {
    return <ErrorTemplate variant="error" />;
  }

  if (!verified) {
    return <ActionRequiredTemplate variant="verify-account" {...layoutProps} />;
  }

  return (
    <MainTemplate {...layoutProps}>
      <Paper className={classes.container}>
        {renderHeader}
        {renderResultsInfo}
        {renderResults}
        {renderFileDropDialog}
      </Paper>
    </MainTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['search'], locale),
  },
});

const withWrappers = R.compose(withDrag, withAuthRequired);

export default withWrappers(SearchPage);
