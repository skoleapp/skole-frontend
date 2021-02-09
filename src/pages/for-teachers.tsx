import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import clsx from 'clsx';
import { Emoji, LandingPageTemplate } from 'components';
import { useNotificationsContext } from 'context';
import { CreateContactMessageMutation, useCreateContactMessageMutation } from 'generated';
import { withUserMe } from 'hocs';
import { useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React, { SyntheticEvent, useState } from 'react';
import { BORDER_RADIUS } from 'styles';
import { SeoPageProps } from 'types';
import { isNotNativeApp } from 'utils';

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
  ctaContainer: {
    flexGrow: 1,
    padding: `${spacing(8)} ${spacing(2)}`,
  },
  ctaHeader: {
    fontSize: '1.5rem',
    [breakpoints.up('sm')]: {
      fontSize: '2rem',
    },
    [breakpoints.up('md')]: {
      fontSize: '2.25rem',
    },
    [breakpoints.up('lg')]: {
      fontSize: '2.75rem',
    },
  },
  searchForm: {
    marginTop: spacing(8),
    display: 'flex',
    justifyContent: 'center',
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
  searchButton: {
    borderRadius: `0 ${BORDER_RADIUS} ${BORDER_RADIUS} 0`,
  },
  emailSubmittedText: {
    marginTop: spacing(8),
  },
  pitchContainer: {
    overflow: 'hidden',
  },
  pitchBoxContainer: {
    backgroundColor: palette.type === 'dark' ? palette.background.default : palette.grey[300],
    padding: `${spacing(4)} ${spacing(2)}`,
    [breakpoints.up('md')]: {
      padding: spacing(6),
    },
  },
  nativeAppPitchBoxContainer: {
    paddingBottom: `calc(${spacing(4)} + env(safe-area-inset-bottom))`,
    [breakpoints.up('md')]: {
      paddingBottom: `calc(${spacing(6)} + env(safe-area-inset-bottom))`,
    },
  },
  pitchHeader: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  pitchHeaderDivider: {
    height: '0.25rem',
    backgroundColor: palette.primary.main,
    marginBottom: spacing(2),
    borderRadius: '0.5rem',
  },
}));

const ForTeachersPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { toggleUnexpectedErrorNotification, toggleNotification } = useNotificationsContext();
  const context = useLanguageHeaderContext();
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onError = () => {
    toggleUnexpectedErrorNotification();
    setSubmitting(false);
  };

  const onCompleted = ({ createContactMessage }: CreateContactMessageMutation): void => {
    if (createContactMessage?.errors?.length) {
      onError();
    } else if (createContactMessage?.successMessage) {
      setSubmitting(false);
      setEmailSubmitted(true);
      toggleNotification(createContactMessage.successMessage);
    } else {
      onError();
    }
  };

  const [createContactMessage] = useCreateContactMessageMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmitEmail = async (e: SyntheticEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const variables = {
      subject: 'Contact Request from Teacher',
      name: '',
      email: '',
      message: 'New contact request submitted from teacher page.',
    };

    await createContactMessage({ variables });
  };

  const ctaHeader = t('for-teachers:ctaHeader');
  const renderTeacherEmoji = <Emoji emoji="🧑‍🏫" />;

  const renderCtaHeader = (
    <Typography
      className={classes.ctaHeader}
      variant="subtitle1"
      color="secondary"
      align="center"
      gutterBottom
    >
      {ctaHeader}
      {renderTeacherEmoji}
    </Typography>
  );

  const renderCtaSubheader = (
    <Grid item xs={12} sm={10} md={8} lg={6}>
      <Typography variant="subtitle1" color="secondary" align="center">
        {t('for-teachers:ctaSubheader1')}
        <strong>{t('for-teachers:ctaSubheader2')}</strong>
        {t('for-teachers:ctaSubheader3')}
        <strong> {t('for-teachers:ctaSubheader4')}</strong>
        {t('for-teachers:ctaSubheader5')}
      </Typography>
    </Grid>
  );

  const renderEmailInput = (
    <form className={classes.searchForm} onSubmit={handleSubmitEmail}>
      <Box className={classes.searchFieldBox}>
        <InputBase
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder={t('forms:yourEmail')}
        />
      </Box>
      <Button
        className={classes.searchButton}
        disabled={submitting}
        type="submit"
        variant="contained"
      >
        <ArrowForwardOutlined />
      </Button>
    </form>
  );

  const renderEmailSubmittedText = (
    <Typography
      className={classes.emailSubmittedText}
      variant="subtitle1"
      color="secondary"
      align="center"
    >
      {t('for-teachers:emailSubmitted')}
    </Typography>
  );

  const renderCta = (
    <Grid
      className={classes.ctaContainer}
      container
      direction="column"
      alignItems="center"
      justify="center"
    >
      {renderCtaHeader}
      {renderCtaSubheader}
      {emailSubmitted ? renderEmailSubmittedText : renderEmailInput}
    </Grid>
  );

  const studentsPitchHeaderText = t('for-teachers:studentsPitchHeader').toUpperCase();
  const teachersPitchHeaderText = t('for-teachers:teachersPitchHeader').toUpperCase();
  const infoPitchHeaderText = t('for-teachers:infoPitchHeader').toUpperCase();

  const renderStudentEmoji = <Emoji emoji="🧑‍🎓" />;
  const renderInfoEmoji = <Emoji emoji="🧐" />;
  const renderHandsUpEmoji = <Emoji emoji="🙌" />;

  const studentBullets = {
    1: t('for-teachers:studentsBullet1'),
    2: t('for-teachers:studentsBullet2'),
    3: t('for-teachers:studentsBullet3'),
    4: t('for-teachers:studentsBullet4'),
  };

  const teacherBullets = {
    1: t('for-teachers:teachersBullet1'),
    2: t('for-teachers:teachersBullet2'),
    3: t('for-teachers:teachersBullet3'),
    4: t('for-teachers:teachersBullet4'),
  };

  const infoBullets = {
    1: t('for-teachers:infoBullet1'),
    2: t('for-teachers:infoBullet2'),
    3: t('for-teachers:infoBullet3'),
    4: t('for-teachers:infoBullet4'),
  };

  const renderPitchItems = (
    <>
      <Grid item xs={12} md={4}>
        <Typography className={classes.pitchHeader} variant="subtitle1">
          {studentsPitchHeaderText}
          {renderStudentEmoji}
        </Typography>
        <Divider className={classes.pitchHeaderDivider} />
        <Typography variant="body2" color="textSecondary">
          {studentBullets[1]}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {studentBullets[2]}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {studentBullets[3]}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {studentBullets[4]}
        </Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography className={classes.pitchHeader} variant="subtitle1">
          {teachersPitchHeaderText}
          {renderTeacherEmoji}
        </Typography>
        <Divider className={classes.pitchHeaderDivider} />
        <Typography variant="body2" color="textSecondary">
          {teacherBullets[1]}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {teacherBullets[2]}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {teacherBullets[3]}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {teacherBullets[4]}
        </Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography className={classes.pitchHeader} variant="subtitle1">
          {infoPitchHeaderText}
          {renderInfoEmoji}
        </Typography>
        <Divider className={classes.pitchHeaderDivider} />
        <Typography variant="body2" color="textSecondary">
          {infoBullets[1]}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {infoBullets[2]}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {infoBullets[3]}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {infoBullets[4]}
          {renderHandsUpEmoji}
        </Typography>
      </Grid>
    </>
  );

  const renderPitch = (
    <Grid className={classes.pitchContainer} container direction="column" alignItems="center">
      <Grid
        container
        item
        xs={12}
        lg={10}
        xl={8}
        className={clsx(
          classes.pitchBoxContainer,
          isNotNativeApp && classes.nativeAppPitchBoxContainer,
        )}
        spacing={8}
      >
        {renderPitchItems}
      </Grid>
    </Grid>
  );

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      hideNavigation: true,
      header: t('for-teachers:header'),
    },
    footerProps: {
      hideAppStoreBadges: true,
    },
  };

  return (
    <LandingPageTemplate {...layoutProps}>
      {renderCta}
      {renderPitch}
    </LandingPageTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const t = await getT(locale, 'for-teachers');

  return {
    props: {
      _ns: await loadNamespaces(['for-teachers'], locale),
      seoProps: {
        title: t('title'),
        description: t('description'),
      },
    },
  };
};

export default withUserMe(ForTeachersPage);
