import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { ButtonLink, EmailSubscription, GuestAuthorLink, MarkdownTemplate } from 'components';
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
  authorImage: {
    borderRadius: '50%',
    padding: '0.4rem !important',
  },
  coverImage: {
    marginBottom: `${spacing(2)} !important`,
  },
  emailSubscription: {
    marginTop: spacing(16),
  },
}));

const BlogPostPage: NextPage<MarkdownPageProps> = ({
  seoProps,
  data: { title, excerpt, coverImage = '', author, authorImage, date, minutesToRead = 0 },
  content: markdownContent,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { userMe, blogPostEmailPermission } = useAuthContext();

  const renderExcerpt = (
    <Typography variant="h5" color="textSecondary" gutterBottom>
      {excerpt}
    </Typography>
  );

  const renderAuthorImage = !!authorImage && (
    <Image
      className={classes.authorImage}
      src={authorImage}
      layout="fixed"
      width={50}
      height={50}
    />
  );

  const renderBlogInfo = (
    <Grid container alignItems="center" wrap="nowrap" spacing={2}>
      <Grid item>{renderAuthorImage}</Grid>
      <Grid item>
        <Typography variant="body2">{author}</Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {useDayjs(date).format('LL')} - {t('blogs:readTime', { minutesToRead })}
        </Typography>
      </Grid>
    </Grid>
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
      <EmailSubscription header={t('blogs:emailSubscriptionHeader')} />
    </Box>
  );

  const renderSubscribeButton = !!userMe && !blogPostEmailPermission && (
    <Grid className={classes.emailSubscription} container justify="center">
      <ButtonLink variant="outlined" href={urls.accountSettings} endIcon={<ArrowForwardOutlined />}>
        {t('blogs:subscribeButtonText')}
      </ButtonLink>
    </Grid>
  );

  const renderGuestAuthorLink = <GuestAuthorLink />;

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: title,
      hideLanguageButton: true,
    },
    customTopContent: [renderExcerpt, renderBlogInfo, renderCoverImage],
    markdownContent,
    customBottomContent: [renderEmailSubscription || renderSubscribeButton, renderGuestAuthorLink],
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
