import Box from '@material-ui/core/Box';
import Button, { ButtonProps } from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import TableFooter from '@material-ui/core/TableFooter';
import Tooltip from '@material-ui/core/Tooltip';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import {
  ButtonLink,
  Emoji,
  ErrorTemplate,
  LandingPageTemplate,
  Link,
  LoadingTemplate,
  SettingsButton,
  TrendingTable,
} from 'components';
import { useAuthContext, useShareContext } from 'context';
import { useTrendingCommentsQuery } from 'generated';
import { withUserMe } from 'hocs';
import { useLanguageHeaderContext, useSearch } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'styles';
import { SeoPageProps } from 'types';
import { urls } from 'utils';

const useStyles = makeStyles(({ palette, spacing, breakpoints }) => ({
  topSectionContainer: {
    paddingLeft: `calc(env(safe-area-inset-left) + ${spacing(4)})`,
    paddingRight: `calc(env(safe-area-inset-right) + ${spacing(4)})`,
    marginTop: spacing(4),
    textAlign: 'center',
    [breakpoints.up('sm')]: {
      marginTop: spacing(10),
    },
    [breakpoints.up('md')]: {
      marginTop: spacing(8),
    },
  },
  header: {
    fontSize: '1rem',
    [breakpoints.up('xs')]: {
      fontSize: '1.25rem',
    },
    [breakpoints.up('sm')]: {
      fontSize: '1.5rem',
    },
    [breakpoints.up('md')]: {
      fontSize: '2rem',
    },
  },
  subheader: {
    fontSize: '0.75rem',
    [breakpoints.up('xs')]: {
      fontSize: '1rem',
    },
    [breakpoints.up('sm')]: {
      fontSize: '1.25rem',
    },
  },
  searchForm: {
    marginTop: spacing(4),
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  searchFieldBox: {
    display: 'flex',
    flexGrow: 1,
    backgroundColor: palette.background.default,
    border: `0.05rem solid ${
      palette.type === 'dark' ? palette.secondary.main : palette.primary.main
    }`,
    borderRadius: `${BORDER_RADIUS} 0 0 ${BORDER_RADIUS}`,
    padding: spacing(3),
  },
  searchFieldInput: {
    [breakpoints.down('xs')]: {
      fontSize: '0.82rem', // Make the text fit exactly on iPhone SE on the top of the search page.
    },
  },
  searchButton: {
    borderRadius: `0 ${BORDER_RADIUS} ${BORDER_RADIUS} 0`,
  },
  midSectionContainer: {
    marginTop: spacing(2),
    paddingTop: spacing(4),
    paddingBottom: spacing(4),
    paddingLeft: `calc(env(safe-area-inset-left) + ${spacing(2)})`,
    paddingRight: `calc(env(safe-area-inset-right) + ${spacing(2)})`,
  },
  trendingPaper: {
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    margin: spacing(2),
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  trendingTableContainer: {
    flexGrow: 1,
  },
  trendingCardHeader: {
    borderBottom: BORDER,
    color: palette.text.secondary,
  },
  trendingTableFooter: {
    height: '3rem',
  },
  nextStepsContainer: {
    flexGrow: 1,
    backgroundColor: palette.type === 'dark' ? palette.background.default : palette.grey[300],
    paddingTop: spacing(6),
    paddingLeft: spacing(2),
    paddingRight: spacing(2),
    paddingBottom: spacing(4),
  },
  nextStepsHeader: {
    fontSize: '1.75rem',
  },
  nextStepsContent: {
    marginTop: spacing(4),
  },
  nextStepsCard: {
    height: '100%',
    flexGrow: 1,
    backgroundColor: palette.background.paper,
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

const HomePage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const classes = useStyles();
  const { userMe, verified, school, subject } = useAuthContext();
  const { t } = useTranslation();
  const { handleOpenShareDialog } = useShareContext();
  const { searchInputProps, handleSubmitSearch } = useSearch();
  const context = useLanguageHeaderContext();
  const headerText = t('common:description');
  const trendingHeaderText = t('common:trending');
  const nextStepsHeaderText = t('home:nextStepsHeader');

  const ShareDialogParams = {
    header: t('home:inviteText'),
    title: 'Skole',
    text: `${t('common:description')} 🎓`,
    customLink: process.env.FRONTEND_URL,
  };

  const handleClickShareButton = (): void => handleOpenShareDialog(ShareDialogParams);

  const { data, loading, error } = useTrendingCommentsQuery({
    context,
  });

  const trendingComments = R.propOr([], 'trendingComments', data);

  const renderLaunchIconButton = !userMe && (
    <Link href={urls.index}>
      <Tooltip title="Vrooom!">
        <IconButton size="small">
          <Emoji emoji="🚀" noSpace />
        </IconButton>
      </Tooltip>
    </Link>
  );

  const renderSettingsButton = !userMe && <SettingsButton />;
  const renderHeaderEmoji = <Emoji emoji="🎓" />;
  const renderTrendingEmoji = <Emoji emoji="🔥" />;
  const renderNextStepsEmoji = <Emoji emoji="🚀" />;

  const renderHeader = (
    <Typography className={classes.header} variant="h1" color="secondary" gutterBottom>
      {headerText}
      {renderHeaderEmoji}
    </Typography>
  );

  const renderSubHeader = (
    <Typography className={classes.subheader} variant="subtitle1" color="secondary">
      {t('home:subheader')}
    </Typography>
  );

  const renderSearchField = (
    <form className={classes.searchForm} onSubmit={handleSubmitSearch}>
      <Box className={classes.searchFieldBox}>
        <InputBase {...searchInputProps} className={classes.searchFieldInput} />
      </Box>
      <Button className={classes.searchButton} type="submit" variant="contained">
        <SearchOutlined />
      </Button>
    </form>
  );

  const renderSearch = (
    <Grid className={classes.topSectionContainer} container justify="center">
      <Grid item xs={12} xl={8}>
        {renderHeader}
        {renderSubHeader}
        {renderSearchField}
      </Grid>
    </Grid>
  );

  const renderTrendingTableFooter = <TableFooter className={classes.trendingTableFooter} />;

  const trendingHeader = (
    <>
      {trendingHeaderText}
      {renderTrendingEmoji}
    </>
  );

  const renderMidSection = (
    <Grid className={classes.midSectionContainer} container justify="center">
      <Grid item xs={12} xl={8} container justify="center">
        <Paper className={classes.trendingPaper}>
          <CardHeader className={classes.trendingCardHeader} title={trendingHeader} />
          <TrendingTable
            trendingComments={trendingComments}
            renderTableFooter={renderTrendingTableFooter}
            tableContainerProps={{ className: classes.trendingTableContainer }}
          />
        </Paper>
      </Grid>
    </Grid>
  );

  const nextStepsCardTextProps: TypographyProps = {
    className: classes.nextStepsCardText,
    variant: 'body2',
    color: 'textSecondary',
  };

  const nextStepButtonProps: ButtonProps = {
    className: classes.nextStepsButton,
    variant: 'outlined',
    endIcon: <ArrowForwardOutlined />,
  };

  const renderInviteStep = (
    <Grid item xs={12} md={4}>
      <Card className={classes.nextStepsCard}>
        <CardContent className={classes.nextStepsCardContent}>
          <Typography {...nextStepsCardTextProps}>{t('home:inviteHeader')}</Typography>
        </CardContent>
        <CardActions>
          <Button {...nextStepButtonProps} onClick={handleClickShareButton} fullWidth>
            {t('home:inviteText')}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

  const renderTakeATourStep = !userMe && (
    <Grid item xs={12} md={4}>
      <Card className={classes.nextStepsCard}>
        <CardContent className={classes.nextStepsCardContent}>
          <Typography {...nextStepsCardTextProps}>{t('home:takeATourHeader')}</Typography>
        </CardContent>
        <CardActions>
          <ButtonLink {...nextStepButtonProps} href={urls.index} fullWidth>
            {t('home:takeATourText')}
          </ButtonLink>
        </CardActions>
      </Card>
    </Grid>
  );

  const renderVerifyStep = verified === false && (
    <Grid item xs={12} md={4}>
      <Card className={classes.nextStepsCard}>
        <CardContent className={classes.nextStepsCardContent}>
          <Typography {...nextStepsCardTextProps}>{t('home:verifyAccountHeader')}</Typography>
        </CardContent>
        <CardActions>
          <ButtonLink {...nextStepButtonProps} href={urls.verifyAccount} fullWidth>
            {t('home:verifyAccountText')}
          </ButtonLink>
        </CardActions>
      </Card>
    </Grid>
  );

  const renderAddSchoolAndSubjectStep = (!school || !subject) && (
    <Grid item xs={12} md={4}>
      <Card className={classes.nextStepsCard}>
        <CardContent className={classes.nextStepsCardContent}>
          <Typography {...nextStepsCardTextProps}>{t('home:addSchoolAndSubjectHeader')}</Typography>
        </CardContent>
        <CardActions>
          <ButtonLink {...nextStepButtonProps} href={urls.editProfile} fullWidth>
            {t('home:addSchoolAndSubjectText')}
          </ButtonLink>
        </CardActions>
      </Card>
    </Grid>
  );

  const renderUploadStep = (
    <Grid item xs={12} md={4}>
      <Card className={classes.nextStepsCard}>
        <CardContent className={classes.nextStepsCardContent}>
          <Typography {...nextStepsCardTextProps}>{t('home:uploadHeader')}</Typography>
        </CardContent>
        <CardActions>
          <ButtonLink {...nextStepButtonProps} href={urls.uploadMaterial} fullWidth>
            {t('home:uploadText')}
          </ButtonLink>
        </CardActions>
      </Card>
    </Grid>
  );

  // Render different content for these cases:
  // - User is not authenticated -> link to landing page.
  // - User is authenticated by not verified -> link to account verification.
  // - User is verified but not filled school or subject -> link to edit profile page.
  // - User has completed all other steps -> link to upload resource page.
  const renderDynamicStep =
    renderTakeATourStep || renderVerifyStep || renderAddSchoolAndSubjectStep || renderUploadStep;

  const renderContactStep = (
    <Grid item xs={12} md={4}>
      <Card className={classes.nextStepsCard}>
        <CardContent className={classes.nextStepsCardContent}>
          <Typography {...nextStepsCardTextProps}>{t('home:contactHeader')}</Typography>
        </CardContent>
        <CardActions>
          <ButtonLink {...nextStepButtonProps} href={urls.contact} fullWidth>
            {t('home:contactText')}
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
        {nextStepsHeaderText}
        {renderNextStepsEmoji}
      </Typography>
      <Grid className={classes.nextStepsContent} item xs={12} xl={8} container spacing={4}>
        {renderInviteStep}
        {renderDynamicStep}
        {renderContactStep}
      </Grid>
    </Grid>
  );

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      hideBackButton: true,
      renderHeaderLeft: renderLaunchIconButton,
      renderHeaderRight: renderSettingsButton,
    },
    hideBottomNavbar: false,
    hideLogo: true,
    hideAppStoreBadges: true,
  };

  if (loading) {
    return <LoadingTemplate seoProps={seoProps} />;
  }

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" seoProps={seoProps} />;
  }

  if (error) {
    return <ErrorTemplate variant="error" seoProps={seoProps} />;
  }

  return (
    <LandingPageTemplate {...layoutProps}>
      {renderSearch}
      {renderMidSection}
      {renderInfo}
    </LandingPageTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const tHome = await getT(locale, 'home');
  const tCommon = await getT(locale, 'common');

  return {
    props: {
      _ns: await loadNamespaces(['home'], locale),
      seoProps: {
        title: tHome('title'),
        description: tCommon('description'),
      },
    },
  };
};

export default withUserMe(HomePage);
