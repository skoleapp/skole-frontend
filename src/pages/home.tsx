import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import StarBorderOutlined from '@material-ui/icons/StarBorderOutlined';
import {
  ActionRequiredTemplate,
  ErrorTemplate,
  IconButtonLink,
  InviteDialog,
  LoadingBox,
  MainTemplate,
  OrderingButton,
  PaginatedTable,
  ThreadTableBody,
} from 'components';
import {
  useAuthContext,
  useDarkModeContext,
  useInviteContext,
  useOrderingContext,
  useThreadFormContext,
} from 'context';
import { ThreadObjectType, useThreadsQuery } from 'generated';
import { withAuthRequired } from 'hocs';
import { useLanguageHeaderContext, useMediaQueries } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { BORDER, BORDER_RADIUS } from 'styles';
import { INVITE_PROMPT_KEY, urls } from 'utils';

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
  },
}));

const HomePage: NextPage = () => {
  const classes = useStyles();
  const { verified, id, username, inviteCodeUsages } = useAuthContext();
  const { t } = useTranslation();
  const context = useLanguageHeaderContext();
  const { handleOpenThreadForm } = useThreadFormContext();
  const { query } = useRouter();
  const [title, setTitle] = useState('');
  const queryVariables = R.pick(['page', 'pageSize'], query);
  const { ordering } = useOrderingContext();
  const { handleOpenInviteDialog } = useInviteContext();
  const { mdUp } = useMediaQueries();

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
  const threadCount = R.pathOr(0, ['threads', 'count'], data);

  useEffect(() => {
    if (!!inviteCodeUsages && !localStorage.getItem(INVITE_PROMPT_KEY)) {
      handleOpenInviteDialog();
    }
  }, [inviteCodeUsages, handleOpenInviteDialog]);

  const handleSubmitCreateThread = useCallback(
    (e: SyntheticEvent): void => {
      e.preventDefault();
      handleOpenThreadForm({ title });
      setTitle('');
    },
    [handleOpenThreadForm, title],
  );

  const renderStarredButton = useMemo(
    () => (
      <IconButtonLink
        color="secondary"
        size="small"
        href={urls.starred}
        icon={StarBorderOutlined}
      />
    ),
    [],
  );

  const renderCreateThread = useMemo(
    () =>
      mdUp && (
        <Paper className={classes.createThreadContainer}>
          <form onSubmit={handleSubmitCreateThread}>
            <Box display="flex">
              <InputBase
                value={title}
                onChange={(e): void => setTitle(e.target.value)}
                placeholder={t('forms:createThread')}
                autoComplete="off"
                className={classes.createThreadInputBase}
                fullWidth
              />
              <Button
                className={classes.createThreadSubmitButton}
                variant="contained"
                type="submit"
              >
                <ArrowForwardOutlined />
              </Button>
            </Box>
          </form>
        </Paper>
      ),
    [
      classes.createThreadContainer,
      classes.createThreadInputBase,
      classes.createThreadSubmitButton,
      t,
      title,
      handleSubmitCreateThread,
      mdUp,
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

  const renderLoading = useMemo(() => loading && <LoadingBox />, [loading]);
  const renderThreadTableBody = useMemo(() => <ThreadTableBody threads={threads} />, [threads]);

  const renderThreadsTable = useMemo(
    () => (
      <PaginatedTable
        count={threadCount}
        renderTableBody={renderThreadTableBody}
        extraFilters={{ ordering }}
      />
    ),
    [ordering, renderThreadTableBody, threadCount],
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

  const renderInviteDialogText = useMemo(
    () => (
      <DialogContentText>
        <Typography variant="body2">
          {t('home:inviteText', { id, username, inviteCodeUsages })}
        </Typography>
      </DialogContentText>
    ),
    [t, id, username, inviteCodeUsages],
  );

  const renderInvitePrompt = useMemo(
    () => (
      <InviteDialog
        header={t('home:inviteDialogHeader')}
        dynamicContent={[renderInviteDialogText]}
        handleCloseCallback={(): void =>
          localStorage.setItem(INVITE_PROMPT_KEY, String(Date.now()))
        }
      />
    ),
    [renderInviteDialogText, t],
  );

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
      {renderInvitePrompt}
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

export default withAuthRequired(HomePage);
