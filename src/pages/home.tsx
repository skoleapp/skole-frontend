import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import TableFooter from '@material-ui/core/TableFooter';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { ChatOutlined } from '@material-ui/icons';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import AssignmentOutlined from '@material-ui/icons/AssignmentOutlined';
import CloudUploadOutlined from '@material-ui/icons/CloudUploadOutlined';
import SchoolOutlined from '@material-ui/icons/SchoolOutlined';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import clsx from 'clsx';
import {
  ButtonLink,
  Emoji,
  ErrorTemplate,
  LandingPageTemplate,
  LoadingTemplate,
  SettingsButton,
  SuggestionsTable,
} from 'components';
import { useAuthContext, useShareContext } from 'context';
import { useSuggestionsPreviewQuery } from 'generated';
import { withUserMe } from 'hocs';
import { useLanguageHeaderContext, useMediaQueries, useSearch } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Link from 'next/link';
import * as R from 'ramda';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'theme';
import { ButtonVariant, MuiColor, SeoPageProps, TextColor, TextVariant } from 'types';
import { UrlObject } from 'url';
import { urls } from 'utils';

const useStyles = makeStyles(({ palette, spacing, breakpoints }) => ({
  searchContainer: {
    paddingLeft: `calc(env(safe-area-inset-left) + ${spacing(4)})`,
    paddingRight: `calc(env(safe-area-inset-right) + ${spacing(4)})`,
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
    backgroundColor: palette.common.white,
    border: `0.05rem solid ${palette.primary.main}`,
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
    paddingTop: spacing(4),
    paddingBottom: spacing(4),
    paddingLeft: `calc(env(safe-area-inset-left) + ${spacing(2)})`,
    paddingRight: `calc(env(safe-area-inset-right) + ${spacing(2)})`,
  },
  shortcut: {
    padding: spacing(2),
  },
  card: {
    flexGrow: 1,
    display: 'flex',
  },
  cardActionArea: {
    flexGrow: 1,
    borderRadius: BORDER_RADIUS,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortcutText: {
    fontSize: '1.25rem',
    [breakpoints.down('md')]: {
      marginLeft: spacing(4),
    },
    [breakpoints.up('md')]: {
      marginTop: spacing(2),
      fontSize: '1.5rem',
    },
  },
  shortcutArrow: {
    marginLeft: spacing(2),
  },
  avatar: {
    height: '2.5rem',
    width: '2.5rem',
    backgroundColor: palette.primary.light,
    [breakpoints.up('md')]: {
      height: '3.5rem',
      width: '3.5rem',
    },
  },
  avatarIcon: {
    height: '1.5rem',
    width: '1.5rem',
    [breakpoints.up('md')]: {
      height: '2rem',
      width: '2rem',
    },
  },
  suggestionsPaper: {
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    margin: spacing(2),
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  suggestionsTableContainer: {
    flexGrow: 1,
  },
  suggestionsCardHeader: {
    borderBottom: BORDER,
    color: palette.text.secondary,
  },
  suggestionsTableFooter: {
    padding: spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
  nextStepsContainer: {
    flexGrow: 1,
    backgroundColor: palette.grey[300],
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
  icon: typeof SvgIcon;
  href: string | UrlObject;
}

const HomePage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const classes = useStyles();
  const { userMe, verified, school, subject } = useAuthContext();
  const { isMobile } = useMediaQueries();
  const { t } = useTranslation();
  const { handleOpenShareDialog } = useShareContext();
  const { searchUrl, searchInputProps, handleSubmitSearch } = useSearch();
  const context = useLanguageHeaderContext();
  const headerText = t('common:description');
  const suggestionsHeaderText = t('home:suggestionsHeader');
  const nextStepsHeaderText = t('home:nextStepsHeader');

  const ShareDialogParams = {
    header: t('home:inviteText'),
    title: 'Skole',
    text: `${t('common:description')} 🎓`,
    customLink: process.env.FRONTEND_URL,
  };

  const handleClickShareButton = () => handleOpenShareDialog(ShareDialogParams);

  const { data, loading, error } = useSuggestionsPreviewQuery({
    context,
  });

  const suggestions = R.propOr([], 'suggestionsPreview', data);

  const shortcuts = [
    {
      text: 'common:addComment',
      icon: ChatOutlined,
      href: urls.addComment,
    },
    {
      text: 'common:findContent',
      icon: AssignmentOutlined,
      href: searchUrl,
    },
    {
      text: 'common:uploadMaterial',
      icon: CloudUploadOutlined,
      href: urls.uploadResource,
    },
    {
      text: 'common:addCourses',
      icon: SchoolOutlined,
      href: urls.addCourse,
    },
  ];

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
  const renderSuggestionsEmoji = <Emoji emoji="🔥" />;
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
      <Button className={classes.searchButton} type="submit" color="primary" variant="contained">
        <SearchOutlined />
      </Button>
    </form>
  );

  const renderSearch = (
    <Grid className={classes.searchContainer} container justify="center">
      <Grid item xs={12} lg={10} xl={7}>
        {renderHeader}
        {renderSubHeader}
        {renderSearchField}
      </Grid>
    </Grid>
  );

  const renderArrow = isMobile && (
    <ArrowForwardOutlined className={classes.shortcutArrow} color="primary" />
  );

  const mapShortcuts = shortcuts.map(({ href, text, icon: Icon }: Shortcut, i: number) => (
    <Grid className={classes.shortcut} item xs={12} key={i} container>
      <Link href={href}>
        <Card className={clsx(classes.card)}>
          <CardActionArea className={classes.cardActionArea}>
            <CardContent className={classes.cardContent}>
              <Grid container direction={isMobile ? 'row' : 'column'} alignItems="center">
                <Avatar className={clsx(classes.avatar)}>
                  <Icon className={classes.avatarIcon} />
                </Avatar>
                <Typography
                  className={classes.shortcutText}
                  variant="subtitle1"
                  color="primary"
                  align="center"
                >
                  <Grid container alignItems="center">
                    {t(text)} {renderArrow}
                  </Grid>
                </Typography>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      </Link>
    </Grid>
  ));

  const renderShortcuts = (
    <Grid item xs={12} md={4} lg={3} container>
      {mapShortcuts}
    </Grid>
  );

  const renderSuggestionsTableFooter = (
    <TableFooter className={classes.suggestionsTableFooter}>
      <ButtonLink
        href={urls.suggestions}
        color="primary"
        endIcon={<ArrowForwardOutlined />}
        fullWidth
      >
        {t('common:seeAll')}
      </ButtonLink>
    </TableFooter>
  );

  const suggestionsHeader = (
    <>
      {suggestionsHeaderText}
      {renderSuggestionsEmoji}
    </>
  );

  const renderSuggestionsPreview = (
    <Grid item xs={12} md={8} lg={9} container>
      <Paper className={classes.suggestionsPaper}>
        <CardHeader className={classes.suggestionsCardHeader} title={suggestionsHeader} />
        <SuggestionsTable
          suggestions={suggestions}
          renderTableFooter={renderSuggestionsTableFooter}
          tableContainerProps={{ className: classes.suggestionsTableContainer }}
          dense
        />
      </Paper>
    </Grid>
  );

  const renderMidSection = (
    <Grid className={classes.midSectionContainer} container justify="center">
      <Grid item xs={12} lg={10} xl={7} container justify="center">
        {renderShortcuts}
        {renderSuggestionsPreview}
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
    <Grid item xs={12} md={4}>
      <Card className={classes.nextStepsCard}>
        <CardContent className={classes.nextStepsCardContent}>
          <Typography {...nextStepsCardTextProps}>{t('home:inviteHeader')}</Typography>
        </CardContent>
        <CardActions>
          <Button {...nextStepButtonProps} onClick={handleClickShareButton}>
            {t('home:inviteText')}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );

  const renderTakeATourStep = (
    <Grid item xs={12} md={4}>
      <Card className={classes.nextStepsCard}>
        <CardContent className={classes.nextStepsCardContent}>
          <Typography {...nextStepsCardTextProps}>{t('home:takeATourHeader')}</Typography>
        </CardContent>
        <CardActions>
          <ButtonLink {...nextStepButtonProps} href={urls.index}>
            {t('home:takeATourText')}
          </ButtonLink>
        </CardActions>
      </Card>
    </Grid>
  );

  const renderVerifyStep = (
    <Grid item xs={12} md={4}>
      <Card className={classes.nextStepsCard}>
        <CardContent className={classes.nextStepsCardContent}>
          <Typography {...nextStepsCardTextProps}>{t('home:verifyAccountHeader')}</Typography>
        </CardContent>
        <CardActions>
          <ButtonLink {...nextStepButtonProps} href={urls.verifyAccount}>
            {t('home:verifyAccountText')}
          </ButtonLink>
        </CardActions>
      </Card>
    </Grid>
  );

  const renderAddSchoolAndSubjectStep = (
    <Grid item xs={12} md={4}>
      <Card className={classes.nextStepsCard}>
        <CardContent className={classes.nextStepsCardContent}>
          <Typography {...nextStepsCardTextProps}>{t('home:addSchoolAndSubjectHeader')}</Typography>
        </CardContent>
        <CardActions>
          <ButtonLink {...nextStepButtonProps} href={urls.editProfile}>
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
          <ButtonLink {...nextStepButtonProps} href={urls.uploadResource}>
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
  const renderDynamicStep = !userMe
    ? renderTakeATourStep
    : verified === false
    ? renderVerifyStep
    : !school || !subject
    ? renderAddSchoolAndSubjectStep
    : renderUploadStep;

  const renderContactStep = (
    <Grid item xs={12} md={4}>
      <Card className={classes.nextStepsCard}>
        <CardContent className={classes.nextStepsCardContent}>
          <Typography {...nextStepsCardTextProps}>{t('home:contactHeader')}</Typography>
        </CardContent>
        <CardActions>
          <ButtonLink {...nextStepButtonProps} href={urls.contact}>
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
      <Grid className={classes.nextStepsContent} item xs={12} lg={10} xl={7} container spacing={4}>
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
