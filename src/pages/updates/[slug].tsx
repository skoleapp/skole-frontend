import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { ButtonLink, EmailSubscription, MarkdownTemplate, RequestFeatureLink } from 'components';
import { useAuthContext } from 'context';
import { readdirSync } from 'fs';
import { withUserMe } from 'hocs';
import { useDayjs } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { loadMarkdown } from 'markdown';
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next';
import Image from 'next/image';
import React from 'react';
import { MarkdownPageProps } from 'types';
import { urls } from 'utils';

const useStyles = makeStyles(({ spacing }) => ({
  coverImage: {
    marginBottom: `${spacing(2)} !important`,
  },
  emailSubscription: {
    marginTop: spacing(16),
  },
}));

const UpdatePage: NextPage<MarkdownPageProps> = ({
  seoProps,
  data: { title, excerpt, coverImage = '', date },
  content: markdownContent,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { userMe, productUpdateEmailPermission } = useAuthContext();

  const renderExcerpt = (
    <Typography variant="h5" color="textSecondary" gutterBottom>
      {excerpt}
    </Typography>
  );

  const renderUpdateInfo = (
    <Typography variant="body2" color="textSecondary" gutterBottom>
      {useDayjs(date).format('LL')}
    </Typography>
  );

  const renderCoverImage = (
    <Image
      className={classes.coverImage}
      src={coverImage}
      layout="responsive"
      width={400}
      height={300}
      objectFit="contain"
    />
  );

  const renderEmailSubscription = !userMe && (
    <Box className={classes.emailSubscription}>
      <EmailSubscription header={t('updates:emailSubscriptionHeader')} />
    </Box>
  );

  const renderSubscribeButton = !!userMe && !productUpdateEmailPermission && (
    <Grid className={classes.emailSubscription} container justify="center">
      <ButtonLink variant="outlined" href={urls.accountSettings} endIcon={<ArrowForwardOutlined />}>
        {t('updates:subscribeButtonText')}
      </ButtonLink>
    </Grid>
  );

  const renderRequestFeatureLink = <RequestFeatureLink />;

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: title,
      hideLanguageButton: true,
    },
    customTopContent: [renderExcerpt, renderUpdateInfo, renderCoverImage],
    markdownContent,
    customBottomContent: [
      renderEmailSubscription || renderSubscribeButton,
      renderRequestFeatureLink,
    ],
    hideFeedback: true,
  };

  return <MarkdownTemplate {...layoutProps} />;
};

interface GetStaticPathsParams {
  locales: string[];
}

export const getStaticPaths = async ({
  locales,
}: GetStaticPathsParams): Promise<GetStaticPathsResult<{ slug: string }>> => {
  const fileNames = readdirSync('markdown/en/updates');

  const params = fileNames.map((f) => ({
    params: {
      slug: f.replace(/\.md$/, ''),
    },
  }));

  const paths = locales?.flatMap((locale) =>
    params.map((params) => ({
      locale,
      ...params,
    })),
  );

  return {
    paths,
    fallback: false,
  };
};

interface GetStaticPropsParams extends GetStaticPropsContext {
  params: {
    slug: string;
  };
}

export const getStaticProps = async ({
  locale,
  params: { slug },
}: GetStaticPropsParams): Promise<GetStaticPropsResult<MarkdownPageProps>> => {
  const _ns = await loadNamespaces(['updates'], locale);
  const { data, content } = await loadMarkdown(`updates/${slug}`);

  const seoProps = {
    title: data.title,
    description: data.excerpt,
  };

  return {
    props: {
      _ns,
      seoProps,
      data,
      content,
    },
  };
};

export default withUserMe(UpdatePage);
