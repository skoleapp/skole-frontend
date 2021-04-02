import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';
import StorageOutlined from '@material-ui/icons/StorageOutlined';
import VpnKeyOutlined from '@material-ui/icons/VpnKeyOutlined';
import {
  ButtonLink,
  FormSubmitSection,
  SettingsTemplate,
  SwitchFormField,
  TextFormField,
  TextLink,
} from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import { UpdateAccountSettingsMutation, useUpdateAccountSettingsMutation } from 'generated';
import { withAuthRequired } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React, { useCallback, useMemo } from 'react';
import { urls } from 'utils';
import * as Yup from 'yup';

interface UpdateAccountSettingsFormValues {
  email: string;
  backupEmail: string;
  commentReplyEmailPermission: boolean;
  threadCommentEmailPermission: boolean;
  newBadgeEmailPermission: boolean;
  commentReplyPushPermission: boolean;
  threadCommentPushPermission: boolean;
  newBadgePushPermission: boolean;
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

const AccountSettingsPage: NextPage = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const context = useLanguageHeaderContext();
  const { toggleNotification } = useNotificationsContext();

  const {
    setUserMe,
    verified,
    email,
    backupEmail,
    commentReplyEmailPermission,
    threadCommentEmailPermission,
    newBadgeEmailPermission,
    commentReplyPushPermission,
    threadCommentPushPermission,
    newBadgePushPermission,
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

  const handleSubmit = useCallback(
    async (variables: UpdateAccountSettingsFormValues): Promise<void> => {
      await updateAccountSettings({
        variables,
      });
    },
    [updateAccountSettings],
  );

  const initialValues = useMemo(
    () => ({
      ...generalFormValues,
      email,
      backupEmail,
      commentReplyEmailPermission,
      threadCommentEmailPermission,
      newBadgeEmailPermission,
      commentReplyPushPermission,
      threadCommentPushPermission,
      newBadgePushPermission,
    }),
    [
      email,
      backupEmail,
      commentReplyEmailPermission,
      threadCommentEmailPermission,
      newBadgeEmailPermission,
      commentReplyPushPermission,
      threadCommentPushPermission,
      newBadgePushPermission,
      generalFormValues,
    ],
  );

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t('validation:invalidEmail')).required(t('validation:required')),
    backupEmail: Yup.string().email(t('validation:invalidEmail')),
  });

  const renderEmailField = useMemo(
    () => <Field name="email" component={TextFormField} label={t('forms:email')} />,
    [t],
  );

  const renderBackupEmailField = useMemo(
    () => (
      <Field
        name="backupEmail"
        component={TextFormField}
        label={t('account-settings:backupEmail')}
        helperText={t('account-settings:backupEmailHelperText')}
      />
    ),
    [t],
  );

  const renderEmailNotifications = useMemo(
    () => (
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
            name="threadCommentEmailPermission"
            label={t('forms:threadComments')}
            component={SwitchFormField}
          />
          <Field
            name="newBadgeEmailPermission"
            label={t('forms:newBadges')}
            component={SwitchFormField}
          />
        </FormGroup>
      </FormControl>
    ),
    [classes.notificationSettings, classes.notificationSettingsLabel, t],
  );

  const renderPushNotifications = useMemo(
    () => (
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
            name="threadCommentPushPermission"
            label={t('forms:threadComments')}
            component={SwitchFormField}
          />
          <Field
            name="newBadgePushPermission"
            label={t('forms:newBadges')}
            component={SwitchFormField}
          />
        </FormGroup>
      </FormControl>
    ),
    [classes.notificationSettings, classes.notificationSettingsLabel, t],
  );

  const renderChangePasswordLink = useMemo(
    () => (
      <FormControl>
        <ButtonLink href={urls.changePassword} variant="outlined" endIcon={<VpnKeyOutlined />}>
          {t('common:changePassword')}
        </ButtonLink>
      </FormControl>
    ),
    [t],
  );

  const renderMyDataLink = useMemo(
    () => (
      <FormControl>
        <ButtonLink href={urls.myData} variant="outlined" endIcon={<StorageOutlined />}>
          {t('common:myData')}
        </ButtonLink>
      </FormControl>
    ),
    [t],
  );

  const renderFormSubmitSection = useCallback(
    (props: FormikProps<UpdateAccountSettingsFormValues>): JSX.Element => (
      <FormSubmitSection submitButtonText={t('common:save')} {...props} />
    ),
    [t],
  );

  const renderVerifyAccountLink = useMemo(
    () =>
      verified === false && (
        <FormControl className={classes.link}>
          <TextLink href={urls.verifyAccount}>{t('common:verifyAccount')}</TextLink>
        </FormControl>
      ),
    [classes.link, t, verified],
  );

  const renderDeleteAccountLink = useMemo(
    () => (
      <FormControl className={classes.link}>
        <TextLink href={urls.deleteAccount}>{t('common:deleteAccount')}</TextLink>
      </FormControl>
    ),
    [classes.link, t],
  );

  const renderFormFields = useCallback(
    (props: FormikProps<UpdateAccountSettingsFormValues>): JSX.Element => (
      <Form>
        {renderEmailField}
        {renderBackupEmailField}
        {renderEmailNotifications}
        {renderPushNotifications}
        {renderChangePasswordLink}
        {renderMyDataLink}
        {renderFormSubmitSection(props)}
        {renderVerifyAccountLink}
        {renderDeleteAccountLink}
      </Form>
    ),
    [
      renderChangePasswordLink,
      renderDeleteAccountLink,
      renderEmailField,
      renderBackupEmailField,
      renderEmailNotifications,
      renderFormSubmitSection,
      renderMyDataLink,
      renderPushNotifications,
      renderVerifyAccountLink,
    ],
  );

  const renderForm = useMemo(
    () => (
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        innerRef={formRef}
        enableReinitialize
      >
        {renderFormFields}
      </Formik>
    ),
    [formRef, handleSubmit, initialValues, renderFormFields, validationSchema],
  );

  const layoutProps = {
    seoProps: {
      title: t('account-settings:title'),
    },
    topNavbarProps: {
      header: t('account-settings:header'),
      emoji: '👤',
    },
  };

  return <SettingsTemplate {...layoutProps}>{renderForm}</SettingsTemplate>;
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['account-settings'], locale),
  },
});

export default withAuthRequired(AccountSettingsPage);
