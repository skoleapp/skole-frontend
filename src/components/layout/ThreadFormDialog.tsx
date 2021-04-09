import DialogContent from '@material-ui/core/DialogContent';
import { useNotificationsContext, useThreadFormContext } from 'context';
import { Field, Form, Formik, FormikProps } from 'formik';
import { CreateThreadMutation, useCreateThreadMutation } from 'generated';
import { useForm, useLanguageHeaderContext } from 'hooks';
import { useTranslation } from 'lib';
import Router from 'next/router';
import React, { useCallback, useMemo } from 'react';
import { urls } from 'utils';
import * as Yup from 'yup';

import { DialogHeader, SkoleDialog } from '../dialogs';
import { FormSubmitSection, ImageField, TextFormField } from '../form-fields';
import { TextLink } from '../shared';

interface CreateThreadFormValues {
  title: string;
  text: string;
  image: string;
}

export const ThreadFormDialog: React.FC = () => {
  const {
    threadFormOpen,
    handleCloseThreadForm,
    threadFormParams: { title },
  } = useThreadFormContext();

  const { t } = useTranslation();
  const { toggleNotification } = useNotificationsContext();
  const context = useLanguageHeaderContext();

  const {
    formRef,
    generalFormValues,
    handleMutationErrors,
    setUnexpectedFormError: onError,
  } = useForm<CreateThreadFormValues>();

  const onCompleted = async ({ createThread }: CreateThreadMutation): Promise<void> => {
    if (createThread?.errors?.length) {
      handleMutationErrors(createThread.errors);
    } else if (!!createThread?.thread?.slug && !!createThread?.successMessage) {
      formRef.current?.resetForm();
      toggleNotification(createThread.successMessage);
      handleCloseThreadForm();

      await Router.push({
        pathname: urls.thread(createThread.thread.slug),
        query: {
          invite: '',
        },
      });
    } else {
      onError();
    }
  };

  const [createThread] = useCreateThreadMutation({
    onCompleted,
    onError,
    context,
  });

  const handleSubmit = useCallback(
    async ({ title, text, image }: CreateThreadFormValues): Promise<void> => {
      const variables = {
        title,
        text,
        image,
      };

      await createThread({ variables });
    },
    [createThread],
  );

  const initialValues = useMemo(
    () => ({
      ...generalFormValues,
      title,
      text: '',
      image: '',
    }),
    [generalFormValues, title],
  );

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(t('validation:required')),
  });

  const renderHeader = useMemo(
    () => (
      <DialogHeader onClose={handleCloseThreadForm} text={t('common:createThread')} emoji="💬" />
    ),
    [handleCloseThreadForm, t],
  );

  const renderTitleField = useMemo(
    () => <Field name="title" label={t('forms:title')} component={TextFormField} autoFocus />,
    [t],
  );

  const renderTextFieldHelperText = useMemo(
    () => (
      <>
        {t('forms:markdownHelperText')}{' '}
        <TextLink href="https://commonmark.org/help/" target="_blank">
          {t('forms:markdownHelperTextLink')}
        </TextLink>
        .
      </>
    ),
    [t],
  );

  const renderTextField = useMemo(
    () => (
      <Field
        name="text"
        label={t('forms:text')}
        component={TextFormField}
        helperText={renderTextFieldHelperText}
        multiline
        rowsMax="10"
        rows="4"
      />
    ),
    [t, renderTextFieldHelperText],
  );

  const renderImageField = useMemo(() => <Field name="image" component={ImageField} />, []);

  const renderFormSubmitSection = useCallback(
    (props: FormikProps<CreateThreadFormValues>): JSX.Element => (
      <FormSubmitSection submitButtonText={t('forms:create')} {...props} />
    ),
    [t],
  );

  const renderFormFields = useCallback(
    (props: FormikProps<CreateThreadFormValues>): JSX.Element => (
      <Form>
        {renderTitleField}
        {renderTextField}
        {renderImageField}
        {renderFormSubmitSection(props)}
      </Form>
    ),
    [renderFormSubmitSection, renderTitleField, renderTextField, renderImageField],
  );

  const renderForm = useMemo(
    () => (
      <DialogContent>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          innerRef={formRef}
          enableReinitialize
        >
          {renderFormFields}
        </Formik>
      </DialogContent>
    ),
    [formRef, initialValues, renderFormFields, validationSchema, handleSubmit],
  );

  return (
    <SkoleDialog open={threadFormOpen} onClose={handleCloseThreadForm}>
      {renderHeader}
      {renderForm}
    </SkoleDialog>
  );
};
