import CardHeader from '@material-ui/core/CardHeader';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TableFooter from '@material-ui/core/TableFooter';
import {
  BackButton,
  ErrorTemplate,
  LoadingBox,
  MainTemplate,
  NotFoundBox,
  SuggestionsTable,
} from 'components';
import { useSuggestionsQuery } from 'generated';
import { withUserMe } from 'hocs';
import { useLanguageHeaderContext, useMediaQueries } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';
import { SeoPageProps } from 'types';

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

const SuggestionsPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { isTabletOrDesktop } = useMediaQueries();
  const context = useLanguageHeaderContext();
  const { data, loading, error } = useSuggestionsQuery({ context });
  const suggestions = R.propOr([], 'suggestions', data);
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

  const renderTable = (
    <SuggestionsTable suggestions={suggestions} renderTableFooter={renderTableFooter} />
  );

  const renderSuggestions = loading
    ? renderLoading
    : suggestions.length
    ? renderTable
    : renderNotFound;

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header,
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
      <Paper className={classes.paper}>
        {renderCardHeader}
        {renderSuggestions}
      </Paper>
    </MainTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const t = await getT(locale, 'suggestions');

  return {
    props: {
      _ns: await loadNamespaces(['suggestions'], locale),
      seoProps: {
        title: t('title'),
      },
    },
  };
};

export default withUserMe(SuggestionsPage);
