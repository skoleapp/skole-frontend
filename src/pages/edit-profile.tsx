import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import {
  ActionRequiredTemplate,
  AvatarField,
  FormSubmitSection,
  SettingsTemplate,
  TextFormField,
  TextLink,
} from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import { UpdateProfileMutation, useUpdateProfileMutation } from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React, { useMemo } from 'react';
import { SeoPageProps } from 'types';
import { urls } from 'utils';
import * as Yup from 'yup';

interface UpdateProfileFormValues {
  username: string;
  title: string;
  bio: string;
  avatar: string;
}

const useStyles = makeStyles(({ spacing }) => ({
  link: {
    textAlign: 'center',
    marginTop: spacing(4),
  },
}));

const EditProfilePage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const context = useLanguageHeaderContext();
  const { toggleNotification } = useNotificationsContext();
  const { userMe, setUserMe, verified, username, title, bio, avatar } = useAuthContext();

  const {
    formRef,
    handleMutationErrors,
    onError,
    setUnexpectedFormError,
    generalFormValues,
  } = useForm<UpdateProfileFormValues>();

  const onCompleted = ({ updateProfile }: UpdateProfileMutation): void => {
    if (updateProfile?.errors?.length) {
      handleMutationErrors(updateProfile.errors);
    } else if (!!updateProfile?.successMessage && !!updateProfile?.user) {
      formRef.current?.setSubmitting(false);
      toggleNotification(updateProfile.successMessage);
      setUserMe(updateProfile.user);
    } else {
      setUnexpectedFormError();
    }
  };

  const [updateProfileMutation] = useUpdateProfileMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmit = async ({
    username,
    title,
    bio,
    avatar,
  }: UpdateProfileFormValues): Promise<void> => {
    await updateProfileMutation({
      variables: {
        username,
        title,
        bio,
        avatar,
      },
    });
  };

  const dynamicInitialValues = {
    title,
    username,
    bio,
    avatar,
  };

  // Only re-render when one of the dynamic values changes - the form values will reset every time.
  const initialValues = useMemo(
    () => ({
      ...generalFormValues,
      ...dynamicInitialValues,
    }),
    // Ignore: ESLint cannot infer the values in the dependency array.
    Object.values(dynamicInitialValues), // eslint-disable-line react-hooks/exhaustive-deps
  );

  const validationSchema = Yup.object().shape({
    username: Yup.string().required(t('validation:required')),
  });

  const renderAvatarField = (props: FormikProps<UpdateProfileFormValues>): JSX.Element => (
    <AvatarField {...props} />
  );

  const renderTitleField = (
    <Field name="title" component={TextFormField} label={t('forms:titleOptional')} />
  );

  const renderUsernameField = (
    <Field name="username" component={TextFormField} label={t('forms:username')} />
  );

  const renderBioField = (
    <Field name="bio" component={TextFormField} label={t('forms:bioOptional')} rows="4" multiline />
  );

  const renderFormSubmitSection = (props: FormikProps<UpdateProfileFormValues>): JSX.Element => (
    <FormSubmitSection submitButtonText={t('common:save')} {...props} />
  );

  const renderVerifyAccountLink = verified === false && (
    <FormControl className={classes.link}>
      <TextLink href={urls.verifyAccount}>{t('common:verifyAccount')}</TextLink>
    </FormControl>
  );

  const renderFormFields = (props: FormikProps<UpdateProfileFormValues>): JSX.Element => (
    <Form>
      {renderAvatarField(props)}
      {renderTitleField}
      {renderUsernameField}
      {renderBioField}
      {renderFormSubmitSection(props)}
      {renderVerifyAccountLink}
    </Form>
  );

  const renderForm = (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      innerRef={formRef}
      enableReinitialize
    >
      {renderFormFields}
    </Formik>
  );

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: t('edit-profile:header'),
      emoji: '🖊️',
    },
  };

  if (!userMe) {
    return <ActionRequiredTemplate variant="login" {...layoutProps} />;
  }

  return <SettingsTemplate {...layoutProps}>{renderForm}</SettingsTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const t = await getT(locale, 'edit-profile');

  return {
    props: {
      _ns: await loadNamespaces(['edit-profile'], locale),
      seoProps: {
        title: t('title'),
      },
    },
  };
};

export default withUserMe(EditProfilePage);
