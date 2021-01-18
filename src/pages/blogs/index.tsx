import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TableBody from '@material-ui/core/TableBody';
import Typography from '@material-ui/core/Typography';
import { BackButton, MainTemplate } from 'components';
import { readdirSync } from 'fs';
import { withUserMe } from 'hocs';
import { useDayjs, useMediaQueries } from 'hooks';
import { loadMarkdown, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';
import { MarkdownPageData } from 'types';
import { urls } from 'utils';

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
}));

interface Props extends Record<string, unknown> {
  blogs: MarkdownPageData[];
}

const BlogsPage: NextPage<Props> = ({ blogs }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { isTabletOrDesktop } = useMediaQueries();
  const header = t('blogs:header');
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

  const mapBlogs = blogs.map(
    ({ title, excerpt, coverImage = '', author, date, minutesToRead = 0, slug = '' }, i) => (
      <Link href={urls.blog(slug)}>
        <ListItem key={i} button>
          <Grid container spacing={2}>
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
              <Image width={100} height={75} src={coverImage} />
            </Grid>
          </Grid>
        </ListItem>
      </Link>
    ),
  );

  const renderBlogs = <TableBody>{mapBlogs}</TableBody>;

  const layoutProps = {
    seoProps: {
      title: t('blogs:title'),
      description: t('blogs:description'),
      header,
    },
    topNavbarProps: {
      header,
      renderBackButton,
    },
  };

  return (
    <MainTemplate {...layoutProps}>
      <Paper className={classes.paper}>
        {renderCardHeader}
        {renderBlogs}
      </Paper>
    </MainTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const _ns = await loadNamespaces(['blogs'], locale);
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
      blogs,
    },
  };
};

export default withUserMe(BlogsPage);
