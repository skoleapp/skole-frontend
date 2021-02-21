import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { EmailInputFormField, Emoji, LandingPageTemplate } from 'components';
import { Form, Formik, FormikProps } from 'formik';
import { CreateContactMessageMutation, useCreateContactMessageMutation } from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React, { useState } from 'react';
import { ContactFormValues, SeoPageProps } from 'types';
import { isNotNativeApp } from 'utils';
import * as Yup from 'yup';

const useStyles = makeStyles(({ spacing, breakpoints, palette }) => ({
  ctaContainer: {
    flexGrow: 1,
    padding: `${spacing(8)} ${spacing(2)}`,
  },
  ctaHeader: {
    fontSize: '1.5rem',
    [breakpoints.up('xs')]: {
      fontSize: '1.75rem',
    },
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
  form: {
    marginTop: spacing(8),
    width: '100%',
    maxWidth: '25rem',
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

const initialValues = {
  subject: 'Contact Request from Teacher',
  name: '',
  email: '',
  message: 'New contact request submitted from teacher page.',
};

const ForTeachersPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const context = useLanguageHeaderContext();
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const {
    formRef,
    onError,
    handleMutationErrors,
    setUnexpectedFormError,
  } = useForm<ContactFormValues>();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t('validation:invalidEmail')),
  });

  const onCompleted = ({ createContactMessage }: CreateContactMessageMutation): void => {
    if (createContactMessage?.errors?.length) {
      handleMutationErrors(createContactMessage.errors);
    } else if (createContactMessage?.successMessage) {
      setEmailSubmitted(true);
    } else {
      setUnexpectedFormError();
    }
  };

  const [createContactMessage] = useCreateContactMessageMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmitEmail = async (variables: ContactFormValues) => {
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
    <Grid item xs={12} sm={8} md={6} lg={4}>
      <Typography variant="subtitle1" color="secondary" align="center">
        {t('for-teachers:ctaSubheader1')}
        <strong>{t('for-teachers:ctaSubheader2')}</strong>
        {t('for-teachers:ctaSubheader3')}
        <strong> {t('for-teachers:ctaSubheader4')}</strong>
        {t('for-teachers:ctaSubheader5')}
      </Typography>
    </Grid>
  );

  const renderFormFields = (props: FormikProps<ContactFormValues>) => (
    <Form className={classes.form}>
      <EmailInputFormField {...props} />
    </Form>
  );

  const renderForm = (
    <Formik
      onSubmit={handleSubmitEmail}
      initialValues={initialValues}
      validationSchema={validationSchema}
      innerRef={formRef}
    >
      {renderFormFields}
    </Formik>
  );

  const renderEmailSubmittedText = (
    <Typography
      className={classes.emailSubmittedText}
      variant="subtitle1"
      color="secondary"
      align="center"
    >
      {t('for-teachers:emailSubmitted')}
      <Emoji emoji="🎉" />
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
      {emailSubmitted ? renderEmailSubmittedText : renderForm}
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
