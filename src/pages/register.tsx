import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import {
  ActionRequiredTemplate,
  ButtonLink,
  FormSubmitSection,
  FormTemplate,
  PasswordField,
  PrimaryEmailField,
  TextFormField,
  TextLink,
} from 'components';
import { useAuthContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  RegisterMutation,
  UseInviteCodeAndLoginMutation,
  useRegisterMutation,
  useUseInviteCodeAndLoginMutation,
} from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';
import { PASSWORD_MIN_LENGTH, urls } from 'utils';
import * as Yup from 'yup';

const useStyles = makeStyles(({ spacing }) => ({
  link: {
    textAlign: 'center',
    marginTop: spacing(4),
  },
}));

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface InviteCodeFormValues {
  code: string;
}

enum RegisterPhases {
  REGISTER = 'register',
  USE_INVITE_CODE = 'use-invite-code',
  VERIFY_ACCOUNT = 'verify-account',
}

const RegisterPage: NextPage = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { query } = useRouter();
  const [phase, setPhase] = useState(RegisterPhases.REGISTER);
  const context = useLanguageHeaderContext();
  const { userMe, setUserMe } = useAuthContext();
  const initialCode = query.code ? String(query.code) : '';
  const [savedEmail, setSavedEmail] = useState('');
  const [savedPassword, setSavedPassword] = useState('');

  const {
    formRef: registerFormRef,
    handleMutationErrors: handleRegisterMutationErrors,
    onError: onRegisterError,
    generalFormValues: generalRegisterFormValues,
  } = useForm<RegisterFormValues>();

  const {
    formRef: inviteCodeFormRef,
    handleMutationErrors: handleUseInviteCodeAndLoginMutationErrors,
    onError: onUseInviteCodeAndLoginError,
    generalFormValues: generalInviteCodeFormValues,
  } = useForm<InviteCodeFormValues>();

  const registerInitialValues = useMemo(
    () => ({
      ...generalRegisterFormValues,
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    }),
    [generalRegisterFormValues],
  );

  const inviteCodeFormInitialValues = useMemo(
    () => ({
      ...generalInviteCodeFormValues,
      code: initialCode,
    }),
    [generalInviteCodeFormValues, initialCode],
  );

  const registerValidationSchema = Yup.object().shape({
    username: Yup.string().required(t('validation:required')),
    email: Yup.string().email(t('validation:invalidEmail')).required(t('validation:required')),
    password: Yup.string()
      .min(PASSWORD_MIN_LENGTH, t('validation:passwordTooShort', { length: PASSWORD_MIN_LENGTH }))
      .required(t('validation:required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], t('validation:passwordsNotMatch'))
      .required(t('validation:required')),
  });

  const inviteCodeFormValidationSchema = Yup.object().shape({
    code: Yup.string().required(t('validation:required')),
  });

  const onRegisterCompleted = async ({ register }: RegisterMutation): Promise<void> => {
    if (register?.errors?.length) {
      handleRegisterMutationErrors(register.errors);
    } else if (registerFormRef.current) {
      const { email, password } = registerFormRef.current.values;
      setSavedEmail(email);
      setSavedPassword(password);
      registerFormRef.current.resetForm();
      setPhase(RegisterPhases.USE_INVITE_CODE);
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
    } else if (login?.user) {
      inviteCodeFormRef.current?.resetForm();
      setSavedEmail('');
      setSavedPassword('');
      setUserMe(login.user);
      setPhase(RegisterPhases.VERIFY_ACCOUNT);
    }
  };

  const [register] = useRegisterMutation({
    onCompleted: onRegisterCompleted,
    onError: onRegisterError,
    context,
  });

  const [useInviteCodeAndLogin] = useUseInviteCodeAndLoginMutation({
    onCompleted: onUseInviteCodeAndLoginCompleted,
    onError: onUseInviteCodeAndLoginError,
    context,
  });

  const handleRegisterSubmit = useCallback(
    async ({ username, email, password }: RegisterFormValues): Promise<void> => {
      await register({
        variables: {
          username,
          email,
          password,
        },
      });
    },
    [register],
  );

  const handleInviteCodeFormSubmit = useCallback(
    async ({ code }: InviteCodeFormValues): Promise<void> => {
      await useInviteCodeAndLogin({
        variables: {
          code,
          usernameOrEmail: savedEmail,
          password: savedPassword,
        },
      });
    },
    [useInviteCodeAndLogin, savedEmail, savedPassword],
  );

  const renderUsernameField = useMemo(
    () => (
      <Field
        label={t('forms:username')}
        name="username"
        component={TextFormField}
        helperText={t('forms:usernameHelperText')}
      />
    ),
    [t],
  );

  const renderEmailField = useCallback(
    (props: FormikProps<RegisterFormValues>) => <PrimaryEmailField {...props} />,
    [],
  );

  const renderInviteCodeHelperText = useMemo(
    () => (
      <FormControl>
        <FormHelperText>{t('register:inviteCodeHelperText')}</FormHelperText>
      </FormControl>
    ),
    [t],
  );

  const renderSecondaryInviteCodeHelperText = useMemo(
    () => (
      <FormControl>
        <FormHelperText>{t('register:secondaryInviteCodeHelperText')}</FormHelperText>
      </FormControl>
    ),
    [t],
  );

  const renderInviteCodeField = useMemo(
    () => <Field label={t('forms:code')} name="code" component={TextFormField} />,
    [t],
  );

  const renderPasswordField = useCallback(
    (props: FormikProps<RegisterFormValues>): JSX.Element => <PasswordField {...props} />,
    [],
  );

  const renderConfirmPasswordField = useCallback(
    (props: FormikProps<RegisterFormValues>): JSX.Element => (
      <PasswordField label={t('forms:confirmPassword')} name="confirmPassword" {...props} />
    ),
    [t],
  );

  const renderTermsLink = useMemo(
    () => (
      <FormControl>
        <FormHelperText>
          {t('forms:termsHelperText')}{' '}
          <TextLink href={urls.terms} target="_blank">
            {t('common:terms')}
          </TextLink>
          .
        </FormHelperText>
      </FormControl>
    ),
    [t],
  );

  const renderRegisterFormSubmitSection = useCallback(
    (props: FormikProps<RegisterFormValues>): JSX.Element => (
      <FormSubmitSection submitButtonText={t('common:register')} {...props} />
    ),
    [t],
  );

  const renderInviteCodeFormSubmitSection = useCallback(
    (props: FormikProps<InviteCodeFormValues>): JSX.Element => (
      <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
    ),
    [t],
  );

  const renderLoginLink = useMemo(
    () => (
      <FormControl className={classes.link}>
        <TextLink href={{ pathname: urls.login, query }}>{t('register:loginLinkText')}</TextLink>
      </FormControl>
    ),
    [t, classes.link, query],
  );

  const renderRegisterFormFields = useCallback(
    (props: FormikProps<RegisterFormValues>): JSX.Element => (
      <Form>
        {renderUsernameField}
        {renderEmailField(props)}
        {renderPasswordField(props)}
        {renderConfirmPasswordField(props)}
        {renderConfirmPasswordField}
        {renderTermsLink}
        {renderRegisterFormSubmitSection(props)}
        {renderLoginLink}
      </Form>
    ),
    [
      renderConfirmPasswordField,
      renderEmailField,
      renderLoginLink,
      renderRegisterFormSubmitSection,
      renderTermsLink,
      renderUsernameField,
      renderPasswordField,
    ],
  );

  const renderInviteCodeFormFields = useCallback(
    (props: FormikProps<InviteCodeFormValues>): JSX.Element => (
      <Form>
        {renderInviteCodeHelperText}
        {renderInviteCodeField}
        {renderSecondaryInviteCodeHelperText}
        {renderInviteCodeFormSubmitSection(props)}
      </Form>
    ),
    [
      renderInviteCodeField,
      renderInviteCodeFormSubmitSection,
      renderInviteCodeHelperText,
      renderSecondaryInviteCodeHelperText,
    ],
  );

  const renderRegisterForm = useMemo(
    () =>
      phase === RegisterPhases.REGISTER && (
        <Formik
          initialValues={registerInitialValues}
          validationSchema={registerValidationSchema}
          onSubmit={handleRegisterSubmit}
          innerRef={registerFormRef}
          enableReinitialize
        >
          {renderRegisterFormFields}
        </Formik>
      ),
    [
      handleRegisterSubmit,
      phase,
      registerFormRef,
      registerInitialValues,
      registerValidationSchema,
      renderRegisterFormFields,
    ],
  );

  const renderInviteCodeForm = useMemo(
    () =>
      phase === RegisterPhases.USE_INVITE_CODE && (
        <Formik
          initialValues={inviteCodeFormInitialValues}
          validationSchema={inviteCodeFormValidationSchema}
          onSubmit={handleInviteCodeFormSubmit}
          innerRef={inviteCodeFormRef}
          enableReinitialize
        >
          {renderInviteCodeFormFields}
        </Formik>
      ),
    [
      phase,
      inviteCodeFormInitialValues,
      inviteCodeFormValidationSchema,
      handleInviteCodeFormSubmit,
      inviteCodeFormRef,
      renderInviteCodeFormFields,
    ],
  );

  const renderVerifyAccount = useMemo(
    () =>
      phase === RegisterPhases.VERIFY_ACCOUNT && (
        <>
          <FormControl>
            <Typography className="form-text" variant="subtitle1">
              {t('register:verifyAccountText')}
            </Typography>
          </FormControl>
          <FormControl>
            <ButtonLink href={urls.home} endIcon={<ArrowForwardOutlined />} variant="contained">
              {t('common:continue')}
            </ButtonLink>
          </FormControl>
        </>
      ),
    [t, phase],
  );

  const renderForm = useMemo(
    () => renderRegisterForm || renderInviteCodeForm || renderVerifyAccount,
    [renderRegisterForm, renderInviteCodeForm, renderVerifyAccount],
  );

  const layoutProps = {
    seoProps: {
      title: t('register:title'),
    },
    topNavbarProps: {
      header: t('register:header'),
      emoji: '👋',
      hideSearch: true,
      hideRegisterButton: true,
      hideGetStartedButton: true,
    },
  };

  if (!!userMe && phase === RegisterPhases.REGISTER) {
    return <ActionRequiredTemplate variant="logout" {...layoutProps} />;
  }

  return <FormTemplate {...layoutProps}>{renderForm}</FormTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['register'], locale),
  },
});

export default withUserMe(RegisterPage);
