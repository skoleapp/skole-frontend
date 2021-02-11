import Avatar from '@material-ui/core/Avatar';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import MaterialLink from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  ButtonLink,
  FormSubmitSection,
  FormTemplate,
  LogoutRequiredTemplate,
  PasswordField,
  TextFormField,
  TextLink,
} from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps, FormikValues } from 'formik';
import { LoginMutation, useLoginMutation } from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useEffect, useState } from 'react';
import { SeoPageProps } from 'types';
import { mediaUrl, urls } from 'utils';
import * as Yup from 'yup';

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  avatar: {
    width: '5rem',
    height: '5rem',
    marginBottom: spacing(4),
    [breakpoints.up('md')]: {
      width: '7rem',
      height: '7rem',
    },
  },
  link: {
    textAlign: 'center',
    marginTop: spacing(4),
  },
}));

interface LoginFormValues {
  usernameOrEmail: string;
  password: string;
}

const LoginPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const classes = useStyles();
  const { userMe } = useAuthContext();
  const { t } = useTranslation();
  const { query } = useRouter();
  const { toggleNotification } = useNotificationsContext();
  const [existingUser, setExistingUser] = useState(null);
  const existingUserAvatar = mediaUrl(R.propOr('', 'avatar', existingUser));
  const context = useLanguageHeaderContext();

  const {
    formRef,
    handleMutationErrors,
    onError,
    setUnexpectedFormError,
  } = useForm<LoginFormValues>();

  const existingUserGreeting = t('login:existingUserGreeting', {
    username: R.propOr('-', 'username', existingUser),
  });

  const validExistingUser =
    !!R.propOr(false, 'username', existingUser) && !!R.propOr(false, 'email', existingUser);

  useEffect(() => {
    const existingUser = JSON.parse(localStorage.getItem('user') || 'null');
    setExistingUser(existingUser);
  }, []);

  const validationSchema = Yup.object().shape({
    usernameOrEmail: !validExistingUser
      ? Yup.string().required(t('validation:required'))
      : Yup.string(),
    password: Yup.string().required(t('validation:required')),
  });

  const initialValues = {
    usernameOrEmail: '',
    password: '',
  };

  const onCompleted = async ({ login }: LoginMutation): Promise<void> => {
    if (login?.errors?.length) {
      handleMutationErrors(login.errors);
    } else if (login?.successMessage) {
      try {
        formRef.current?.resetForm();
        toggleNotification(login.successMessage);
        const nextUrl = query.next ? String(query.next) : urls.home;
        await Router.push(nextUrl);
      } catch {
        setUnexpectedFormError();
      }
    } else {
      setUnexpectedFormError();
    }
  };

  const [loginMutation] = useLoginMutation({ onCompleted, onError, context });

  const handleSubmit = async (values: LoginFormValues): Promise<void> => {
    const { usernameOrEmail: _usernameOrEmail, password } = values;

    const usernameOrEmail = R.propOr(_usernameOrEmail, 'email', existingUser);

    await loginMutation({
      variables: { usernameOrEmail, password },
    });
  };

  const handleLoginWithDifferentCredentials = (): void => {
    localStorage.removeItem('user');
    setExistingUser(null);
    formRef.current?.resetForm();
  };

  const renderExistingUserGreeting = (
    <Grid container alignItems="center" direction="column">
      <Avatar className={classes.avatar} src={existingUserAvatar} />
      <Typography variant="subtitle1" gutterBottom>
        {existingUserGreeting}
      </Typography>
    </Grid>
  );

  const renderUsernameOrEmailField = !validExistingUser && (
    <Field name="usernameOrEmail" component={TextFormField} label={t('forms:usernameOrEmail')} />
  );

  const renderPasswordField = (props: FormikProps<FormikValues>): JSX.Element => (
    <PasswordField {...props} />
  );

  const renderFormSubmitSection = (props: FormikProps<FormikValues>): JSX.Element => (
    <FormSubmitSection submitButtonText={t('common:login')} {...props} />
  );

  const renderRegisterButton = (
    <FormControl className={classes.link}>
      <ButtonLink href={urls.register} variant="outlined">
        {t('common:register')}
      </ButtonLink>
    </FormControl>
  );

  const renderForgotPasswordLink = (
    <FormControl className={classes.link}>
      <TextLink href={urls.resetPassword}>{t('login:forgotPassword')}</TextLink>
    </FormControl>
  );

  const renderLoginWithDifferentCredentialsLink = (
    <FormControl className={classes.link}>
      <MaterialLink onClick={handleLoginWithDifferentCredentials}>
        {t('login:loginWithDifferentCredentials')}
      </MaterialLink>
    </FormControl>
  );

  const renderExistingUserForm = (props: FormikProps<FormikValues>): JSX.Element => (
    <Form>
      {renderExistingUserGreeting}
      {renderUsernameOrEmailField}
      {renderPasswordField(props)}
      {renderFormSubmitSection(props)}
      {renderForgotPasswordLink}
      {renderLoginWithDifferentCredentialsLink}
    </Form>
  );

  const renderNewUserForm = (props: FormikProps<FormikValues>): JSX.Element => (
    <Form>
      {renderUsernameOrEmailField}
      {renderPasswordField(props)}
      {renderFormSubmitSection(props)}
      {renderRegisterButton}
      {renderForgotPasswordLink}
    </Form>
  );

  const renderForm = (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      innerRef={formRef}
    >
      {validExistingUser ? renderExistingUserForm : renderNewUserForm}
    </Formik>
  );

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: t('login:header'),
      emoji: '👋',
      hideLoginButton: true,
      hideGetStartedButton: true,
      hideSearch: true,
    },
  };

  if (userMe) {
    return <LogoutRequiredTemplate {...layoutProps} />;
  }

  return <FormTemplate {...layoutProps}>{renderForm}</FormTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const t = await getT(locale, 'login');

  return {
    props: {
      _ns: await loadNamespaces(['login'], locale),
      seoProps: {
        title: t('title'),
        description: t('description'),
      },
    },
  };
};

export default withUserMe(LoginPage);
