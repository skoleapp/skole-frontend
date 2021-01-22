import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import {
  AutocompleteField,
  ButtonLink,
  ContactLink,
  Emoji,
  FormSubmitSection,
  FormTemplate,
  LogoutRequiredTemplate,
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
  UpdateUserMutation,
  useRegisterMutation,
  UserObjectType,
  useUpdateUserMutation,
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
  UPDATE_USER = 'update-user',
  REGISTER_COMPLETE = 'register-complete',
}

const RegisterPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const { t } = useTranslation();
  const [phase, setPhase] = useState(RegisterPhases.REGISTER);
  const context = useLanguageHeaderContext();
  const { userMe } = useAuthContext();

  const [registeredUser, setRegisteredUser] = useState<Pick<
    UserObjectType,
    'username' | 'email'
  > | null>(null);

  const handleSkipUpdateProfile = (): void => setPhase(RegisterPhases.REGISTER_COMPLETE);

  const {
    formRef: registerFormRef,
    handleMutationErrors: handleRegisterMutationErrors,
    onError: onRegisterError,
    setUnexpectedFormError: unexpectedRegisterError,
  } = useForm<RegisterFormValues>();

  const {
    formRef: updateUserFormRef,
    handleMutationErrors: handleUpdateUserMutationErrors,
    onError: onUpdateUserError,
    setUnexpectedFormError: updateUserUnexpectedError,
  } = useForm<UpdateUserFormValues>();

  const registerInitialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
  };

  const registerValidationSchema = Yup.object().shape({
    username: Yup.string().required(t('validation:required')),
    password: Yup.string()
      .min(PASSWORD_MIN_LENGTH, t('validation:passwordTooShort', { length: PASSWORD_MIN_LENGTH }))
      .required(t('validation:required')),
    email: Yup.string().email(t('validation:invalidEmail')).required(t('validation:required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], t('validation:passwordsNotMatch'))
      .required(t('validation:required')),
  });

  const updateUserInitialValues = {
    school: null,
    subject: null,
    general: '',
  };

  const updateUserValidationSchema = Yup.object().shape({
    school: Yup.object().nullable(),
    subject: Yup.object().nullable(),
  });

  const onRegisterCompleted = async ({ register, login }: RegisterMutation): Promise<void> => {
    if (!!register && !!register.errors && !!register.errors.length) {
      handleRegisterMutationErrors(register.errors);
    } else if (!!login && !!login.errors && !!login.errors.length) {
      handleRegisterMutationErrors(login.errors);
    } else if (!!login && !!login.user) {
      registerFormRef.current?.resetForm();
      setRegisteredUser(login.user);
      setPhase(RegisterPhases.UPDATE_USER);
    } else {
      unexpectedRegisterError();
    }
  };

  const [registerMutation] = useRegisterMutation({
    onCompleted: onRegisterCompleted,
    onError: onRegisterError,
    context,
  });

  const handleRegisterSubmit = async (values: RegisterFormValues): Promise<void> => {
    const { username, email, password } = values;

    await registerMutation({
      variables: {
        username,
        email,
        password,
      },
    });
  };

  const onUpdateUserCompleted = ({ updateUser }: UpdateUserMutation): void => {
    if (updateUser) {
      if (!!updateUser.errors && !!updateUser.errors.length) {
        handleUpdateUserMutationErrors(updateUser.errors);
      } else {
        updateUserFormRef.current?.resetForm();
        setPhase(RegisterPhases.REGISTER_COMPLETE);
      }
    } else {
      updateUserUnexpectedError();
    }
  };

  const [updateUserMutation] = useUpdateUserMutation({
    onCompleted: onUpdateUserCompleted,
    onError: onUpdateUserError,
    context,
  });

  const handleRegisterCompleteSubmit = async ({
    school,
    subject,
  }: UpdateUserFormValues): Promise<void> => {
    await updateUserMutation({
      variables: {
        username: R.propOr('', 'username', registeredUser),
        email: R.propOr('', 'email', registeredUser),
        title: '',
        bio: '',
        avatar: '',
        school: R.propOr('', 'id', school),
        subject: R.propOr('', 'id', subject),
      },
    });
  };

  const header = (
    <>
      {t('register:header')}
      <Emoji emoji="👋" />
    </>
  );

  const renderUsernameField = (
    <Field
      label={t('forms:username')}
      name="username"
      component={TextFormField}
      helperText={t('forms:usernameHelperText')}
    />
  );

  const renderEmailField = (
    <Field
      label={t('forms:email')}
      name="email"
      component={TextFormField}
      helperText={t('forms:emailHelperText')}
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
      <ButtonLink href={urls.login} variant="outlined" color="primary">
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

  const renderUpdateUserHelperText = (
    <FormControl>
      <FormHelperText>{t('register:updateUserHelperText')}</FormHelperText>
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
      <Button variant="outlined" color="primary" onClick={handleSkipUpdateProfile}>
        {t('common:setupLater')}
      </Button>
    </FormControl>
  );

  const renderContactUsLink = <ContactLink />;

  const renderUpdateUserFormFields = (props: FormikProps<UpdateUserFormValues>): JSX.Element => (
    <Form>
      {renderUpdateUserHelperText}
      {renderSchoolField}
      {renderSubjectField}
      {renderUpdateUserFormSubmitSection(props)}
      {renderSkipButton}
      {renderContactUsLink}
    </Form>
  );

  const renderUpdateUserForm = phase === RegisterPhases.UPDATE_USER && (
    <Formik
      initialValues={updateUserInitialValues}
      validationSchema={updateUserValidationSchema}
      onSubmit={handleRegisterCompleteSubmit}
      innerRef={updateUserFormRef}
    >
      {renderUpdateUserFormFields}
    </Formik>
  );

  const renderRegisterCompleteHelperText = (
    <Typography variant="subtitle1" align="center">
      {t('register:registerCompleteHelperText')}
    </Typography>
  );

  const renderLineBreak = <Typography component="br" />;

  const renderContinueButton = (
    <ButtonLink
      href={urls.home}
      endIcon={<ArrowForwardOutlined />}
      color="primary"
      variant="contained"
      fullWidth
    >
      {t('common:continue')}
    </ButtonLink>
  );

  const renderRegisterComplete = phase === RegisterPhases.REGISTER_COMPLETE && (
    <FormControl>
      {renderRegisterCompleteHelperText}
      {renderLineBreak}
      {renderContinueButton}
    </FormControl>
  );

  const layoutProps = {
    seoProps,
    hideBottomNavbar: true,
    topNavbarProps: {
      header,
      hideSearch: true,
      hideRegisterButton: true,
      hideGetStartedButton: true,
    },
  };

  if (userMe) {
    return <LogoutRequiredTemplate {...layoutProps} />;
  }

  return (
    <FormTemplate {...layoutProps}>
      {renderRegisterForm}
      {renderUpdateUserForm}
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
