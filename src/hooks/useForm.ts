import { ApolloError } from '@apollo/client';
import { FormikProps, FormikValues } from 'formik';
import { useTranslation } from 'lib';
import { useRef } from 'react';
import { MutationErrors, MutationFormError, UseForm } from 'types';
import { formatFormError } from 'utils';

const snakeCaseToCamelCase = (str: string): string => {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', ''),
  );
};

// A custom hook that provides useful helpers for integrating Formik with GraphQL mutations.
export const useForm = <T extends FormikValues>(): UseForm<T> => {
  const { t } = useTranslation();
  const formRef = useRef<FormikProps<T>>(null!);

  const setFormErrors = (formErrors: FormikValues): void =>
    Object.keys(formErrors).forEach((key) => formRef.current.setFieldError(key, formErrors[key]));

  const unexpectedError = (): void => setFormErrors({ general: t('validation:unexpectedError') });
  const setSubmitting = (val: boolean): void | null => formRef.current.setSubmitting(val);
  const resetForm = (): void | null => formRef.current.resetForm();
  const submitForm = (): Promise<void> | null => formRef.current.submitForm();

  const setFieldValue = (fieldName: string, val: unknown): void =>
    formRef.current.setFieldValue(fieldName, val);

  const setFieldError = (fieldName: string, val: string): void =>
    formRef.current.setFieldError(fieldName, val);

  // Set form errors either for specific fields or as general errors.
  const handleMutationErrors = (err: MutationErrors): void => {
    const formErrors: FormikValues = { general: '' };

    if (err.length) {
      (err as MutationFormError[]).map((e: MutationFormError) => {
        const msg = formatFormError(e);
        if (e.field === '__all__') {
          formErrors.general = msg;
        } else if (e.field) {
          formErrors[snakeCaseToCamelCase(e.field)] = msg;
        } else {
          formErrors.general = msg;
        }
      });
    } else {
      formErrors.general = t('validation:unexpectedError');
    }

    setSubmitting(false);
    setFormErrors(formErrors);
  };

  // Set general form error due to network error or any unexpected error.
  const onError = (err: ApolloError): void => {
    const formErrors = { general: '' };

    if (err.networkError) {
      formErrors.general = t('validation:networkError');
    } else {
      formErrors.general = t('validation:unexpectedError');
    }

    setSubmitting(false);
    setFormErrors(formErrors);
  };

  return {
    formRef,
    handleMutationErrors,
    onError,
    setSubmitting,
    resetForm,
    submitForm,
    setFieldValue,
    setFieldError,
    unexpectedError,
  };
};
