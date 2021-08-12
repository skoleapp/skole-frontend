import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import StarBorderOutlined from '@material-ui/icons/StarBorderOutlined';
import {
  ActionRequiredTemplate,
  ErrorTemplate,
  FileDropDialog,
  IconButtonLink,
  MainTemplate,
  OrderingButton,
  PaginatedTable,
  SkeletonThreadTableList,
  ThreadTableBody,
} from 'components';
import {
  useAuthContext,
  useMediaQueryContext,
  useOrderingContext,
  useThreadFormContext,
} from 'context';
import { ThreadObjectType, useThreadsQuery } from 'generated';
import { withAuthRequired } from 'hocs';
import { useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useMemo } from 'react';
import { withDrag } from 'src/hocs/withDrag';
import { BORDER, BORDER_RADIUS } from 'styles';
import { urls } from 'utils';

const useStyles = makeStyles(({ palette, breakpoints, spacing }) => ({
  createThreadContainer: {
    padding: spacing(2),
    borderRadius: BORDER_RADIUS,
  },
  createThreadInputBase: {
    padding: spacing(2),
    border: BORDER,
    borderRadius: `${BORDER_RADIUS} 0 0 ${BORDER_RADIUS}`,
  },
  createThreadSubmitButton: {
    borderRadius: `0 ${BORDER_RADIUS} ${BORDER_RADIUS} 0`,
  },
  threadsPaper: {
    overflow: 'hidden',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
      marginTop: spacing(2),
    },
  },
  threadsCardHeader: {
    borderBottom: BORDER,
    color: palette.text.secondary,
    padding: spacing(3),
    marginLeft: 'env(safe-area-inset-left)',
    marginRight: 'env(safe-area-inset-right)',
  },
}));

const HomePage: NextPage = () => {
  const classes = useStyles();
  const { verified } = useAuthContext();
  const { t } = useTranslation();
  const context = useLanguageHeaderContext();
  const { handleOpenThreadForm } = useThreadFormContext();
  const { query } = useRouter();
  const queryVariables = R.pick(['page', 'pageSize'], query);
  const { ordering } = useOrderingContext();
  const { mdUp } = useMediaQueryContext();

  const variables = {
    ordering,
    ...queryVariables,
  };

  const { data, loading, error } = useThreadsQuery({
    context,
    skip: !verified,
    variables,
  });

  const threads: ThreadObjectType[] = R.pathOr([], ['threads', 'objects'], data);
  const page = R.pathOr(1, ['threads', 'page'], data);
  const threadCount = R.pathOr(0, ['threads', 'count'], data);

  const renderStarredButton = useMemo(
    () =>
      !!verified && (
        <IconButtonLink
          color="secondary"
          size="small"
          href={urls.starred}
          icon={StarBorderOutlined}
        />
      ),
    [verified],
  );

  const renderCreateThread = useMemo(
    () =>
      mdUp && (
        <Paper className={classes.createThreadContainer}>
          <Box display="flex">
            <InputBase
              placeholder={t('forms:createThread')}
              autoComplete="off"
              onFocus={(e): void => {
                e.target.blur();
                handleOpenThreadForm();
              }}
              className={classes.createThreadInputBase}
              fullWidth
            />
            <Button
              onClick={(): void => handleOpenThreadForm()}
              className={classes.createThreadSubmitButton}
              variant="contained"
            >
              <ArrowForwardOutlined />
            </Button>
          </Box>
        </Paper>
      ),
    [
      classes.createThreadContainer,
      classes.createThreadInputBase,
      classes.createThreadSubmitButton,
      t,
      mdUp,
      handleOpenThreadForm,
    ],
  );

  const renderThreadsHeaderTitle = useMemo(
    () => (
      <Grid container>
        <OrderingButton />
      </Grid>
    ),
    [],
  );

  const renderThreadsHeader = useMemo(
    () => <CardHeader className={classes.threadsCardHeader} title={renderThreadsHeaderTitle} />,
    [classes.threadsCardHeader, renderThreadsHeaderTitle],
  );

  const renderLoading = useMemo(() => loading && <SkeletonThreadTableList />, [loading]);
  const renderThreadTableBody = useMemo(() => <ThreadTableBody threads={threads} />, [threads]);

  const renderThreadsTable = useMemo(
    () => (
      <PaginatedTable
        page={page}
        count={threadCount}
        renderTableBody={renderThreadTableBody}
        extraFilters={{ ordering }}
      />
    ),
    [ordering, renderThreadTableBody, threadCount, page],
  );

  const renderThreads = useMemo(
    () => (
      <Paper className={classes.threadsPaper}>
        {renderThreadsHeader}
        {renderLoading || renderThreadsTable}
      </Paper>
    ),
    [classes.threadsPaper, renderThreadsHeader, renderLoading, renderThreadsTable],
  );

  const renderFileDropDialog = useMemo(() => <FileDropDialog />, []);

  const layoutProps = {
    seoProps: {
      title: t('home:title'),
    },
    topNavbarProps: {
      hideBackButton: true,
      renderHeaderRight: renderStarredButton,
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
      {renderCreateThread}
      {renderThreads}
      {renderFileDropDialog}
    </MainTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      _ns: await loadNamespaces(['home'], locale),
    },
  };
};

const withWrappers = R.compose(withAuthRequired, withDrag);

export default withWrappers(HomePage);
