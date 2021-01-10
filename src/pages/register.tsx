import { FormControl, FormHelperText, makeStyles, Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import {
  AutocompleteField,
  ButtonLink,
  FormTemplate,
  FormSubmitSection,
  PasswordField,
  TextFormField,
  TextLink,
  LanguageButton,
  ContactLink,
} from 'components';
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
import { withNoAuth } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import * as R from 'ramda';
import React, { useState } from 'react';
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

interface UpdateUserFormValues {
  school: SchoolObjectType | null;
  subject: SubjectObjectType | null;
}

enum RegisterPhases {
  REGISTER = 'register',
  UPDATE_USER = 'update-user',
  REGISTER_COMPLETE = 'register-complete',
}

const RegisterPage: NextPage = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [phase, setPhase] = useState(RegisterPhases.REGISTER);
  const context = useLanguageHeaderContext();

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

  const getHeader = (): string => {
    switch (phase) {
      case RegisterPhases.REGISTER: {
        return t('register:header');
      }

      case RegisterPhases.UPDATE_USER: {
        return t('register:updateUserHeader');
      }

      case RegisterPhases.REGISTER_COMPLETE: {
        return t('register:registerCompleteHeader');
      }
    }
  };

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

  const renderLanguageButton = <LanguageButton />;

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

  const renderLoginLink = (
    <FormControl className={classes.link}>
      <TextLink href={urls.login}>{t('common:login')}</TextLink>
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
      {renderLoginLink}
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

  const renderRegisterCompleteHelpText = (
    <FormControl>
      <FormHelperText>{t('register:registerCompleteHelpText')}</FormHelperText>
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
    <FormControl className={classes.link}>
      <TextLink href="#" onClick={handleSkipUpdateProfile}>
        {t('common:skip')}
      </TextLink>
    </FormControl>
  );

  const renderContactUsLink = <ContactLink />;

  const renderUpdateUserFormFields = (props: FormikProps<UpdateUserFormValues>): JSX.Element => (
    <Form>
      {renderRegisterCompleteHelpText}
      {renderSchoolField}
      {renderSubjectField}
      {renderContactUsLink}
      {renderUpdateUserFormSubmitSection(props)}
      {renderSkipButton}
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

  const renderRegisterComplete = phase === RegisterPhases.REGISTER_COMPLETE && (
    <FormControl>
      <Typography variant="subtitle1" align="center">
        {t('register:registerCompleteEmailSent')}
      </Typography>
      <Typography component="br" />
      <ButtonLink
        href={urls.home}
        endIcon={<ArrowForwardOutlined />}
        color="primary"
        variant="contained"
        fullWidth
      >
        {t('common:continue')}
      </ButtonLink>
    </FormControl>
  );

  const layoutProps = {
    seoProps: {
      title: t('register:title'),
      description: t('register:description'),
    },
    header: getHeader(),
    hideBottomNavbar: true,
    topNavbarProps: {
      headerRight: renderLanguageButton,
      dynamicBackUrl: true,
      hideSearch: true,
      hideAuthButtons: true,
    },
  };

  return (
    <FormTemplate {...layoutProps}>
      {renderRegisterForm}
      {renderUpdateUserForm}
      {renderRegisterComplete}
    </FormTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['register'], locale),
  },
});

export default withNoAuth(RegisterPage);
