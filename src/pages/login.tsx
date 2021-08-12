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
  const username: string = R.propOr('', 'username', existingUser);
  const email = R.propOr('', 'email', existingUser);
  const validExistingUser = !!username && !!email;
  const avatar: string = R.propOr('', 'avatar', existingUser);
  const existingUserAvatar = mediaUrl(avatar);
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

  const initialFormValues = useMemo(
    () => ({
      ...generalFormValues,
      usernameOrEmail: '',
      password: '',
    }),
    [generalFormValues],
  );

  const onLoginCompleted = async ({ login }: LoginMutation): Promise<void> => {
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

  const [login] = useLoginMutation({
    onCompleted: onLoginCompleted,
    onError,
    context,
  });

  const handleLoginFormSubmit = useCallback(
    async ({ usernameOrEmail: _usernameOrEmail, password }: LoginFormValues): Promise<void> => {
      const usernameOrEmail: string = R.propOr(_usernameOrEmail, 'email', existingUser);

      await login({
        variables: { usernameOrEmail, password },
      });
    },
    [existingUser, login],
  );

  const handleLoginWithDifferentCredentials = useCallback((): void => {
    localStorage.removeItem('user');
    setExistingUser(null);
    formRef.current?.resetForm();
  }, [formRef]);

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

  const renderRegisterLink = useMemo(
    () => (
      <FormControl className={classes.link}>
        <TextLink href={{ pathname: urls.register, query }}>{t('login:registerLinkText')}</TextLink>
      </FormControl>
    ),
    [classes.link, t, query],
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
      !!validExistingUser && (
        <FormControl className={classes.link}>
          <MaterialLink onClick={handleLoginWithDifferentCredentials}>
            {t('login:loginWithDifferentCredentials')}
          </MaterialLink>
        </FormControl>
      ),
    [classes.link, handleLoginWithDifferentCredentials, t, validExistingUser],
  );

  const renderFormFields = useCallback(
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

  const renderForm = useMemo(
    () => (
      <Formik
        initialValues={initialFormValues}
        validationSchema={loginFormValidationSchema}
        onSubmit={handleLoginFormSubmit}
        innerRef={formRef}
        enableReinitialize
      >
        {renderFormFields}
      </Formik>
    ),
    [
      initialFormValues,
      loginFormValidationSchema,
      handleLoginFormSubmit,
      formRef,
      renderFormFields,
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
