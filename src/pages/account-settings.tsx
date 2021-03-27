import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';
import StorageOutlined from '@material-ui/icons/StorageOutlined';
import VpnKeyOutlined from '@material-ui/icons/VpnKeyOutlined';
import {
  ActionRequiredTemplate,
  AutocompleteField,
  ButtonLink,
  FormSubmitSection,
  SettingsTemplate,
  SwitchFormField,
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
  UpdateAccountSettingsMutation,
  useUpdateAccountSettingsMutation,
} from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import * as R from 'ramda';
import React, { useMemo } from 'react';
import { SeoPageProps } from 'types';
import { urls } from 'utils';
import * as Yup from 'yup';

interface UpdateAccountSettingsFormValues {
  email: string;
  school: SchoolObjectType | null;
  subject: SubjectObjectType | null;
  commentReplyEmailPermission: boolean;
  courseCommentEmailPermission: boolean;
  resourceCommentEmailPermission: boolean;
  commentReplyPushPermission: boolean;
  courseCommentPushPermission: boolean;
  resourceCommentPushPermission: boolean;
}

const useStyles = makeStyles(({ spacing }) => ({
  notificationSettings: {
    padding: spacing(4),
  },
  notificationSettingsLabel: {
    marginBottom: spacing(2),
  },
  link: {
    textAlign: 'center',
    marginTop: spacing(4),
  },
}));

const AccountSettingsPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const context = useLanguageHeaderContext();
  const { toggleNotification } = useNotificationsContext();

  const {
    userMe,
    setUserMe,
    verified,
    email,
    school,
    subject,
    commentReplyEmailPermission,
    courseCommentEmailPermission,
    resourceCommentEmailPermission,
    commentReplyPushPermission,
    courseCommentPushPermission,
    resourceCommentPushPermission,
  } = useAuthContext();

  const {
    formRef,
    handleMutationErrors,
    onError,
    setUnexpectedFormError,
    generalFormValues,
  } = useForm<UpdateAccountSettingsFormValues>();

  const onCompleted = ({ updateAccountSettings }: UpdateAccountSettingsMutation): void => {
    if (updateAccountSettings?.errors?.length) {
      handleMutationErrors(updateAccountSettings.errors);
    } else if (!!updateAccountSettings?.successMessage && !!updateAccountSettings?.user) {
      formRef.current?.setSubmitting(false);
      toggleNotification(updateAccountSettings.successMessage);
      setUserMe(updateAccountSettings.user);
    } else {
      setUnexpectedFormError();
    }
  };

  const [updateAccountSettings] = useUpdateAccountSettingsMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmit = async ({
    school,
    subject,
    ...values
  }: UpdateAccountSettingsFormValues): Promise<void> => {
    const variables = {
      school: R.prop('id', school),
      subject: R.prop('id', subject),
      ...values,
    };

    await updateAccountSettings({
      variables,
    });
  };

  const dynamicInitialValues = {
    email,
    school,
    subject,
    commentReplyEmailPermission,
    courseCommentEmailPermission,
    resourceCommentEmailPermission,
    commentReplyPushPermission,
    courseCommentPushPermission,
    resourceCommentPushPermission,
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
    email: Yup.string().email(t('validation:invalidEmail')).required(t('validation:required')),
  });

  const renderEmailField = (
    <Field name="email" component={TextFormField} label={t('forms:email')} />
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

  const renderEmailNotifications = (
    <FormControl className={classes.notificationSettings}>
      <FormLabel className={classes.notificationSettingsLabel}>
        {t('account-settings:emailNotifications')}
      </FormLabel>
      <FormGroup>
        <Field
          name="commentReplyEmailPermission"
          label={t('forms:commentReplies')}
          component={SwitchFormField}
        />
        <Field
          name="courseCommentEmailPermission"
          label={t('forms:courseComments')}
          component={SwitchFormField}
        />
        <Field
          name="resourceCommentEmailPermission"
          label={t('forms:resourceComments')}
          component={SwitchFormField}
        />
      </FormGroup>
    </FormControl>
  );

  const renderPushNotifications = (
    <FormControl className={classes.notificationSettings}>
      <FormLabel className={classes.notificationSettingsLabel}>
        {t('account-settings:pushNotifications')}
      </FormLabel>
      <FormGroup>
        <Field
          name="commentReplyPushPermission"
          label={t('forms:commentReplies')}
          component={SwitchFormField}
        />
        <Field
          name="courseCommentPushPermission"
          label={t('forms:courseComments')}
          component={SwitchFormField}
        />
        <Field
          name="resourceCommentPushPermission"
          label={t('forms:resourceComments')}
          component={SwitchFormField}
        />
      </FormGroup>
    </FormControl>
  );

  const renderChangePasswordLink = (
    <FormControl>
      <ButtonLink href={urls.changePassword} variant="outlined" endIcon={<VpnKeyOutlined />}>
        {t('common:changePassword')}
      </ButtonLink>
    </FormControl>
  );

  const renderMyDataLink = (
    <FormControl>
      <ButtonLink href={urls.myData} variant="outlined" endIcon={<StorageOutlined />}>
        {t('common:myData')}
      </ButtonLink>
    </FormControl>
  );

  const renderFormSubmitSection = (
    props: FormikProps<UpdateAccountSettingsFormValues>,
  ): JSX.Element => <FormSubmitSection submitButtonText={t('common:save')} {...props} />;

  const renderVerifyAccountLink = verified === false && (
    <FormControl className={classes.link}>
      <TextLink href={urls.verifyAccount}>{t('common:verifyAccount')}</TextLink>
    </FormControl>
  );

  const renderDeleteAccountLink = (
    <FormControl className={classes.link}>
      <TextLink href={urls.deleteAccount}>{t('common:deleteAccount')}</TextLink>
    </FormControl>
  );

  const renderFormFields = (props: FormikProps<UpdateAccountSettingsFormValues>): JSX.Element => (
    <Form>
      {renderEmailField}
      {renderSchoolField}
      {renderSubjectField}
      {renderEmailNotifications}
      {renderPushNotifications}
      {renderChangePasswordLink}
      {renderMyDataLink}
      {renderFormSubmitSection(props)}
      {renderVerifyAccountLink}
      {renderDeleteAccountLink}
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
      header: t('account-settings:header'),
      emoji: '👤',
    },
  };

  if (!userMe) {
    return <ActionRequiredTemplate variant="login" {...layoutProps} />;
  }

  return <SettingsTemplate {...layoutProps}>{renderForm}</SettingsTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const t = await getT(locale, 'account-settings');

  return {
    props: {
      _ns: await loadNamespaces(['account-settings'], locale),
      seoProps: {
        title: t('title'),
      },
    },
  };
};

export default withUserMe(AccountSettingsPage);
