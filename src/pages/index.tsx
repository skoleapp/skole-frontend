import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  InputBase,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {
  ArrowForwardOutlined,
  AssignmentOutlined,
  CloudUploadOutlined,
  SchoolOutlined,
  SearchOutlined,
  SvgIconComponent,
} from '@material-ui/icons';
import clsx from 'clsx';
import { MainBackground, MainTemplate } from 'components';
import { withUserMe } from 'hocs';
import { useLanguageSelector, useSearch, useShare } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { BORDER_RADIUS, COLORS } from 'theme';
import { UrlObject } from 'url';
import { urls } from 'utils';

const useStyles = makeStyles(({ palette, spacing, breakpoints }) => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  searchContainer: {
    position: 'relative',
    padding: spacing(6),
    paddingLeft: `calc(env(safe-area-inset-left) + ${spacing(6)})`,
    paddingRight: `calc(env(safe-area-inset-right) + ${spacing(6)})`,
    marginTop: spacing(4),
    textAlign: 'center',
    [breakpoints.up('sm')]: {
      marginTop: spacing(10),
    },
    [breakpoints.up('md')]: {
      marginTop: spacing(16),
    },
  },
  header: {
    fontSize: '2rem',
    [breakpoints.up('md')]: {
      fontSize: '2.5rem',
    },
  },
  subheader: {
    fontSize: '1.25rem',
  },
  searchForm: {
    marginTop: spacing(4),
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  searchField: {
    display: 'flex',
    flexGrow: 1,
    backgroundColor: palette.common.white,
    border: `0.05rem solid ${palette.primary.main}`,
    borderRadius: `${BORDER_RADIUS} 0 0 ${BORDER_RADIUS}`,
    padding: spacing(3),
    [breakpoints.up('md')]: {
      maxWidth: '20rem',
    },
  },
  searchButton: {
    borderRadius: `0 ${BORDER_RADIUS} ${BORDER_RADIUS} 0`,
  },
  shortcutsContainer: {
    position: 'relative',
    padding: `${spacing(4)} ${spacing(2)}`,
    paddingLeft: `calc(env(safe-area-inset-left) + ${spacing(2)})`,
    paddingRight: `calc(env(safe-area-inset-right) + ${spacing(2)})`,
    flexGrow: 1,
  },
  card: {
    width: '100%',
    minHeight: '14rem',
    position: 'relative',
    margin: spacing(2),
    [breakpoints.up('md')]: {
      width: '16rem',
      height: '16rem',
    },
  },
  cardActionArea: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderRadius: BORDER_RADIUS,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortcutText: {
    fontSize: '1.5rem',
  },
  avatar: {
    height: '5rem',
    width: '5rem',
    margin: spacing(2),
    marginBottom: spacing(4),
    backgroundColor: palette.primary.light,
  },
  avatarIcon: {
    height: '3rem',
    width: '3rem',
  },
  inviteContainer: {
    position: 'relative',
    backgroundColor: COLORS.backgroundGrey,
    flexGrow: 1,
  },
  inviteContent: {
    padding: spacing(4),
    textAlign: 'center',
    [breakpoints.up('md')]: {
      padding: spacing(12),
    },
  },
  inviteButton: {
    marginTop: spacing(4),
  },
}));

interface Shortcut {
  text: string;
  icon: SvgIconComponent;
  href: string | UrlObject;
}

const IndexPage: NextPage = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { renderLanguageButton } = useLanguageSelector();
  const { handleShare } = useShare({});
  const { searchUrl, searchInputProps, handleSubmitSearch } = useSearch();

  const shortcuts = [
    {
      text: 'index:findContent',
      icon: AssignmentOutlined,
      href: searchUrl,
    },
    {
      text: 'index:uploadMaterial',
      icon: CloudUploadOutlined,
      href: urls.uploadResource,
    },
    {
      text: 'index:createCourses',
      icon: SchoolOutlined,
      href: urls.createCourse,
    },
  ];

  const renderBackground = <MainBackground />;

  const renderHeader = (
    <Typography className={classes.header} variant="h1" color="secondary" gutterBottom>
      {t('marketing:description')}
    </Typography>
  );

  const renderSubHeader = (
    <Typography className={classes.subheader} variant="subtitle1" color="secondary">
      {t('index:subheader')}
    </Typography>
  );

  const renderSearchField = (
    <form className={classes.searchForm} onSubmit={handleSubmitSearch}>
      <Box className={classes.searchField}>
        <InputBase {...searchInputProps} />
      </Box>
      <Button className={classes.searchButton} type="submit" color="primary" variant="contained">
        <SearchOutlined />
      </Button>
    </form>
  );

  const renderSearch = (
    <Grid className={classes.searchContainer} item container direction="column" alignItems="center">
      {renderHeader}
      {renderSubHeader}
      {renderSearchField}
    </Grid>
  );

  const renderHomepageShortcuts = shortcuts.map(
    ({ href, text, icon: Icon }: Shortcut, i: number) => (
      <Link href={href} key={i}>
        <Card className={clsx(classes.card)}>
          <CardActionArea className={classes.cardActionArea}>
            <CardContent className={classes.cardContent}>
              <Avatar className={clsx(classes.avatar)}>
                <Icon className={classes.avatarIcon} />
              </Avatar>
              <Typography
                className={classes.shortcutText}
                variant="subtitle1"
                color="textSecondary"
                align="center"
              >
                {t(text)}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Link>
    ),
  );

  const renderShortcuts = (
    <Grid
      item
      container
      justify="center"
      alignItems="center"
      className={classes.shortcutsContainer}
    >
      <Grid item container spacing={4} justify="center">
        {renderHomepageShortcuts}
      </Grid>
    </Grid>
  );

  const renderInfo = (
    <Grid className={classes.inviteContainer} container justify="center">
      <Grid
        className={classes.inviteContent}
        item
        container
        direction="column"
        alignItems="center"
        justify="center"
      >
        <Typography
          className={classes.subheader}
          variant="subtitle1"
          color="textSecondary"
          gutterBottom
        >
          {t('index:inviteHeader')}
        </Typography>
        <Button
          className={classes.inviteButton}
          onClick={handleShare}
          color="primary"
          variant="outlined"
          endIcon={<ArrowForwardOutlined />}
        >
          {t('index:inviteFriends')}
        </Button>
      </Grid>
    </Grid>
  );

  const layoutProps = {
    seoProps: {
      title: t('index:title'),
      description: t('marketing:description'),
    },
    topNavbarProps: {
      disableSearch: true,
      headerRight: renderLanguageButton,
    },
    containerProps: {
      fullWidth: true,
      dense: true,
    },
  };

  return (
    <MainTemplate {...layoutProps}>
      <Grid container direction="column" alignItems="center" className={classes.container}>
        {renderBackground}
        {renderSearch}
        {renderShortcuts}
        {renderInfo}
      </Grid>
    </MainTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['index'], locale),
  },
});

export default withUserMe(IndexPage);
