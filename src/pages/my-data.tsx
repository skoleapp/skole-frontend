import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import { ButtonLink, FormSubmitSection, FormTemplate } from 'components';
import { useNotificationsContext } from 'context';
import { Form, Formik, FormikProps, FormikValues } from 'formik';
import { GraphQlMyDataMutation, useGraphQlMyDataMutation } from 'generated';
import { withAuthRequired } from 'hocs';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React, { useCallback, useMemo, useState } from 'react';
import { urls } from 'utils';

const MyDataPage: NextPage = () => {
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

  const handleSubmit = useCallback(async (): Promise<void> => {
    await myData();
  }, [myData]);

  const renderFormFields = useCallback(
    (props: FormikProps<FormikValues>): JSX.Element => (
      <Form>
        <FormControl>
          <Typography className="form-text" variant="subtitle1">
            {t('my-data:helpText')}
          </Typography>
        </FormControl>
        <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
      </Form>
    ),
    [t],
  );

  const renderForm = useMemo(
    () =>
      !submitted && (
        <Formik initialValues={generalFormValues} onSubmit={handleSubmit} innerRef={formRef}>
          {renderFormFields}
        </Formik>
      ),
    [formRef, generalFormValues, handleSubmit, renderFormFields, submitted],
  );

  const renderSubmittedText = useMemo(
    () => (
      <FormControl>
        <Typography className="form-text" variant="subtitle1">
          {t('my-data:submitted')}
        </Typography>
      </FormControl>
    ),
    [t],
  );

  const renderHomeButton = useMemo(
    () => (
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
    ),
    [t],
  );

  const renderSubmitted = useMemo(
    () =>
      submitted && (
        <>
          {renderSubmittedText}
          {renderHomeButton}
        </>
      ),
    [renderHomeButton, renderSubmittedText, submitted],
  );

  const layoutProps = {
    seoProps: {
      title: t('my-data:title'),
    },
    topNavbarProps: {
      header: t('my-data:header'),
      emoji: '💾',
    },
  };

  return (
    <FormTemplate {...layoutProps}>
      {renderForm}
      {renderSubmitted}
    </FormTemplate>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    _ns: await loadNamespaces(['my-data'], locale),
  },
});

export default withAuthRequired(MyDataPage);
