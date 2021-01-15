import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import {
  AutocompleteField,
  AvatarField,
  FormSubmitSection,
  LoginRequiredTemplate,
  SettingsTemplate,
  TextFormField,
  TextLink,
} from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  AutocompleteSchoolsDocument,
  AutocompleteSubjectsDocument,
  SchoolObjectType,
  SubjectObjectType,
  UpdateUserMutation,
  UserObjectType,
  useUpdateUserMutation,
} from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { urls } from 'utils';
import * as Yup from 'yup';

interface UpdateProfileFormValues {
  username: string;
  email: string;
  title: string;
  bio: string;
  avatar: string;
  school: SchoolObjectType | null;
  subject: SubjectObjectType | null;
}

const useStyles = makeStyles(({ spacing }) => ({
  link: {
    textAlign: 'center',
    marginTop: spacing(4),
  },
}));

const EditProfilePage: NextPage = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const context = useLanguageHeaderContext();
  const { toggleNotification } = useNotificationsContext();

  const {
    userMe,
    setUserMe,
    userMeId: id,
    verified,
    username,
    email,
    title,
    bio,
    avatar,
    school,
    subject,
    profileUrl,
  } = useAuthContext();

  const {
    formRef,
    handleMutationErrors,
    onError,
    setUnexpectedFormError,
  } = useForm<UpdateProfileFormValues>();

  const onCompleted = ({ updateUser }: UpdateUserMutation): void => {
    if (updateUser) {
      if (!!updateUser.errors && !!updateUser.errors.length) {
        handleMutationErrors(updateUser.errors);
      } else if (updateUser.successMessage) {
        formRef.current?.setSubmitting(false);
        toggleNotification(updateUser.successMessage);
        setUserMe(updateUser.user as UserObjectType);
      } else {
        setUnexpectedFormError();
      }
    } else {
      setUnexpectedFormError();
    }
  };

  const [updateUserMutation] = useUpdateUserMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmit = async (values: UpdateProfileFormValues): Promise<void> => {
    const { username, email, title, bio, avatar, school, subject } = values;

    await updateUserMutation({
      variables: {
        username,
        email,
        title,
        bio,
        avatar,
        school: R.propOr('', 'id', school),
        subject: R.propOr('', 'id', subject),
      },
    });
  };

  const initialValues = {
    id,
    title,
    username,
    email,
    bio,
    avatar,
    school,
    subject,
    general: '',
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string(),
    username: Yup.string().required(t('validation:required')),
    email: Yup.string().email(t('validation:invalidEmail')).required(t('validation:required')),
    bio: Yup.string(),
    school: Yup.object().nullable(),
    subject: Yup.object().nullable(),
  });

  const renderAvatarField = (props: FormikProps<UpdateProfileFormValues>): JSX.Element => (
    <AvatarField {...props} />
  );

  const renderTitleField = (
    <Field name="title" component={TextFormField} label={t('forms:titleOptional')} />
  );

  const renderUsernameField = (
    <Field
      name="username"
      component={TextFormField}
      label={t('forms:username')}
      helperText={t('forms:usernameHelperText')}
    />
  );

  const renderEmailField = (
    <Field
      name="email"
      component={TextFormField}
      label={t('forms:email')}
      helperText={t('forms:emailHelperText')}
    />
  );

  const renderBioField = (
    <Field name="bio" component={TextFormField} label={t('forms:bioOptional')} rows="4" multiline />
  );

  const renderSchoolField = (
    <Field
      name="school"
      label={t('forms:schoolOptional')}
      dataKey="autocompleteSchools"
      searchKey="name"
      document={AutocompleteSchoolsDocument}
      component={AutocompleteField}
      helperText={t('forms:schoolHelpText')}
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
      helperText={t('forms:subjectHelpText')}
    />
  );

  const renderFormSubmitSection = (props: FormikProps<UpdateProfileFormValues>): JSX.Element => (
    <FormSubmitSection submitButtonText={t('common:save')} {...props} />
  );

  const renderVerifyAccountLink = verified === false && (
    <FormControl className={classes.link}>
      <TextLink href={urls.verifyAccount}>{t('common:verifyAccount')}</TextLink>
    </FormControl>
  );

  const renderBackToProfileLink = (
    <FormControl className={classes.link}>
      <TextLink href={profileUrl}>{t('edit-profile:backToProfile')}</TextLink>
    </FormControl>
  );

  const renderDeleteProfileLink = (
    <FormControl className={classes.link}>
      <TextLink href={urls.deleteAccount}>{t('common:deleteAccount')}</TextLink>
    </FormControl>
  );

  const renderFormFields = (props: FormikProps<UpdateProfileFormValues>): JSX.Element => (
    <Form>
      {renderAvatarField(props)}
      {renderTitleField}
      {renderUsernameField}
      {renderEmailField}
      {renderBioField}
      {renderSchoolField}
      {renderSubjectField}
      {renderFormSubmitSection(props)}
      {renderVerifyAccountLink}
      {renderBackToProfileLink}
      {renderDeleteProfileLink}
    </Form>
  );

  const renderForm = (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      innerRef={formRef}
    >
      {renderFormFields}
    </Formik>
  );

  const layoutProps = {
    seoProps: {
      title: t('edit-profile:title'),
    },
    topNavbarProps: {
      header: t('edit-profile:header'),
    },
  };

  if (!userMe) {
    return <LoginRequiredTemplate {...layoutProps} />;
  }

  return <SettingsTemplate {...layoutProps}>{renderForm}</SettingsTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['edit-profile'], locale),
  },
});

export default withUserMe(EditProfilePage);
