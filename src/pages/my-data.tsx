import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { ActionRequiredTemplate, ButtonLink, FormSubmitSection, FormTemplate } from 'components';
import { useAuthContext, useNotificationsContext } from 'context';
import { Form, Formik, FormikProps, FormikValues } from 'formik';
import { GraphQlMyDataMutation, useGraphQlMyDataMutation } from 'generated';
import { withUserMe } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { getT, loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React, { useState } from 'react';
import { SeoPageProps } from 'types';
import { urls } from 'utils';

const MyDataPage: NextPage<SeoPageProps> = ({ seoProps }) => {
  const {
    formRef,
    handleMutationErrors,
    onError,
    setUnexpectedFormError,
    generalFormValues,
  } = useForm<FormikValues>();

  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const { toggleNotification } = useNotificationsContext();
  const { userMe } = useAuthContext();
  const context = useLanguageHeaderContext();

  const onCompleted = async ({ myData }: GraphQlMyDataMutation): Promise<void> => {
    if (myData?.errors?.length) {
      handleMutationErrors(myData.errors);
    } else if (myData?.successMessage) {
      formRef.current?.resetForm();
      toggleNotification(myData.successMessage);
      setSubmitted(true);
      sa_event('request_data');
    } else {
      setUnexpectedFormError();
    }
  };

  const [myData] = useGraphQlMyDataMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmit = async (): Promise<void> => {
    await myData();
  };

  const renderFormFields = (props: FormikProps<FormikValues>): JSX.Element => (
    <Form>
      <FormControl>
        <Typography className="form-text" variant="subtitle1">
          {t('my-data:helpText')}
        </Typography>
      </FormControl>
      <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
      <FormControl>
        <ButtonLink href={urls.accountSettings} variant="outlined">
          {t('my-data:backToAccountSettings')}
        </ButtonLink>
      </FormControl>
    </Form>
  );

  const renderForm = !submitted && (
    <Formik initialValues={generalFormValues} onSubmit={handleSubmit} innerRef={formRef}>
      {renderFormFields}
    </Formik>
  );

  const renderSubmittedText = (
    <FormControl>
      <Typography className="form-text" variant="subtitle1">
        {t('my-data:submitted')}
      </Typography>
    </FormControl>
  );

  const renderHomeButton = (
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

  const renderSubmitted = submitted && (
    <>
      {renderSubmittedText}
      {renderHomeButton}
    </>
  );

  const layoutProps = {
    seoProps,
    topNavbarProps: {
      header: t('my-data:header'),
      emoji: '💾',
    },
  };

  if (!userMe) {
    return <ActionRequiredTemplate variant="login" {...layoutProps} />;
  }

  return (
    <FormTemplate {...layoutProps}>
      {renderForm}
      {renderSubmitted}
    </FormTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const t = await getT(locale, 'my-data');

  return {
    props: {
      _ns: await loadNamespaces(['my-data'], locale),
      seoProps: {
        title: t('title'),
      },
    },
  };
};

export default withUserMe(MyDataPage);
