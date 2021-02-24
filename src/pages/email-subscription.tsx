import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  EmailSubscription,
  ErrorTemplate,
  FormSubmitSection,
  FormTemplate,
  LoadingTemplate,
  SwitchFormField,
  TextLink,
} from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import {
  UpdateEmailSubscriptionMutation,
  useEmailSubscriptionQuery,
  useUpdateEmailSubscriptionMutation,
} from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useEffect, useMemo, useState } from 'react';
import { SeoPageProps } from 'types';
import { urls } from 'utils';

interface UpdateEmailSubscriptionFormValues {
  productUpdates: boolean;
  blogPosts: boolean;
}

const useStyles = makeStyles(({ spacing }) => ({
  formControl: {
    padding: spacing(4),
  },
  formLabel: {
    marginBottom: spacing(2),
  },
  accountSettingsLink: {
    marginTop: spacing(8),
  },
}));

const EmailSubscriptionPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const {
    formRef,
    handleMutationErrors,
    onError,
    setUnexpectedFormError,
    generalFormValues,
  } = useForm<UpdateEmailSubscriptionFormValues>();

  const classes = useStyles();
  const { userMe } = useAuthContext();
  const { t } = useTranslation();
  const { toggleNotification } = useNotificationsContext();
  const context = useLanguageHeaderContext();
  const { query } = useRouter();
  const token = String(query.token);
  const { data, loading, error } = useEmailSubscriptionQuery({ context, variables: { token } });

  const [
    emailSubscription,
    setEmailSubscription,
  ] = useState<UpdateEmailSubscriptionFormValues | null>(null);

  const email = R.prop('email', emailSubscription);

  useEffect(() => {
    setEmailSubscription(R.prop('emailSubscription', data));
  }, [data]);

  const onCompleted = ({ updateEmailSubscription }: UpdateEmailSubscriptionMutation): void => {
    if (updateEmailSubscription?.errors?.length) {
      handleMutationErrors(updateEmailSubscription.errors);
    } else if (
      updateEmailSubscription?.successMessage &&
      updateEmailSubscription.emailSubscription !== undefined
    ) {
      formRef.current?.resetForm();
      setEmailSubscription(updateEmailSubscription.emailSubscription);
      toggleNotification(updateEmailSubscription.successMessage);
    } else {
      setUnexpectedFormError();
    }
  };

  const [updateEmailSubscription] = useUpdateEmailSubscriptionMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmit = async ({
    productUpdates,
    blogPosts,
  }: UpdateEmailSubscriptionFormValues): Promise<void> => {
    const variables = {
      token,
      productUpdates,
      blogPosts,
    };

    await updateEmailSubscription({ variables });
  };

  // Only re-render when one of the dynamic values changes - the form values will reset every time.
  const initialValues = useMemo(
    () => ({
      ...generalFormValues,
      productUpdates: R.prop('productUpdates', emailSubscription),
      blogPosts: R.prop('blogPosts', emailSubscription),
    }),
    [emailSubscription],
  );

  const renderFormLabel = !!email && (
    <FormLabel className={classes.formLabel}>{t('email-subscription:label', { email })}</FormLabel>
  );

  const renderFormGroup = (
    <FormGroup>
      <Field name="productUpdates" label={t('forms:productUpdates')} component={SwitchFormField} />
      <Field name="blogPosts" label={t('forms:blogPosts')} component={SwitchFormField} />
    </FormGroup>
  );

  const renderFormFields = (props: FormikProps<UpdateEmailSubscriptionFormValues>): JSX.Element => (
    <Form>
      <FormControl className={classes.formControl}>
        {renderFormLabel}
        {renderFormGroup}
      </FormControl>
      <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
    </Form>
  );

  const renderForm = (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      innerRef={formRef}
      enableReinitialize
    >
      {renderFormFields}
    </Formik>
  );

  const renderAccountSettingsLink = !!userMe && (
    <Typography className={classes.accountSettingsLink} variant="body2" align="center">
      {t('email-subscription:accountSettingsText')}{' '}
      <TextLink href={urls.accountSettings}>
        {t('email-subscription:accountSettingsLinkText')}
      </TextLink>
      .
    </Typography>
  );

  const renderUnsubscribed = !emailSubscription && (
    <FormControl>
      <EmailSubscription header={t('email-subscription:unsubscribed')} />
    </FormControl>
  );

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: t('email-subscription:header'),
      emoji: '📨',
    },
  };

  if (loading) {
    return <LoadingTemplate seoProps={seoProps} />;
  }

  if (!!error && !!error.networkError) {
    return <ErrorTemplate variant="offline" seoProps={seoProps} />;
  }

  if (error) {
    return <ErrorTemplate variant="error" seoProps={seoProps} />;
  }

  return (
    <FormTemplate {...layoutProps}>
      {renderUnsubscribed || renderForm}
      {renderAccountSettingsLink}
    </FormTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const t = await getT(locale, 'email-subscription');

  return {
    props: {
      _ns: await loadNamespaces(['email-subscription'], locale),
      seoProps: {
        title: t('title'),
      },
    },
  };
};

export default withUserMe(EmailSubscriptionPage);
