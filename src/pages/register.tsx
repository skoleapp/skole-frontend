import { useUpdateAccountSettingsMutation } from '__generated__/src/graphql/common.graphql';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import {
  ActionRequiredTemplate,
  AutocompleteField,
  ButtonLink,
  ContactLink,
  FormSubmitSection,
  FormTemplate,
  PasswordField,
  TextFormField,
  TextLink,
} from 'components';
import { useAuthContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  AutocompleteSchoolsDocument,
  AutocompleteSubjectsDocument,
  RegisterMutation,
  SchoolObjectType,
  SubjectObjectType,
  UpdateAccountSettingsMutation,
  useRegisterMutation,
} from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import * as R from 'ramda';
import React, { useState } from 'react';
import { SeoPageProps } from 'types';
import { PASSWORD_MIN_LENGTH, urls } from 'utils';
import * as Yup from 'yup';

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UpdateUserFormValues {
  school: SchoolObjectType | null;
  subject: SubjectObjectType | null;
}

enum RegisterPhases {
  REGISTER = 'register',
  UPDATE_ACCOUNT_SETTINGS = 'update-account-settings',
  REGISTER_COMPLETE = 'register-complete',
}

const RegisterPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const { t } = useTranslation();
  const [phase, setPhase] = useState(RegisterPhases.REGISTER);
  const context = useLanguageHeaderContext();
  const { userMe, setUserMe } = useAuthContext();

  const handleSkipUpdateProfile = (): void => setPhase(RegisterPhases.REGISTER_COMPLETE);

  const {
    formRef: registerFormRef,
    handleMutationErrors: handleRegisterMutationErrors,
    onError: onRegisterError,
    setUnexpectedFormError: unexpectedRegisterError,
    generalFormValues: generalRegisterFormValues,
  } = useForm<RegisterFormValues>();

  const {
    formRef: updateAccountSettingsFormRef,
    handleMutationErrors: handleUpdateAccountSettingsMutationErrors,
    onError: onUpdateAccountSettingsError,
    generalFormValues: generalUpdateAccountSettingsFormValues,
  } = useForm<UpdateUserFormValues>();

  const registerInitialValues = {
    ...generalRegisterFormValues,
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

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
      setPhase(RegisterPhases.UPDATE_ACCOUNT_SETTINGS);
    } else {
      unexpectedRegisterError();
    }
  };

  const [registerMutation] = useRegisterMutation({
    onCompleted: onRegisterCompleted,
    onError: onRegisterError,
    context,
  });

  const handleRegisterSubmit = async ({
    username,
    email,
    password,
  }: RegisterFormValues): Promise<void> => {
    await registerMutation({
      variables: {
        username,
        email,
        password,
      },
    });
  };

  const updateAccountSettingsInitialValues = {
    ...generalUpdateAccountSettingsFormValues,
    school: null,
    subject: null,
  };

  const handleUpdateAccountSettingsCompleted = ({
    updateAccountSettings,
  }: UpdateAccountSettingsMutation): void => {
    if (updateAccountSettings?.errors?.length) {
      handleUpdateAccountSettingsMutationErrors(updateAccountSettings.errors);
    } else {
      updateAccountSettingsFormRef.current?.resetForm();
      setPhase(RegisterPhases.REGISTER_COMPLETE);
    }
  };

  const [updateAccountSettings] = useUpdateAccountSettingsMutation({
    onCompleted: handleUpdateAccountSettingsCompleted,
    onError: onUpdateAccountSettingsError,
    context,
  });

  const handleSubmitUpdateAccountSettings = async ({
    school,
    subject,
  }: UpdateUserFormValues): Promise<void> => {
    const variables = R.pick(
      ['email', 'productUpdatePermission', 'blogPostEmailPermission'],
      userMe,
    );

    await updateAccountSettings({
      variables: {
        ...variables,
        school: R.propOr('', 'id', school),
        subject: R.propOr('', 'id', subject),
      },
    });
  };

  const renderUsernameField = (
    <Field
      label={t('forms:username')}
      name="username"
      component={TextFormField}
      helperText={t('register:usernameHelperText')}
    />
  );

  const renderEmailField = (
    <Field
      label={t('forms:email')}
      name="email"
      component={TextFormField}
      helperText={t('register:emailHelperText')}
    />
  );

  const renderPasswordField = (props: FormikProps<RegisterFormValues>): JSX.Element => (
    <PasswordField {...props} />
  );

  const renderConfirmPasswordField = (props: FormikProps<RegisterFormValues>): JSX.Element => (
    <PasswordField label={t('forms:confirmPassword')} name="confirmPassword" {...props} />
  );

  const renderTermsLink = (
    <FormControl>
      <FormHelperText>
        {t('register:termsHelpText')}{' '}
        <TextLink href={urls.terms} target="_blank">
          {t('common:terms')}
        </TextLink>
        .
      </FormHelperText>
    </FormControl>
  );

  const renderRegisterFormSubmitSection = (props: FormikProps<RegisterFormValues>): JSX.Element => (
    <FormSubmitSection submitButtonText={t('common:register')} {...props} />
  );

  const renderLoginButton = (
    <FormControl>
      <ButtonLink href={urls.login} variant="outlined" fullWidth>
        {t('common:login')}
      </ButtonLink>
    </FormControl>
  );

  const renderRegisterFormFields = (props: FormikProps<RegisterFormValues>): JSX.Element => (
    <Form>
      {renderUsernameField}
      {renderEmailField}
      {renderPasswordField(props)}
      {renderConfirmPasswordField(props)}
      {renderConfirmPasswordField}
      {renderTermsLink}
      {renderRegisterFormSubmitSection(props)}
      {renderLoginButton}
    </Form>
  );

  const renderRegisterForm = phase === RegisterPhases.REGISTER && (
    <Formik
      initialValues={registerInitialValues}
      validationSchema={registerValidationSchema}
      onSubmit={handleRegisterSubmit}
      innerRef={registerFormRef}
    >
      {renderRegisterFormFields}
    </Formik>
  );

  const renderUpdateAccountSettingsHelperText = (
    <FormControl>
      <Typography className="form-text" variant="subtitle1">
        {t('register:updateAccountSettingsHelperText')}
      </Typography>
    </FormControl>
  );

  const renderSchoolField = (
    <Field
      name="school"
      label={t('forms:schoolOptional')}
      dataKey="autocompleteSchools"
      searchKey="name"
      document={AutocompleteSchoolsDocument}
      component={AutocompleteField}
    />
  );

  const renderSubjectField = (
    <Field
      name="subject"
      label={t('forms:subjectOptional')}
      dataKey="autocompleteSubjects"
      searchKey="name"
      document={AutocompleteSubjectsDocument}
      component={AutocompleteField}
    />
  );

  const renderUpdateUserFormSubmitSection = (
    props: FormikProps<UpdateUserFormValues>,
  ): JSX.Element => <FormSubmitSection submitButtonText={t('common:save')} {...props} />;

  const renderSkipButton = (
    <FormControl>
      <Button variant="outlined" onClick={handleSkipUpdateProfile}>
        {t('common:setupLater')}
      </Button>
    </FormControl>
  );

  const renderContactUsLink = <ContactLink />;

  const renderUpdateAccountSettingsFormFields = (
    props: FormikProps<UpdateUserFormValues>,
  ): JSX.Element => (
    <Form>
      {renderUpdateAccountSettingsHelperText}
      {renderSchoolField}
      {renderSubjectField}
      {renderUpdateUserFormSubmitSection(props)}
      {renderSkipButton}
      {renderContactUsLink}
    </Form>
  );

  const renderUpdateAccountSettingsForm = phase === RegisterPhases.UPDATE_ACCOUNT_SETTINGS && (
    <Formik
      initialValues={updateAccountSettingsInitialValues}
      onSubmit={handleSubmitUpdateAccountSettings}
      innerRef={updateAccountSettingsFormRef}
    >
      {renderUpdateAccountSettingsFormFields}
    </Formik>
  );

  const renderRegisterCompleteText = (
    <FormControl>
      <Typography className="form-text" variant="subtitle1">
        {t('register:registerCompleteText')}
      </Typography>
    </FormControl>
  );

  const renderContinueButton = (
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
  );

  const renderRegisterComplete = phase === RegisterPhases.REGISTER_COMPLETE && (
    <>
      {renderRegisterCompleteText}
      {renderContinueButton}
    </>
  );

  const layoutProps = {
    seoProps,
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
      {renderUpdateAccountSettingsForm}
      {renderRegisterComplete}
    </FormTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const t = await getT(locale, 'register');

  return {
    props: {
      _ns: await loadNamespaces(['register'], locale),
      seoProps: {
        title: t('title'),
        description: t('description'),
      },
    },
  };
};

export default withUserMe(RegisterPage);
