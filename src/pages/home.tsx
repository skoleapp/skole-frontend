import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CardHeader from '@material-ui/core/CardHeader';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import FileCopyOutlined from '@material-ui/icons/FileCopyOutlined';
import {
  ActionRequiredTemplate,
  DialogHeader,
  Emoji,
  ErrorTemplate,
  LoadingBox,
  MainTemplate,
  OrderingButton,
  PaginatedTable,
  SkoleDialog,
  ThreadTableBody,
} from 'components';
import {
  useAuthContext,
  useNotificationsContext,
  useOrderingContext,
  useThreadFormContext,
} from 'context';
import { ThreadObjectType, useThreadsQuery } from 'generated';
import { withAuthRequired } from 'hocs';
import { useLanguageHeaderContext, useOpen } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { SyntheticEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { withThreadForm } from 'src/hocs/withThreadForm';
import { BORDER, BORDER_RADIUS } from 'styles';
import { INVITE_PROMPT_KEY, SLOGAN, urls } from 'utils';

const useStyles = makeStyles(({ palette, breakpoints, spacing }) => ({
  createThreadContainer: {
    padding: spacing(2),
    [breakpoints.up('md')]: {
      borderRadius: BORDER_RADIUS,
    },
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
  copyCodeButton: {
    padding: spacing(0.75),
    marginLeft: spacing(1),
  },
  copyCodeButtonIcon: {
    width: '1rem',
    height: '1rem',
  },
}));

const HomePage: NextPage = () => {
  const classes = useStyles();
  const { verified, id, username, inviteCode, inviteCodeUsages } = useAuthContext();
  const { t } = useTranslation();
  const context = useLanguageHeaderContext();
  const { handleOpenThreadForm } = useThreadFormContext();
  const { query } = useRouter();
  const [title, setTitle] = useState('');
  const queryVariables = R.pick(['page', 'pageSize'], query);
  const { ordering } = useOrderingContext();
  const { toggleNotification } = useNotificationsContext();

  const {
    open: invitePromptOpen,
    handleOpen: handleOpenInvitePrompt,
    handleClose: _handleCloseInvitePrompt,
  } = useOpen();

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
      handleOpenInvitePrompt();
    }
  }, [inviteCodeUsages, handleOpenInvitePrompt]);

  const handleCloseInvitePrompt = useCallback((): void => {
    localStorage.setItem(INVITE_PROMPT_KEY, String(Date.now()));
    _handleCloseInvitePrompt();
  }, [_handleCloseInvitePrompt]);

  const handleSubmitCreateThread = useCallback(
    (e: SyntheticEvent): void => {
      e.preventDefault();
      handleOpenThreadForm({ title });
      setTitle('');
    },
    [handleOpenThreadForm, title],
  );

  const handleClickInviteButton = useCallback(async (): Promise<void> => {
    const { navigator } = window;

    if (!!navigator && !!navigator.share) {
      try {
        await navigator.share({
          title: t('common:inviteTitle'),
          text: SLOGAN,
          url: `${urls.index}?inviteCode=${t('common:inviteTitle')}`,
        });
      } catch {
        // User cancelled.
      }
    }
  }, [t]);

  const handleClickCopyCodeButton = useCallback((): void => {
    toggleNotification(t('home:inviteCodeCopied'));
    navigator.clipboard.writeText(inviteCode);
  }, [inviteCode, t, toggleNotification]);

  const renderCreateThread = useMemo(
    () => (
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
            <Button className={classes.createThreadSubmitButton} variant="contained" type="submit">
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

  const renderCopyCodeButton = useMemo(
    () => (
      <IconButton onClick={handleClickCopyCodeButton} className={classes.copyCodeButton}>
        <FileCopyOutlined className={classes.copyCodeButtonIcon} />
      </IconButton>
    ),
    [classes.copyCodeButton, classes.copyCodeButtonIcon, handleClickCopyCodeButton],
  );

  const renderInvitePrompt = useMemo(
    () => (
      <SkoleDialog open={invitePromptOpen} fullScreen={false}>
        <DialogHeader onCancel={handleCloseInvitePrompt} />
        <DialogContent>
          <DialogContentText color="textPrimary">
            <Typography variant="subtitle1">
              {t('home:inviteHeader', { username })}
              <Emoji emoji="🎉" />
            </Typography>
          </DialogContentText>
          <DialogContentText>{t('home:inviteText', { id })}</DialogContentText>
          <DialogContentText>{t('home:inviteCodeText')}</DialogContentText>
          <DialogContentText color="textPrimary">
            {inviteCode} {renderCopyCodeButton}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleClickInviteButton}
            endIcon={<ArrowForwardOutlined />}
            fullWidth
          >
            {t('home:inviteButtonText')}
          </Button>
        </DialogActions>
      </SkoleDialog>
    ),
    [
      invitePromptOpen,
      handleCloseInvitePrompt,
      username,
      id,
      inviteCode,
      handleClickInviteButton,
      renderCopyCodeButton,
      t,
    ],
  );

  const layoutProps = {
    seoProps: {
      title: t('home:title'),
    },
    topNavbarProps: {
      hideBackButton: true,
    },
    hideBottomNavbar: false,
    hideLogo: true,
    hideAppStoreBadges: true,
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

const withWrappers = R.compose(withAuthRequired, withThreadForm);

export default withWrappers(HomePage);
