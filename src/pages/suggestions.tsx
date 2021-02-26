import { makeStyles } from '@material-ui/core/styles';
import TableFooter from '@material-ui/core/TableFooter';
import { ErrorTemplate, ListTemplate, LoadingBox, NotFoundBox, SuggestionsTable } from 'components';
import { useSuggestionsQuery } from 'generated';
import { withUserMe } from 'hocs';
import { useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { SeoPageProps } from 'types';

const useStyles = makeStyles(({ breakpoints }) => ({
  tableFooter: {
    [breakpoints.up('md')]: {
      minHeight: '3.5rem', // Exactly same height as the header.
    },
  },
}));

const SuggestionsPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const context = useLanguageHeaderContext();
  const { data, loading, error } = useSuggestionsQuery({ context });
  const suggestions = R.prop('suggestions', data);

  const renderLoading = <LoadingBox />;
  const renderNotFound = <NotFoundBox text={t('suggestions:noSuggestions')} />;
  const renderTableFooter = <TableFooter className={classes.tableFooter} />;

  const renderTable = (
    <SuggestionsTable suggestions={suggestions} renderTableFooter={renderTableFooter} />
  );

  const renderSuggestions =
    (loading && renderLoading) || (suggestions.length && renderTable) || renderNotFound;

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: t('suggestions:header'),
      emoji: '🔥',
    },
  };

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" seoProps={seoProps} />;
  }

  if (error) {
    return <ErrorTemplate variant="error" seoProps={seoProps} />;
  }

  return <ListTemplate {...layoutProps}>{renderSuggestions}</ListTemplate>;
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
