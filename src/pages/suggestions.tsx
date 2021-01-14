import { CardHeader, makeStyles, Paper, TableFooter } from '@material-ui/core';
import {
  BackButton,
  ErrorTemplate,
  LoadingBox,
  LoginRequiredTemplate,
  MainTemplate,
  NotFoundBox,
  SuggestionsTable,
} from 'components';
import { useAuthContext } from 'context';
import { withUserMe } from 'hocs';
import { useLanguageHeaderContext, useMediaQueries } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';
import { useSuggestionsQuery } from 'generated';
import * as R from 'ramda';

const useStyles = makeStyles(({ breakpoints, spacing }) => ({
  paper: {
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
  cardHeaderRoot: {
    borderBottom: BORDER,
    position: 'relative',
    padding: spacing(3),
  },
  cardHeaderAvatar: {
    position: 'absolute',
    top: spacing(2),
    left: spacing(2),
  },
  tableFooter: {
    [breakpoints.up('md')]: {
      minHeight: '3.5rem', // Exactly same height as the header.
    },
  },
}));

const SuggestionsPage: NextPage = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { userMe } = useAuthContext();
  const { isTabletOrDesktop } = useMediaQueries();
  const context = useLanguageHeaderContext();
  const { data, loading, error } = useSuggestionsQuery({ context });
  const courses = R.propOr([], 'suggestedCourses', data);
  const header = `${t('suggestions:header')} 🔥`;
  const renderBackButton = <BackButton />;

  const renderCardHeader = isTabletOrDesktop && (
    <CardHeader
      classes={{
        root: classes.cardHeaderRoot,
        avatar: classes.cardHeaderAvatar,
      }}
      title={header}
      avatar={renderBackButton}
    />
  );

  const renderLoading = <LoadingBox />;
  const renderNotFound = <NotFoundBox text={t('suggestions:noSuggestions')} />;
  const renderTableFooter = <TableFooter className={classes.tableFooter} />;
  const renderTable = <SuggestionsTable courses={courses} renderTableFooter={renderTableFooter} />;
  const renderSuggestions = loading ? renderLoading : courses.length ? renderTable : renderNotFound;

  const layoutProps = {
    seoProps: {
      title: t('suggestions:title'),
    },
    topNavbarProps: {
      header,
      renderBackButton,
    },
  };

  if (!userMe) {
    return <LoginRequiredTemplate {...layoutProps} />;
  }

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" />;
  }

  if (error) {
    return <ErrorTemplate variant="error" />;
  }

  return (
    <MainTemplate {...layoutProps}>
      <Paper className={classes.paper}>
        {renderCardHeader}
        {renderSuggestions}
      </Paper>
    </MainTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['suggestions'], locale),
  },
});

export default withUserMe(SuggestionsPage);
