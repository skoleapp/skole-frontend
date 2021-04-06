import Avatar from '@material-ui/core/Avatar';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import MaterialLink from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  ActionRequiredTemplate,
  FormSubmitSection,
  FormTemplate,
  PasswordField,
  TextFormField,
  TextLink,
} from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  LoginMutation,
  UseInviteCodeAndLoginMutation,
  useLoginMutation,
  UserObjectType,
  UserQuery,
  useUseInviteCodeAndLoginMutation,
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

interface InviteCodeFormValues {
  code: string;
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
  const [showInviteCodeForm, setShowInviteCodeForm] = useState(false);
  const [savedUsernameOrEmail, setSavedUsernameOrEmail] = useState('');
  const [savedPassword, setSavedPassword] = useState('');

  const {
    formRef: loginFormRef,
    handleMutationErrors: handleLoginFormMutationErrors,
    onError: onLoginFormError,
    setUnexpectedFormError: setUnexpectedLoginFormError,
    generalFormValues: generalLoginFormValues,
  } = useForm<LoginFormValues>();

  const {
    formRef: inviteCodeFormRef,
    handleMutationErrors: handleUseInviteCodeAndLoginMutationErrors,
    onError: onUseInviteCodeAndLoginError,
    setUnexpectedFormError: setUnexpectedInviteCodeFormError,
    generalFormValues: generalInviteCodeFormValues,
  } = useForm<InviteCodeFormValues>();

  const existingUserGreeting = t('login:existingUserGreeting', {
    username,
  });

  const handleSetExistingUser = (data: UserQuery): void => {
    if (data.user?.avatar && existingUser && existingUser?.avatar !== data.user.avatar) {
      setExistingUser({ ...existingUser, avatar: data.user.avatar });
    }
  };

