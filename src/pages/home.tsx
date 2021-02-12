import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button, { ButtonProps } from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import TableFooter from '@material-ui/core/TableFooter';
import Tooltip from '@material-ui/core/Tooltip';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import AssignmentOutlined from '@material-ui/icons/AssignmentOutlined';
import ChatOutlined from '@material-ui/icons/ChatOutlined';
import CloudUploadOutlined from '@material-ui/icons/CloudUploadOutlined';
import FiberNew from '@material-ui/icons/FiberNew';
import SchoolOutlined from '@material-ui/icons/SchoolOutlined';
import SearchOutlined from '@material-ui/icons/SearchOutlined';
import clsx from 'clsx';
import {
  ButtonLink,
  Emoji,
  ErrorTemplate,
  LandingPageTemplate,
  Link,
  LoadingTemplate,
  SettingsButton,
  SuggestionsTable,
  TextLink,
} from 'components';
import { useAuthContext, useShareContext } from 'context';
import { readdirSync } from 'fs';
import { useSuggestionsPreviewQuery } from 'generated';
import { withUserMe } from 'hocs';
import { useLanguageHeaderContext, useMediaQueries, useSearch } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { loadMarkdown } from 'markdown';
import { GetStaticProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { BORDER, BORDER_RADIUS } from 'styles';
import { MarkdownPageData, SeoPageProps } from 'types';
import { UrlObject } from 'url';
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
  updateCard: {
    backgroundColor: palette.background.paper,
    boxShadow: 'none',
    border: `0.15rem solid ${palette.grey[400]}`,
    borderRadius: '1rem',
  },
  newIcon: {
    width: '2rem',
    height: '2rem',
  },
  updateTitle: {
    margin: `0 ${spacing(2)}`,
  },
  updateCardContent: {
    padding: `${spacing(1)} ${spacing(2)} !important`,
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
    paddingTop: spacing(4),
    paddingBottom: spacing(4),
    paddingLeft: `calc(env(safe-area-inset-left) + ${spacing(2)})`,
    paddingRight: `calc(env(safe-area-inset-right) + ${spacing(2)})`,
  },
  shortcutCard: {
    display: 'flex',
    margin: spacing(2),
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
  shortcutTextContainer: {
    overflow: 'hidden',
  },
  blogContainer: {
    padding: spacing(2),
  },
  shortcutText: {
    fontSize: '1.25rem',
    flexGrow: 1,
    marginLeft: spacing(4),
  },
  shortcutArrow: {
    marginLeft: spacing(2),
    color: palette.text.secondary,
  },
  avatar: {
    height: '2.5rem',
    width: '2.5rem',
    backgroundColor: palette.type === 'dark' ? palette.secondary.main : palette.primary.main,
  },
  avatarIcon: {
    height: '1.5rem',
    width: '1.5rem',
  },
  blogCard: {
    margin: spacing(2),
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  blogCardContent: {
    marginTop: 'auto',
    padding: `${spacing(2)} !important`,
  },
  blogHeaderRoot: {
    borderBottom: BORDER,
  },
  blogHeaderTitle: {
    color: palette.text.secondary,
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

interface Props extends SeoPageProps {
  update: MarkdownPageData;
  blogs: MarkdownPageData[];
}

interface Shortcut {
  text: string;
  icon: typeof SvgIcon;
  href: string | UrlObject;
}

const HomePage: NextPage<Props> = ({ seoProps, update: { slug = '', title }, blogs }) => {
  const classes = useStyles();
  const { isTabletOrDesktop } = useMediaQueries();
  const { userMe, verified, school, subject } = useAuthContext();
  const { t } = useTranslation();
  const { handleOpenShareDialog } = useShareContext();
  const { searchUrl, searchInputProps, handleSubmitSearch } = useSearch();
  const context = useLanguageHeaderContext();
  const headerText = t('common:description');
  const suggestionsHeaderText = t('common:suggestions');
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
      text: 'common:startDiscussion',
      icon: ChatOutlined,
      href: urls.addComment,
    },
    {
      text: 'common:findContent',
      icon: AssignmentOutlined,
      href: searchUrl,
    },
    {
      text: 'common:uploadResources',
      icon: CloudUploadOutlined,
      href: urls.uploadResource,
    },
    {
      text: 'common:addCourses',
      icon: SchoolOutlined,
      href: urls.addCourse,
    },
  ];

  if (school?.name && school.slug) {
    shortcuts.unshift({
      text: school.name,
      icon: ChatOutlined,
      href: urls.school(school.slug),
    });
  }

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

  const renderUpdate = (
    <Grid className={classes.topSectionContainer} container justify="center">
      <Grid item xs={12} lg={10} xl={7} container justify="center">
        <Link href={urls.update(slug)}>
          <Card className={classes.updateCard}>
            <CardActionArea>
              <CardContent className={classes.updateCardContent}>
                <Grid container alignItems="center" wrap="nowrap">
                  <FiberNew className={classes.newIcon} color="primary" />
                  <Typography
                    className={clsx(classes.updateTitle, 'truncate-text')}
                    variant="subtitle1"
                  >
                    {title}
                  </Typography>
                  <ArrowForwardOutlined />
                </Grid>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
      </Grid>
    </Grid>
  );

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
      <Grid item xs={12} lg={10} xl={7}>
        {renderHeader}
        {renderSubHeader}
        {renderSearchField}
      </Grid>
    </Grid>
  );

  const renderShortcuts = shortcuts.map(({ href, text, icon: Icon }: Shortcut, i: number) => (
    <Link href={href} key={i}>
      <Card className={classes.shortcutCard}>
        <CardActionArea className={classes.cardActionArea}>
          <CardContent className={classes.cardContent}>
            <Grid
              className={classes.shortcutTextContainer}
              container
              alignItems="center"
              wrap="nowrap"
            >
              <Avatar className={classes.avatar}>
                <Icon className={classes.avatarIcon} />
              </Avatar>
              <Typography
                className={clsx(classes.shortcutText, 'truncate-text')}
                variant="subtitle1"
                color="textSecondary"
              >
                {t(text)}
              </Typography>
              <ArrowForwardOutlined className={classes.shortcutArrow} />
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  ));

  const blogHeaderText = t('Skole Blog');
  const renderBlogHeaderEmoji = <Emoji emoji="📃" />;

  const renderBlogHeader = (
    <>
      {blogHeaderText}
      {renderBlogHeaderEmoji}
    </>
  );

  const renderBlog = isTabletOrDesktop && (
    <Card className={classes.blogCard}>
      <CardHeader
        classes={{
          root: classes.blogHeaderRoot,
          title: classes.blogHeaderTitle,
        }}
        title={renderBlogHeader}
      />
      {blogs.map(({ slug = '', title }, i) => (
        <ListItem key={i}>
          <ListItemText>
            <TextLink href={urls.blog(slug)}>{title}</TextLink>
          </ListItemText>
        </ListItem>
      ))}
      <CardContent className={classes.blogCardContent}>
        <ButtonLink href={urls.blogs} endIcon={<ArrowForwardOutlined />} fullWidth>
          {t('common:seeAll')}
        </ButtonLink>
      </CardContent>
    </Card>
  );

  const renderSuggestionsTableFooter = (
    <TableFooter className={classes.suggestionsTableFooter}>
      <ButtonLink href={urls.suggestions} endIcon={<ArrowForwardOutlined />} fullWidth>
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
    <Paper className={classes.suggestionsPaper}>
      <CardHeader className={classes.suggestionsCardHeader} title={suggestionsHeader} />
      <SuggestionsTable
        suggestions={suggestions}
        renderTableFooter={renderSuggestionsTableFooter}
        tableContainerProps={{ className: classes.suggestionsTableContainer }}
        dense
      />
    </Paper>
  );

  const renderMidSection = (
    <Grid className={classes.midSectionContainer} container justify="center">
      <Grid item xs={12} lg={10} xl={7} container justify="center">
        <Grid item xs={12} md={4} lg={3} container direction="column">
          {renderShortcuts}
          {renderBlog}
        </Grid>
        <Grid item xs={12} md={8} lg={9} container>
          {renderSuggestionsPreview}
        </Grid>
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
      {renderUpdate}
      {renderSearch}
      {renderMidSection}
      {renderInfo}
    </LandingPageTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const tHome = await getT(locale, 'home');
  const tCommon = await getT(locale, 'common');

  const updateFileNames = readdirSync('markdown/en/updates');
  const updates = [];

  for (const fileName of updateFileNames) {
    const slug = fileName.replace(/\.md$/, '');
    const { data } = await loadMarkdown(`updates/${slug}`);
    updates.push(data);
  }

  const mostRecentUpdate = updates
    .map(({ date }) => date)
    .sort()
    .reverse()[0];

  const update = updates.find(({ date }) => date === mostRecentUpdate);

  const blogFileNames = readdirSync('markdown/en/blogs');
  const _blogs: MarkdownPageData[] = [];

  for (const fileName of blogFileNames) {
    const slug = fileName.replace(/\.md$/, '');
    const { data } = await loadMarkdown(`blogs/${slug}`);
    _blogs.push(data);
  }

  const blogs = _blogs
    .sort((a, b) => (Number(a.date) > Number(b.date) ? Number(a.date) : Number(b.date)))
    .slice(0, 2);

  return {
    props: {
      _ns: await loadNamespaces(['home'], locale),
      seoProps: {
        title: tHome('title'),
        description: tCommon('description'),
      },
      update,
      blogs,
    },
  };
};

export default withUserMe(HomePage);
