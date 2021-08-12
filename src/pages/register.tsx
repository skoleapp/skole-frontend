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
import { RegisterAndLoginMutation, useRegisterAndLoginMutation } from 'generated';
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

enum RegisterPhases {
  REGISTER = 'register',
  VERIFY_ACCOUNT = 'verify-account',
}

const RegisterPage: NextPage = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { query } = useRouter();
  const [phase, setPhase] = useState(RegisterPhases.REGISTER);
  const context = useLanguageHeaderContext();
  const { userMe } = useAuthContext();
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  const {
    formRef: registerFormRef,
    handleMutationErrors: handleRegisterMutationErrors,
    onError: onRegisterError,
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

  const onRegisterCompleted = async ({ register }: RegisterAndLoginMutation): Promise<void> => {
    if (register?.errors?.length) {
      handleRegisterMutationErrors(register.errors);

      if (register?.invalidEmailDomain) {
        setEmailDialogOpen(true);
      }
    } else if (registerFormRef.current) {
      registerFormRef.current.resetForm();
      setPhase(RegisterPhases.VERIFY_ACCOUNT);
    }
  };

  const [registerAndLogin] = useRegisterAndLoginMutation({
    onCompleted: onRegisterCompleted,
    onError: onRegisterError,
    context,
  });

  const handleRegisterSubmit = useCallback(
    async ({ username, email, password }: RegisterFormValues): Promise<void> => {
      await registerAndLogin({
        variables: {
          username,
          email,
          password,
        },
      });
    },
    [registerAndLogin],
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
    (props: FormikProps<RegisterFormValues>) => (
      <PrimaryEmailField
        dialogOpen={emailDialogOpen}
        setDialogOpen={setEmailDialogOpen}
        {...props}
      />
    ),
    [emailDialogOpen, setEmailDialogOpen],
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

  const renderForm = useMemo(() => renderRegisterForm || renderVerifyAccount, [
    renderRegisterForm,
    renderVerifyAccount,
  ]);

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
      hideDynamicAuthButtons: true,
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
