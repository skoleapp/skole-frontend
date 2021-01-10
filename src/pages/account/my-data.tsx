import { Box, FormControl, Typography } from '@material-ui/core';
import { ArrowForwardOutlined } from '@material-ui/icons';
import { ButtonLink, FormSubmitSection, SettingsTemplate } from 'components';
import { useNotificationsContext } from 'context';
import { Form, Formik, FormikProps } from 'formik';
import { useGraphQlMyDataMutation, GraphQlMyDataMutation } from 'generated';
import { withAuth } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React, { useState } from 'react';
import { urls } from 'utils';

interface FormValues {
  general: string;
}

const MyDataPage: NextPage = () => {
  const { formRef, handleMutationErrors, onError, setUnexpectedFormError } = useForm<FormValues>();
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const { toggleNotification } = useNotificationsContext();
  const context = useLanguageHeaderContext();

  const onCompleted = async ({ myData }: GraphQlMyDataMutation): Promise<void> => {
    if (myData) {
      if (!!myData.errors && !!myData.errors.length) {
        handleMutationErrors(myData.errors);
      } else if (myData.successMessage) {
        formRef.current?.resetForm();
        toggleNotification(myData.successMessage);
        setSubmitted(true);
      } else {
        setUnexpectedFormError();
      }
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

  const initialValues = {
    general: '',
  };

  const renderHomeButton = (
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

  const renderLineBreak = <Typography component="br" />;

  const renderSubmittedText = (
    <Typography variant="subtitle1" align="center">
      {t('my-data:submitted')}
    </Typography>
  );

  const renderFormFields = (props: FormikProps<FormValues>): JSX.Element => (
    <Form>
      <Box flexGrow="1" textAlign="center">
        <Typography variant="body2">{t('my-data:helpText')}</Typography>
      </Box>
      <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
    </Form>
  );

  const renderForm = !submitted && (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} innerRef={formRef}>
      {renderFormFields}
    </Formik>
  );

  const renderSubmitted = submitted && (
    <FormControl>
      {renderSubmittedText}
      {renderLineBreak}
      {renderHomeButton}
    </FormControl>
  );

  const layoutProps = {
    seoProps: {
      title: t('my-data:title'),
      description: t('my-data:description'),
    },
    header: t('my-data:header'),
    topNavbarProps: {
      dynamicBackUrl: true,
    },
  };

  return (
    <SettingsTemplate {...layoutProps}>
      {renderForm}
      {renderSubmitted}
    </SettingsTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['my-data'], locale),
  },
});

export default withAuth(MyDataPage);
