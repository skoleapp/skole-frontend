import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import {
  ActionRequiredTemplate,
  ButtonLink,
  FormSubmitSection,
  FormTemplate,
  PasswordField,
  TextFormField,
  TextLink,
} from 'components';
import { useAuthContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import { RegisterMutation, useRegisterMutation } from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
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

enum RegisterPhases {
  REGISTER = 'register',
  REGISTER_COMPLETE = 'register-complete',
}

const RegisterPage: NextPage = () => {
  const { t } = useTranslation();
  const [phase, setPhase] = useState(RegisterPhases.REGISTER);
  const context = useLanguageHeaderContext();
  const { userMe, setUserMe } = useAuthContext();

  const {
    formRef: registerFormRef,
    handleMutationErrors: handleRegisterMutationErrors,
    onError: onRegisterError,
    setUnexpectedFormError: unexpectedRegisterError,
    generalFormValues: generalRegisterFormValues,
  } = useForm<RegisterFormValues>();

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

  const onRegisterCompleted = async ({ register, login }: RegisterMutation): Promise<void> => {
    if (register?.errors?.length) {
      handleRegisterMutationErrors(register.errors);
    } else if (login?.errors?.length) {
      handleRegisterMutationErrors(login.errors); // Set the login errors on register form on purpose.
    } else if (login?.user) {
      registerFormRef.current?.resetForm();
      setUserMe(login.user);
      setPhase(RegisterPhases.REGISTER_COMPLETE);
    } else {
      unexpectedRegisterError();
    }
  };

  const [registerMutation] = useRegisterMutation({
    onCompleted: onRegisterCompleted,
    onError: onRegisterError,
    context,
  });

  const handleRegisterSubmit = useCallback(
    async ({ username, email, password }: RegisterFormValues): Promise<void> => {
      await registerMutation({
        variables: {
          username,
          email,
          password,
        },
      });
    },
    [registerMutation],
  );

  const renderUsernameField = useMemo(
    () => (
      <Field
        label={t('forms:username')}
        name="username"
        component={TextFormField}
        helperText={t('register:usernameHelperText')}
      />
    ),
    [t],
  );

  const renderEmailField = useMemo(
    () => (
      <Field
        label={t('forms:email')}
        name="email"
        component={TextFormField}
        helperText={t('register:emailHelperText')}
      />
    ),
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
          {t('register:termsHelperText')}{' '}
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

  const renderLoginLink = useMemo(
    () => (
      <FormControl className={classes.link}>
        <TextLink href={urls.login}>{t('register:loginLinkText')}</TextLink>
      </FormControl>
    ),
    [t, classes.link],
  );

  const renderRegisterFormFields = useCallback(
    (props: FormikProps<RegisterFormValues>): JSX.Element => (
      <Form>
        {renderUsernameField}
        {renderEmailField}
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

  const renderRegisterForm = useMemo(
    () =>
      phase === RegisterPhases.REGISTER && (
        <Formik
          initialValues={registerInitialValues}
          validationSchema={registerValidationSchema}
          onSubmit={handleRegisterSubmit}
          innerRef={registerFormRef}
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

  const renderRegisterCompleteText = useMemo(
    () => (
      <FormControl>
        <Typography className="form-text" variant="subtitle1">
          {t('register:registerCompleteText')}
        </Typography>
      </FormControl>
    ),
    [t],
  );

  const renderContinueButton = useMemo(
    () => (
      <FormControl>
        <ButtonLink
          href={urls.home}
          endIcon={<ArrowForwardOutlined />}
          color="primary"
          variant="contained"
        >
          {t('common:continue')}
        </ButtonLink>
      </FormControl>
    ),
    [t],
  );

  const renderRegisterComplete = useMemo(
    () =>
      phase === RegisterPhases.REGISTER_COMPLETE && (
        <>
          {renderRegisterCompleteText}
          {renderContinueButton}
        </>
      ),
    [phase, renderContinueButton, renderRegisterCompleteText],
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

  if (userMe && phase === RegisterPhases.REGISTER) {
    return <ActionRequiredTemplate variant="logout" {...layoutProps} />;
  }

  return (
    <FormTemplate {...layoutProps}>
      {renderRegisterForm}
      {renderRegisterComplete}
    </FormTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['register'], locale),
  },
});

export default withUserMe(RegisterPage);
