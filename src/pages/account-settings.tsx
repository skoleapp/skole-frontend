import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';
import StorageOutlined from '@material-ui/icons/StorageOutlined';
import VpnKeyOutlined from '@material-ui/icons/VpnKeyOutlined';
import {
  ButtonLink,
  FormSubmitSection,
  PrimaryEmailField,
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
  deleteAccountLink: {
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
    verifiedBackupEmail,
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

  const initialErrors = useMemo(() => {
    const renderNeedToVerifyAccountError = (
      <>
        {t('account-settings:needToVerifyAccount')}{' '}
        <TextLink href={urls.verifyAccount}>{t('account-settings:hereLink')}</TextLink>
      </>
    );
    const renderNeedToVerifyBackupEmailError = (
      <>
        {t('account-settings:needToVerifyBackupEmail')}{' '}
        <TextLink href={urls.verifyBackupEmail}>{t('account-settings:hereLink')}</TextLink>
      </>
    );

    return {
      ...(verified === false && { email: renderNeedToVerifyAccountError }),
      ...(!verifiedBackupEmail && { backupEmail: renderNeedToVerifyBackupEmailError }),
    };
  }, [verified, verifiedBackupEmail, t]);

  const onCompleted = ({ updateAccountSettings }: UpdateAccountSettingsMutation): void => {
    if (updateAccountSettings?.errors?.length) {
      handleMutationErrors(updateAccountSettings.errors);
    } else if (!!updateAccountSettings?.successMessage && !!updateAccountSettings?.user) {
      formRef.current?.setSubmitting(false);
      toggleNotification(updateAccountSettings.successMessage);
      setUserMe(updateAccountSettings.user);
      // @ts-ignore: Error messages should be strings but JSX.Elements at least seem to work fine here.
      formRef.current?.setErrors(initialErrors);
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

  const initialTouched = useMemo(
    () => ({
      ...(verified === false && { email: true }),
      ...(!verifiedBackupEmail && { backupEmail: true }),
    }),
    [verified, verifiedBackupEmail],
  );

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t('validation:invalidEmail')).required(t('validation:required')),
    backupEmail: Yup.string().email(t('validation:invalidEmail')),
  });

  const renderEmailField = useCallback(
    (props: FormikProps<UpdateAccountSettingsFormValues>) => <PrimaryEmailField {...props} />,
    [],
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

  const renderDeleteAccountLink = useMemo(
    () => (
      <FormControl className={classes.deleteAccountLink}>
        <TextLink href={urls.deleteAccount}>{t('common:deleteAccount')}</TextLink>
      </FormControl>
    ),
    [classes.deleteAccountLink, t],
  );

  const renderFormFields = useCallback(
    (props: FormikProps<UpdateAccountSettingsFormValues>): JSX.Element => (
      <Form>
        {renderEmailField(props)}
        {renderBackupEmailField}
        {renderEmailNotifications}
        {renderPushNotifications}
        {renderChangePasswordLink}
        {renderMyDataLink}
        {renderFormSubmitSection(props)}
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
    ],
  );

  const renderForm = useMemo(
    () => (
      <Formik
        initialValues={initialValues}
        // @ts-ignore: Error messages should be strings but JSX.Elements at least seem to work fine here.
        initialErrors={initialErrors}
        initialTouched={initialTouched}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        innerRef={formRef}
        enableReinitialize
      >
        {renderFormFields}
      </Formik>
    ),
    [
      formRef,
      handleSubmit,
      initialValues,
      initialErrors,
      initialTouched,
      renderFormFields,
      validationSchema,
    ],
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
