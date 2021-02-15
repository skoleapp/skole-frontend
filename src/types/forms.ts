import { ApolloError } from '@apollo/client';
import { FormikProps, FormikValues } from 'formik';
import { ErrorType, Maybe } from 'generated';
import { RefObject } from 'react';

export type MutationFormError = Pick<ErrorType, 'field' | 'messages'>;
export type MutationErrors = Maybe<{ __typename?: 'ErrorType' | undefined } & MutationFormError>[];

// On purpose use `type` instead of `interface` here to make typings more flexible for form errors in the `useForm` hook.
export type GeneralFormValues = FormikValues & {
  general: string;
};

export interface UseForm<T> {
  formRef: RefObject<FormikProps<T>>;
  setUnexpectedFormError: () => void;
  formatFormError: (error: ErrorType) => string;
  handleMutationErrors: (errors: MutationErrors) => void;
  onError: (err: ApolloError) => void;
  generalFormValues: GeneralFormValues;
}
