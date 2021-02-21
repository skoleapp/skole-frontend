import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { EmailSubscription, MarkdownTemplate } from 'components';
import { readdirSync } from 'fs';
import { withUserMe } from 'hocs';
import { useDayjs } from 'hooks';
import { loadNamespaces } from 'lib';
import { loadMarkdown } from 'markdown';
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next';
import Image from 'next/image';
import React from 'react';
import { RequestFeatureLink } from 'src/components/shared/RequestFeatureLink';
import { MarkdownPageProps } from 'types';

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

  const renderEmailSubscription = (
    <Box className={classes.emailSubscription}>
      <EmailSubscription />
    </Box>
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
    customBottomContent: [renderEmailSubscription, renderRequestFeatureLink],
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
