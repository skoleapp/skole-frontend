import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
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
import { ButtonLink, LanguageButton, MainBackground, MainTemplate } from 'components';
import { useAuthContext, useShareContext } from 'context';
import { withUserMe } from 'hocs';
import { useSearch } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { BORDER_RADIUS, COLORS } from 'theme';
import { ButtonVariant, MuiColor, TextColor, TextVariant } from 'types';
import { UrlObject } from 'url';
import { GET_STARTED_PAGE_VISITED_KEY, urls } from 'utils';

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
  nextStepsContainer: {
    position: 'relative',
    flexGrow: 1,
    backgroundColor: COLORS.backgroundGrey,
    paddingTop: spacing(6),
    paddingBottom: spacing(2),
    [breakpoints.up('md')]: {
      padding: spacing(4),
    },
  },
  nextStepsHeader: {
    fontSize: '1.75rem',
  },
  nextStepsContent: {
    marginTop: spacing(4),
  },
  nextStepsCard: {
    minHeight: '12rem',
    height: '100%',
    flexGrow: 1,
    backgroundColor: palette.grey[200],
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'none',
    border: `0.15rem solid ${palette.grey[400]}`,
    borderRadius: '1rem',
  },
  nextStepsCardContent: {
    flexGrow: 1,
  },
  nextStepsCardText: {
    fontSize: '1.1rem',
  },
  nextStepsButton: {
    borderRadius: '1rem',
  },
}));

interface Shortcut {
  text: string;
  icon: SvgIconComponent;
  href: string | UrlObject;
}

const IndexPage: NextPage = () => {
  const classes = useStyles();
  const { userMe, verified } = useAuthContext();
  const { t } = useTranslation();
  const { handleOpenShareDialog } = useShareContext();
  const { searchUrl, searchInputProps, handleSubmitSearch } = useSearch();
  const shareTitle = `Skole | ${t('marketing:slogan')}`;
  const shareText = t('marketing:description');
  const shareParams = { shareHeader: t('index:inviteText'), shareTitle, shareText };
  const handleClickShareButton = () => handleOpenShareDialog(shareParams);

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
      text: 'index:addCourses',
      icon: SchoolOutlined,
      href: urls.addCourse,
    },
  ];

  const renderBackground = <MainBackground />;
  const renderLanguageButton = <LanguageButton />;

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

  const nextStepsCardTextProps = {
    className: classes.nextStepsCardText,
    variant: 'body2' as TextVariant,
    color: 'textSecondary' as TextColor,
  };

  const nextStepButtonProps = {
    className: classes.nextStepsButton,
    color: 'primary' as MuiColor,
    variant: 'outlined' as ButtonVariant,
    fullWidth: true,
    endIcon: <ArrowForwardOutlined />,
  };

  const renderInviteStep = (
    <Grid item xs={12} sm={4}>
      <Card className={classes.nextStepsCard}>
        <CardContent className={classes.nextStepsCardContent}>
          <Typography {...nextStepsCardTextProps}>{t('index:inviteHeader')}</Typography>
        </CardContent>
        <CardActions>
          <Button {...nextStepButtonProps} onClick={handleClickShareButton}>
            {t('index:inviteText')}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

  const renderTakeATourStep = (
    <Grid item xs={12} sm={4}>
      <Card className={classes.nextStepsCard}>
        <CardContent className={classes.nextStepsCardContent}>
          <Typography {...nextStepsCardTextProps}>{t('index:takeATourHeader')}</Typography>
        </CardContent>
        <CardActions>
          <ButtonLink {...nextStepButtonProps} href={urls.contact}>
            {t('index:takeATourText')}
          </ButtonLink>
        </CardActions>
      </Card>
    </Grid>
  );

  const renderVerifyStep = (
    <Grid item xs={12} sm={4}>
      <Card className={classes.nextStepsCard}>
        <CardContent className={classes.nextStepsCardContent}>
          <Typography {...nextStepsCardTextProps}>{t('index:verifyAccountHeader')}</Typography>
        </CardContent>
        <CardActions>
          <ButtonLink {...nextStepButtonProps} href={urls.contact}>
            {t('index:verifyAccountText')}
          </ButtonLink>
        </CardActions>
      </Card>
    </Grid>
  );

  const renderCompleteProfileStep = (
    <Grid item xs={12} sm={4}>
      <Card className={classes.nextStepsCard}>
        <CardContent className={classes.nextStepsCardContent}>
          <Typography {...nextStepsCardTextProps}>{t('index:completeProfileHeader')}</Typography>
        </CardContent>
        <CardActions>
          <ButtonLink {...nextStepButtonProps} href={urls.contact}>
            {t('index:completeProfileText')}
          </ButtonLink>
        </CardActions>
      </Card>
    </Grid>
  );

  // Render different content for these cases:
  // * User is not authenticated -> link to landing page.
  // * User is authenticated by not verified -> link to account verification.
  // * User is authenticated and verified -> link to edit profile page.
  const renderDynamicStep = !userMe
    ? renderTakeATourStep
    : verified === false
    ? renderVerifyStep
    : renderCompleteProfileStep;

  const renderContactStep = (
    <Grid item xs={12} sm={4}>
      <Card className={classes.nextStepsCard}>
        <CardContent className={classes.nextStepsCardContent}>
          <Typography {...nextStepsCardTextProps}>{t('index:contactHeader')}</Typography>
        </CardContent>
        <CardActions>
          <ButtonLink {...nextStepButtonProps} href={urls.contact}>
            {t('index:contactText')}
          </ButtonLink>
        </CardActions>
      </Card>
    </Grid>
  );

  const renderInfo = (
    <Grid
      className={classes.nextStepsContainer}
      container
      direction="column"
      alignItems="center"
      justify="center"
    >
      <Typography className={classes.nextStepsHeader} variant="h2" color="textSecondary">
        {t('index:nextStepsHeader')} 🚀
      </Typography>
      <Grid
        className={classes.nextStepsContent}
        item
        xs={12}
        md={8}
        lg={6}
        xl={4}
        container
        spacing={4}
      >
        {renderInviteStep}
        {renderDynamicStep}
        {renderContactStep}
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
