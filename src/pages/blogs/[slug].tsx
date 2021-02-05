import Typography from '@material-ui/core/Typography';
import { MarkdownTemplate } from 'components';
import { readdirSync } from 'fs';
import { withUserMe } from 'hocs';
import { useDayjs } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { loadMarkdown } from 'markdown';
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult, NextPage } from 'next';
import Image from 'next/image';
import React from 'react';
import { MarkdownPageProps } from 'types';

const BlogPostPage: NextPage<MarkdownPageProps> = ({
  seoProps,
  data: { title, excerpt, coverImage = '', author, date, minutesToRead = 0 },
  content,
}) => {
  const { t } = useTranslation();

  const renderExcerpt = (
    <Typography variant="h5" color="textSecondary" gutterBottom>
      {excerpt}
    </Typography>
  );

  const renderAuthor = <Typography variant="subtitle1">{author}</Typography>;

  const renderBlogInfo = (
    <Typography variant="body2" color="textSecondary" gutterBottom>
      {useDayjs(date).format('LL')} - {t('blogs:readTime', { minutesToRead })}
    </Typography>
  );

  const renderImage = <Image src={coverImage} layout="responsive" width={400} height={300} />;

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: title,
      hideLanguageButton: true,
    },
    content,
  };

  return (
    <MarkdownTemplate {...layoutProps}>
      {renderExcerpt}
      {renderAuthor}
      {renderBlogInfo}
      {renderImage}
    </MarkdownTemplate>
  );
};

interface GetStaticPathsParams {
  locales: string[];
}

export const getStaticPaths = async ({
  locales,
}: GetStaticPathsParams): Promise<GetStaticPathsResult<{ slug: string }>> => {
  const fileNames = readdirSync('markdown/en/blogs');

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
  const _ns = await loadNamespaces(['blogs'], locale);
  const { data, content } = await loadMarkdown(`blogs/${slug}`);

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

export default withUserMe(BlogPostPage);
