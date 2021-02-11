import { ApolloError } from '@apollo/client';
import { FormikProps, FormikValues } from 'formik';
import { ErrorType } from 'generated';
import { useTranslation } from 'lib';
import { useRef } from 'react';
import { MutationErrors, UseForm } from 'types';

type GeneralFormValues = FormikValues & {
  general: string;
};

const snakeCaseToCamelCase = (str: string): string =>
  str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));

// A custom hook that provides useful helpers for integrating Formik with GraphQL mutations.
export const useForm = <T extends FormikValues>(): UseForm<T> => {
  const { t } = useTranslation();
  const formRef = useRef<FormikProps<T>>(null!);

  const initialFormErrors: GeneralFormValues = {
    general: '',
  };

  const unexpectedError: GeneralFormValues = {
    general: t('common:unexpectedError'),
  };

  const setUnexpectedFormError = (): void => formRef.current.setErrors(unexpectedError);
  const formatFormError = (error: ErrorType): string => error.messages.join('\n');

  // Set form errors either for specific fields or as general errors.
  const handleMutationErrors = (errors: MutationErrors): void => {
    const formErrors = initialFormErrors;

    if (errors.length) {
      errors.map((e) => {
        const msg = formatFormError(e!);

        if (e?.field === '__all__') {
          formErrors.general = msg;
        } else if (e?.field) {
          formErrors[snakeCaseToCamelCase(e.field)] = msg;
        } else {
          formErrors.general = msg;
        }
      });
    } else {
      formErrors.general = t('common:unexpectedError');
    }

    formRef.current.setSubmitting(false);
    formRef.current.setErrors(formErrors);
  };

  // Set general form error due to network error or any unexpected error.
  const onError = (err: ApolloError): void => {
    const formErrors = initialFormErrors;

    if (err.networkError) {
      formErrors.general = t('validation:networkError');
    } else {
      formErrors.general = t('common:unexpectedError');
    }

    formRef.current.setSubmitting(false);
    formRef.current.setErrors(formErrors);
  };

  return {
    formRef,
    setUnexpectedFormError,
    formatFormError,
    handleMutationErrors,
    onError,
  };
};
