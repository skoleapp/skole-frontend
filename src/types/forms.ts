import { ApolloError } from '@apollo/client';
import { FormikProps } from 'formik';
import { ErrorType, Maybe } from 'generated';
import { RefObject } from 'react';

export type MutationFormError = Pick<ErrorType, 'field' | 'messages'>;
export type MutationErrors = Maybe<{ __typename?: 'ErrorType' | undefined } & MutationFormError>[];

export interface UseForm<T> {
  formRef: RefObject<FormikProps<T>>;
  handleMutationErrors: (err: MutationErrors) => void;
  onError: (err: ApolloError) => void;
  setSubmitting: (val: boolean) => void;
  resetForm: () => void;
  submitForm: () => Promise<void> | null;
  setFieldValue: (fieldName: string, val: unknown) => void;
  setFieldError: (fieldName: string, val: string) => void;
  unexpectedError: () => void;
}
