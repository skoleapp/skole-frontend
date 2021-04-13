import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import ContactMailOutlined from '@material-ui/icons/ContactMailOutlined';
import StarBorderOutlined from '@material-ui/icons/StarBorderOutlined';
import {
  ActionRequiredTemplate,
  CustomInviteDialog,
  Emoji,
  ErrorTemplate,
  IconButtonLink,
  LoadingBox,
  MainTemplate,
  OrderingButton,
  PaginatedTable,
  ThreadTableBody,
} from 'components';
import {
  useAuthContext,
  useInviteContext,
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
import React, { useCallback, useEffect, useMemo } from 'react';
import { BORDER, BORDER_RADIUS, useMediaQueries } from 'styles';
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
  const queryVariables = R.pick(['page', 'pageSize'], query);
  const { ordering } = useOrderingContext();
  const { mdUp } = useMediaQueries();

  const {
    handleOpenCustomInviteDialog,
    customInviteDialogOpen,
    handleCloseCustomInviteDialog,
    handleOpenGeneralInviteDialog,
  } = useInviteContext();

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
      handleOpenCustomInviteDialog();
    }
  }, [inviteCodeUsages, handleOpenCustomInviteDialog]);

  const handleCloseInvitePrompt = useCallback((): void => {
    handleCloseCustomInviteDialog();
    localStorage.setItem(INVITE_PROMPT_KEY, String(Date.now()));
  }, [handleCloseCustomInviteDialog]);

  const renderInviteButton = useMemo(
    () =>
      !!verified && (
        <IconButton onClick={handleOpenGeneralInviteDialog} color="secondary" size="small">
          <Badge badgeContent={inviteCodeUsages} color="secondary">
            <ContactMailOutlined />
          </Badge>
        </IconButton>
      ),
    [handleOpenGeneralInviteDialog, inviteCodeUsages, verified],
  );

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

  const renderInvitePromptHeader = useMemo(
    () => (
      <>
        {t('home:inviteDialogHeader')} <Emoji emoji="🎉" />
      </>
    ),
    [t],
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

  const renderInvitePromptText = useMemo(
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
      <CustomInviteDialog
        open={customInviteDialogOpen}
        header={renderInvitePromptHeader}
        dynamicContent={[renderInvitePromptText]}
        handleClose={handleCloseInvitePrompt}
      />
    ),
    [
      renderInvitePromptText,
      renderInvitePromptHeader,
      handleCloseInvitePrompt,
      customInviteDialogOpen,
    ],
  );

  const layoutProps = {
    seoProps: {
      title: t('home:title'),
    },
    topNavbarProps: {
      hideBackButton: true,
      renderHeaderLeft: renderInviteButton,
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
