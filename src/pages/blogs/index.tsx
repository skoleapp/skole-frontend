import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { ButtonLink, EmailSubscription, GuestAuthorLink, Link, ListTemplate } from 'components';
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

const useStyles = makeStyles({
  authorImage: {
    borderRadius: '50%',
    padding: '0.4rem !important',
  },
});

interface Props extends SeoPageProps {
  blogs: MarkdownPageData[];
}

const BlogsPage: NextPage<Props> = ({ seoProps, blogs }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { userMe, blogPostEmailPermission } = useAuthContext();

  const sortedBlogs: MarkdownPageData[] = R.sortBy(R.prop('date'), blogs).reverse();

  const renderAuthorImage = (authorImage: string) => (
    <Image
      className={classes.authorImage}
      src={authorImage}
      layout="fixed"
      width={50}
      height={50}
    />
  );

  const mapBlogs = sortedBlogs.map(
    (
      {
        title,
        excerpt,
        coverImage = '',
        author,
        authorImage = '',
        date,
        minutesToRead = 0,
        slug = '',
      },
      i,
    ) => (
      <Link href={urls.blog(slug)} fullWidth>
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
              <Grid container alignItems="center" wrap="nowrap" spacing={2}>
                <Grid item>{renderAuthorImage(authorImage)}</Grid>
                <Grid item>
                  <Typography variant="body2">{author}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {useDayjs(date).format('LL')} - {t('blogs:readTime', { minutesToRead })}
                  </Typography>
                </Grid>
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

  const renderBlogs = <TableBody>{mapBlogs}</TableBody>;

  const renderEmailSubscription = !userMe && (
    <EmailSubscription header={t('blogs:emailSubscriptionHeader')} />
  );

  const renderSubscribeButton = !!userMe && !blogPostEmailPermission && (
    <Grid container justify="center">
      <ButtonLink variant="outlined" href={urls.accountSettings} endIcon={<ArrowForwardOutlined />}>
        {t('blogs:subscribeButtonText')}
      </ButtonLink>
    </Grid>
  );

  const renderGuestAuthorLink = <GuestAuthorLink />;

  const renderBottomContent = (
    <CardContent>
      {renderEmailSubscription || renderSubscribeButton}
      {renderGuestAuthorLink}
    </CardContent>
  );

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: t('blogs:header'),
      emoji: '📃',
    },
  };

  return (
    <ListTemplate {...layoutProps}>
      {renderBlogs}
      {renderBottomContent}
    </ListTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const _ns = await loadNamespaces(['blogs'], locale);
  const t = await getT(locale, 'blogs');

  const seoProps = {
    title: t('title'),
    description: t('description'),
  };

  const fileNames = readdirSync('markdown/en/blogs');
  const blogs = [];

  for (const fileName of fileNames) {
    const slug = fileName.replace(/\.md$/, '');
    const { data } = await loadMarkdown(`blogs/${slug}`);
    blogs.push(data);
  }

  return {
    props: {
      _ns,
      seoProps,
      blogs,
    },
  };
};

export default withUserMe(BlogsPage);
