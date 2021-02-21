import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { ButtonLink, EmailSubscription, Link, ListTemplate, RequestFeatureLink } from 'components';
import { useAuthContext } from 'context';
import { readdirSync } from 'fs';
import { withUserMe } from 'hocs';
import { useDayjs } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { loadMarkdown } from 'markdown';
import { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import * as R from 'ramda';
import React from 'react';
import { MarkdownPageData, SeoPageProps } from 'types';
import { urls } from 'utils';

interface Props extends SeoPageProps {
  updates: MarkdownPageData[];
}

const UpdatesPage: NextPage<Props> = ({ seoProps, updates }) => {
  const { t } = useTranslation();
  const { userMe, productUpdateEmailPermission } = useAuthContext();

  const sortedUpdates: MarkdownPageData[] = R.sortBy(R.prop('date'), updates).reverse();

  const mapUpdates = sortedUpdates.map(
    ({ title, excerpt, coverImage = '', date, slug = '' }, i) => (
      <Link href={urls.update(slug)} fullWidth>
        <ListItem key={i} button>
          <Grid container spacing={4}>
            <Grid item xs={9}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="h5">{title}</Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {excerpt}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Typography variant="body2" color="textSecondary">
                  {useDayjs(date).format('LL')}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={3} container justify="flex-end" alignItems="center">
              <Image width={140} height={100} src={coverImage} />
            </Grid>
          </Grid>
        </ListItem>
      </Link>
    ),
  );

  const renderUpdates = <TableBody>{mapUpdates}</TableBody>;

  const renderEmailSubscription = !userMe && (
    <EmailSubscription header={t('updates:emailSubscriptionHeader')} />
  );

  const renderSubscribeButton = !!userMe && !productUpdateEmailPermission && (
    <Grid container justify="center">
      <ButtonLink variant="outlined" href={urls.accountSettings} endIcon={<ArrowForwardOutlined />}>
        {t('updates:subscribeButtonText')}
      </ButtonLink>
    </Grid>
  );

  const renderRequestFeatureLink = <RequestFeatureLink />;

  const renderBottomContent = (
    <CardContent>
      {renderEmailSubscription || renderSubscribeButton}
      {renderRequestFeatureLink}
    </CardContent>
  );

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: t('updates:header'),
      emoji: '🆕',
    },
  };

  return (
    <ListTemplate {...layoutProps}>
      {renderUpdates}
      {renderBottomContent}
    </ListTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const _ns = await loadNamespaces(['updates'], locale);
  const t = await getT(locale, 'updates');

  const seoProps = {
    title: t('title'),
    description: t('description'),
  };

  const fileNames = readdirSync('markdown/en/updates');
  const updates = [];

  for (const fileName of fileNames) {
    const slug = fileName.replace(/\.md$/, '');
    const { data } = await loadMarkdown(`updates/${slug}`);
    updates.push(data);
  }

  return {
    props: {
      _ns,
      seoProps,
      updates,
    },
  };
};

export default withUserMe(UpdatesPage);
