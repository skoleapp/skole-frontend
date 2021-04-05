import Avatar from '@material-ui/core/Avatar';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import MaterialLink from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  ActionRequiredTemplate,
  ButtonLink,
  FormSubmitSection,
  FormTemplate,
  PasswordField,
  TextFormField,
  TextLink,
} from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps, FormikValues } from 'formik';
import {
  LoginMutation,
  useLoginMutation,
  UserObjectType,
  UserQuery,
  useUserLazyQuery,
} from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import Router, { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

const LoginPage: NextPage = () => {
  const classes = useStyles();
  const { userMe } = useAuthContext();
  const { t } = useTranslation();
  const { query } = useRouter();
  const { toggleNotification } = useNotificationsContext();
  const [existingUser, setExistingUser] = useState<UserObjectType | null>(null);
  const username = R.prop('username', existingUser);
  const email = R.prop('email', existingUser);
  const validExistingUser = !!username && !!email;
  const existingUserAvatar = mediaUrl(R.prop('avatar', existingUser));
  const context = useLanguageHeaderContext();

  const {
    formRef,
    handleMutationErrors,
    onError,
    setUnexpectedFormError,
    generalFormValues,
  } = useForm<LoginFormValues>();

  const existingUserGreeting = t('login:existingUserGreeting', {
    username,
  });

  const handleExistingUser = (data: UserQuery): void => {
    if (data.user?.avatar && existingUser && existingUser?.avatar !== data.user.avatar) {
      setExistingUser({ ...existingUser, avatar: data.user.avatar });
    }
  };

  const [userQuery] = useUserLazyQuery({
    onCompleted: handleExistingUser,
    context,
  });

  useEffect(() => {
    (async (): Promise<void> => {
      try {
        const existingUser = JSON.parse(localStorage.getItem('user') || 'null');
        setExistingUser(existingUser);
        await userQuery({ variables: { slug: existingUser?.slug } });
      } catch {
        // Invalid user stored in LS.
      }
    })();
  }, [userQuery]);

  const validationSchema = Yup.object().shape({
    usernameOrEmail: !validExistingUser
      ? Yup.string().required(t('validation:required'))
      : Yup.string(),
    password: Yup.string().required(t('validation:required')),
  });

  const initialValues = useMemo(
    () => ({
      ...generalFormValues,
      usernameOrEmail: '',
      password: '',
    }),
    [generalFormValues],
  );

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

  const handleSubmit = useCallback(
    async (values: LoginFormValues): Promise<void> => {
      const { usernameOrEmail: _usernameOrEmail, password } = values;
      const usernameOrEmail = R.propOr(_usernameOrEmail, 'email', existingUser);

      await loginMutation({
        variables: { usernameOrEmail, password },
      });
    },
    [existingUser, loginMutation],
  );

  const handleLoginWithDifferentCredentials = useCallback((): void => {
    localStorage.removeItem('user');
    setExistingUser(null);
    formRef.current?.resetForm();
  }, [formRef]);

  const renderExistingUserGreeting = useMemo(
    () => (
      <Grid container alignItems="center" direction="column">
        <Avatar className={classes.avatar} src={existingUserAvatar} />
        <Typography variant="subtitle1" gutterBottom>
          {existingUserGreeting}
        </Typography>
      </Grid>
    ),
    [classes.avatar, existingUserAvatar, existingUserGreeting],
  );

  const renderUsernameOrEmailField = useMemo(
    () =>
      !validExistingUser && (
        <Field
          name="usernameOrEmail"
          component={TextFormField}
          label={t('forms:usernameOrEmail')}
        />
      ),
    [t, validExistingUser],
  );

  const renderPasswordField = useCallback(
    (props: FormikProps<FormikValues>): JSX.Element => <PasswordField {...props} />,
    [],
  );

  const renderFormSubmitSection = useCallback(
    (props: FormikProps<FormikValues>): JSX.Element => (
      <FormSubmitSection submitButtonText={t('common:login')} {...props} />
    ),
    [t],
  );

  const renderRegisterLink = useMemo(
    () => (
      <FormControl className={classes.link}>
        <TextLink href={urls.register}>{t('login:registerLinkText')}</TextLink>
      </FormControl>
    ),
    [classes.link, t],
  );

  const renderForgotPasswordLink = useMemo(
    () => (
      <FormControl className={classes.link}>
        <TextLink href={urls.resetPassword}>{t('login:forgotPassword')}</TextLink>
      </FormControl>
    ),
    [classes.link, t],
  );

  const renderLoginWithDifferentCredentialsLink = useMemo(
    () => (
      <FormControl className={classes.link}>
        <MaterialLink onClick={handleLoginWithDifferentCredentials}>
          {t('login:loginWithDifferentCredentials')}
        </MaterialLink>
      </FormControl>
    ),
    [classes.link, handleLoginWithDifferentCredentials, t],
  );

  const renderExistingUserForm = useMemo(
    () => (props: FormikProps<FormikValues>): JSX.Element | false =>
      !!validExistingUser && (
        <Form>
          {renderExistingUserGreeting}
          {renderUsernameOrEmailField}
          {renderPasswordField(props)}
          {renderFormSubmitSection(props)}
          {renderForgotPasswordLink}
          {renderLoginWithDifferentCredentialsLink}
        </Form>
      ),
    [
      renderExistingUserGreeting,
      renderForgotPasswordLink,
      renderFormSubmitSection,
      renderLoginWithDifferentCredentialsLink,
      renderUsernameOrEmailField,
      validExistingUser,
      renderPasswordField,
    ],
  );

  const renderNewUserForm = useMemo(
    () => (props: FormikProps<FormikValues>): JSX.Element => (
      <Form>
        {renderUsernameOrEmailField}
        {renderPasswordField(props)}
        {renderFormSubmitSection(props)}
        {renderRegisterLink}
        {renderForgotPasswordLink}
      </Form>
    ),
    [
      renderForgotPasswordLink,
      renderFormSubmitSection,
      renderRegisterLink,
      renderUsernameOrEmailField,
      renderPasswordField,
    ],
  );

  const renderForm = useMemo(
    () => (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        innerRef={formRef}
      >
        {renderExistingUserForm || renderNewUserForm}
      </Formik>
    ),
    [
      formRef,
      handleSubmit,
      initialValues,
      renderExistingUserForm,
      renderNewUserForm,
      validationSchema,
    ],
  );

  const layoutProps = {
    seoProps: {
      title: t('login:title'),
    },
    topNavbarProps: {
      header: t('login:header'),
      emoji: '👋',
      hideLoginButton: true,
      hideGetStartedButton: true,
      hideSearch: true,
    },
  };

  if (userMe) {
    return <ActionRequiredTemplate variant="logout" {...layoutProps} />;
  }

  return <FormTemplate {...layoutProps}>{renderForm}</FormTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['login'], locale),
  },
});

export default withUserMe(LoginPage);
