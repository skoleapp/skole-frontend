import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import { ListTemplate } from 'components';
import { readdirSync } from 'fs';
import { withUserMe } from 'hocs';
import { useDayjs } from 'hooks';
import { getT, loadMarkdown, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { MarkdownPageData, SeoPageProps } from 'types';
import { urls } from 'utils';

interface Props extends SeoPageProps {
  blogs: MarkdownPageData[];
}

const BlogsPage: NextPage<Props> = ({ seoProps, blogs }) => {
  const { t } = useTranslation();

  const mapBlogs = blogs.map(
    ({ title, excerpt, coverImage = '', author, date, minutesToRead = 0, slug = '' }, i) => (
      <Link href={urls.blog(slug)}>
        <ListItem key={i} button>
          <Grid container spacing={4}>
            <Grid item xs={9}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">{author}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h5">{title}</Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {excerpt}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container>
                <Typography variant="body2" color="textSecondary">
                  {useDayjs(date).format('LL')} - {t('blogs:readTime', { minutesToRead })}
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

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: t('blogs:header'),
      emoji: '📃',
    },
  };

  return (
    <ListTemplate {...layoutProps}>
      <TableBody>{mapBlogs}</TableBody>
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
