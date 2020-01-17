import { MutableRefObject, useRef } from 'react';

import { ApolloError } from 'apollo-client';
import { ErrorType } from '../../generated/graphql';
import { Formik } from 'formik';
import Maybe from 'graphql/tsutils/Maybe';
import { i18n } from '../i18n';

const snakeToCamel = (str: string): string => {
    return str.replace(/([-_][a-z])/g, group =>
        group
            .toUpperCase()
            .replace('-', '')
            .replace('_', ''),
    );
};

interface FormErrors {
    [key: string]: string;
}

type MutationFormError = Pick<ErrorType, 'field' | 'messages'>;
type MutationErrors = Maybe<{ __typename?: 'ErrorType' | undefined } & MutationFormError>[];

export interface UseForm<T> {
    ref: MutableRefObject<Formik<T> | null>;
    handleMutationErrors: (err: MutationErrors) => void;
    onError: (err: ApolloError) => void;
    setSubmitting: (val: boolean) => void;
    resetForm: () => void;
    setFieldValue: (fieldName: string, val: string | File | File[]) => void;
}

export const useForm = <T>(): UseForm<T> => {
    const ref = useRef<Formik<T>>(null);

    const setFormErrors = (formErrors: FormErrors): void => {
        Object.keys(formErrors).forEach(
            key => ref && ref.current && ref.current.setFieldError(key, (formErrors as FormErrors)[key]),
        );
    };

    // A general error e.g. in the form.
    const handleMutationErrors = (err: MutationErrors): void => {
        const formErrors = { general: '' };

        if (err.length) {
            (err as MutationFormError[]).map((e: MutationFormError) => {
                if (e.field === '__all__') {
                    formErrors.general = i18n.t(`errors:${e.messages.join()}`);
                } else if (e.field) {
                    (formErrors as FormErrors)[snakeToCamel(e.field)] = i18n.t(`errors:${e.messages.join()}`);
                } else {
                    formErrors.general = i18n.t(`errors:${e.messages.join()}`);
                }
            });
        } else {
            formErrors.general = 'Encountered unexpected error.';
        }

        setFormErrors(formErrors);
    };

    // Apollo error e.g. a network error.
    const onError = (err: ApolloError): void => {
        const formErrors = { general: '' };

        if (err.networkError) {
            formErrors.general = 'Network error.';
        } else {
            formErrors.general = 'Encountered unexpected error.';
        }

        setFormErrors(formErrors);
    };

    const setSubmitting = (val: boolean): void | null => ref && ref.current && ref.current.setSubmitting(val);
    const resetForm = (): void | null => ref && ref.current && ref.current.resetForm();

    const setFieldValue = (fieldName: string, val: string | File | File[]): void => {
        ref && ref.current && ref.current.setFieldValue(fieldName, val);
    };

    return {
        ref,
        handleMutationErrors,
        onError,
        setSubmitting,
        resetForm,
        setFieldValue,
    };
};
