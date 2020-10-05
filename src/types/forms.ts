import { ApolloError } from '@apollo/client';
import { Formik } from 'formik';
import { ErrorType, SchoolObjectType, SubjectObjectType } from 'generated';
import { Maybe } from 'graphql/jsutils/Maybe';
import { MutableRefObject } from 'react';

export type MutationFormError = Pick<ErrorType, 'field' | 'messages'>;
export type MutationErrors = Maybe<{ __typename?: 'ErrorType' | undefined } & MutationFormError>[];

// This is a custom type for field values. Add more options when needed.
export type FieldValue = string | File | File[] | SchoolObjectType | null;

export interface UseForm<T> {
    formRef: MutableRefObject<Formik<T>>;
    handleMutationErrors: (err: MutationErrors) => void;
    onError: (err: ApolloError) => void;
    setSubmitting: (val: boolean) => void;
    resetForm: () => void;
    submitForm: () => Promise<void> | null;
    setFieldValue: (fieldName: string, val: FieldValue) => void;
    setFieldError: (fieldName: string, val: string) => void;
    unexpectedError: () => void;
}

export interface UpdateProfileFormValues {
    username: string;
    email: string;
    title: string;
    bio: string;
    avatar: string;
    school: SchoolObjectType | null;
    subject: SubjectObjectType | null;
}