  const [userQuery] = useUserLazyQuery({
    onCompleted: handleSetExistingUser,
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

  const loginFormValidationSchema = Yup.object().shape({
    usernameOrEmail: !validExistingUser
      ? Yup.string().required(t('validation:required'))
      : Yup.string(),
    password: Yup.string().required(t('validation:required')),
  });

  const inviteCodeFormValidationSchema = Yup.object().shape({
    code: Yup.string().required(t('validation:required')),
  });

  const initialLoginFormValues = useMemo(
    () => ({
      ...generalLoginFormValues,
      usernameOrEmail: '',
      password: '',
    }),
    [generalLoginFormValues],
  );

  const initialInviteCodeFormValues = useMemo(
    () => ({
      ...generalInviteCodeFormValues,
      code: '',
    }),
    [generalInviteCodeFormValues],
  );

  const onLoginCompleted = async ({ login }: LoginMutation): Promise<void> => {
    if (login?.errors?.length) {
      handleLoginFormMutationErrors(login.errors);

      if (login?.inviteCodeRequired && loginFormRef.current) {
        const { usernameOrEmail, password } = loginFormRef.current.values;
        setSavedUsernameOrEmail(usernameOrEmail);
        setSavedPassword(password);
        setShowInviteCodeForm(true);
      }
    } else if (login?.successMessage) {
      try {
        loginFormRef.current?.resetForm();
        toggleNotification(login.successMessage);
        const nextUrl = query.next ? String(query.next) : urls.home;
        await Router.push(nextUrl);
      } catch {
        setUnexpectedLoginFormError();
      }
    } else {
      setUnexpectedLoginFormError();
    }
  };

  const onUseInviteCodeAndLoginCompleted = async ({
    useInviteCode,
    login,
  }: UseInviteCodeAndLoginMutation): Promise<void> => {
    if (useInviteCode?.errors?.length) {
      handleUseInviteCodeAndLoginMutationErrors(useInviteCode.errors);
    } else if (login?.errors?.length) {
      handleUseInviteCodeAndLoginMutationErrors(login.errors);
    } else if (login?.successMessage) {
      inviteCodeFormRef.current?.resetForm();
      setSavedUsernameOrEmail('');
      setSavedPassword('');
      toggleNotification(login.successMessage);
      const nextUrl = query.next ? String(query.next) : urls.home;

      try {
        await Router.push(nextUrl);
      } catch {
        setUnexpectedInviteCodeFormError();
      }
    } else {
      setUnexpectedLoginFormError();
    }
  };

  const [login] = useLoginMutation({
    onCompleted: onLoginCompleted,
    onError: onLoginFormError,
    context,
  });

  const [useInviteCodeAndLogin] = useUseInviteCodeAndLoginMutation({
    onCompleted: onUseInviteCodeAndLoginCompleted,
    onError: onUseInviteCodeAndLoginError,
    context,
  });

  const handleLoginFormSubmit = useCallback(
    async ({ usernameOrEmail: _usernameOrEmail, password }: LoginFormValues): Promise<void> => {
      const usernameOrEmail = R.propOr(_usernameOrEmail, 'email', existingUser);

      await login({
        variables: { usernameOrEmail, password },
      });
    },
    [existingUser, login],
  );

  const handleInviteCodeFormSubmit = useCallback(
    async ({ code }: InviteCodeFormValues): Promise<void> => {
      await useInviteCodeAndLogin({
        variables: { code, usernameOrEmail: savedUsernameOrEmail, password: savedPassword },
      });
    },
    [useInviteCodeAndLogin, savedUsernameOrEmail, savedPassword],
  );

  const handleLoginWithDifferentCredentials = useCallback((): void => {
    localStorage.removeItem('user');
    setExistingUser(null);
    setShowInviteCodeForm(false);
    loginFormRef.current?.resetForm();
    inviteCodeFormRef.current?.resetForm();
  }, [loginFormRef, inviteCodeFormRef]);

  const renderExistingUserGreeting = useMemo(
    () =>
      !!validExistingUser && (
        <Grid container alignItems="center" direction="column">
          <Avatar className={classes.avatar} src={existingUserAvatar} />
          <Typography variant="subtitle1" gutterBottom>
            {existingUserGreeting}
          </Typography>
        </Grid>
      ),
    [classes.avatar, existingUserAvatar, existingUserGreeting, validExistingUser],
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
    (props: FormikProps<LoginFormValues>): JSX.Element => <PasswordField {...props} />,
    [],
  );

  const renderLoginFormSubmitSection = useCallback(
    (props: FormikProps<LoginFormValues>): JSX.Element => (
      <FormSubmitSection submitButtonText={t('common:login')} {...props} />
    ),
    [t],
  );

  const renderInviteCodeFormSubmitSection = useCallback(
    (props: FormikProps<InviteCodeFormValues>): JSX.Element => (
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
    () =>
      (!!validExistingUser || showInviteCodeForm) && (
        <FormControl className={classes.link}>
          <MaterialLink onClick={handleLoginWithDifferentCredentials}>
            {t('login:loginWithDifferentCredentials')}
          </MaterialLink>
        </FormControl>
      ),
    [classes.link, handleLoginWithDifferentCredentials, t, validExistingUser, showInviteCodeForm],
  );

  const renderInviteCodeField = useMemo(
    () => <Field label={t('forms:code')} name="code" component={TextFormField} />,
    [t],
  );

  const renderLoginFormFields = useCallback(
    (props: FormikProps<LoginFormValues>): JSX.Element => (
      <Form>
        {renderExistingUserGreeting}
        {renderUsernameOrEmailField}
        {renderPasswordField(props)}
        {renderLoginFormSubmitSection(props)}
        {renderForgotPasswordLink}
        {renderLoginWithDifferentCredentialsLink}
        {renderRegisterLink}
      </Form>
    ),
    [
      renderForgotPasswordLink,
      renderLoginFormSubmitSection,
      renderRegisterLink,
      renderUsernameOrEmailField,
      renderPasswordField,
      renderLoginWithDifferentCredentialsLink,
      renderExistingUserGreeting,
    ],
  );

  const renderLoginForm = useMemo(
    () =>
      !showInviteCodeForm && (
        <Formik
          initialValues={initialLoginFormValues}
          validationSchema={loginFormValidationSchema}
          onSubmit={handleLoginFormSubmit}
          innerRef={loginFormRef}
        >
          {renderLoginFormFields}
        </Formik>
      ),
    [
      loginFormRef,
      handleLoginFormSubmit,
      initialLoginFormValues,
      loginFormValidationSchema,
      renderLoginFormFields,
      showInviteCodeForm,
    ],
  );

  const renderInviteCodeFormFields = useCallback(
    (props: FormikProps<InviteCodeFormValues>) => (
      <Form>
        {renderInviteCodeField}
        {renderInviteCodeFormSubmitSection(props)}
        {renderLoginWithDifferentCredentialsLink}
      </Form>
    ),
    [
      renderInviteCodeFormSubmitSection,
      renderInviteCodeField,
      renderLoginWithDifferentCredentialsLink,
    ],
  );

  const renderInviteCodeForm = useMemo(
    () =>
      showInviteCodeForm && (
        <Formik
          initialValues={initialInviteCodeFormValues}
          validationSchema={inviteCodeFormValidationSchema}
          onSubmit={handleInviteCodeFormSubmit}
          innerRef={inviteCodeFormRef}
        >
          {renderInviteCodeFormFields}
        </Formik>
      ),
    [
      showInviteCodeForm,
      inviteCodeFormRef,
      initialInviteCodeFormValues,
      inviteCodeFormValidationSchema,
      handleInviteCodeFormSubmit,
      renderInviteCodeFormFields,
    ],
  );

  const renderForm = useMemo(() => renderLoginForm || renderInviteCodeForm, [
    renderInviteCodeForm,
    renderLoginForm,
  ]);

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
    hideBottomNavbar: true,
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
