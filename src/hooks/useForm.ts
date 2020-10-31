import { ApolloError } from '@apollo/client';
import { Formik } from 'formik';
import { useTranslation } from 'lib';
import { useRef } from 'react';
import { FieldValue, MutationErrors, MutationFormError, UseForm } from 'types';

const snakeCaseToCamelCase = (str: string): string => {
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

// A custom hook that provides useful helpers for integrating Formik with GraphQL mutations.
export const useForm = <T>(): UseForm<T> => {
    const { t } = useTranslation();
    const formRef = useRef<Formik<T>>(null!);

    const setFormErrors = (formErrors: FormErrors): void =>
        Object.keys(formErrors).forEach(key => formRef.current.setFieldError(key, (formErrors as FormErrors)[key]));

    const unexpectedError = (): void => setFormErrors({ general: t('validation:unexpectedError') });
    const setSubmitting = (val: boolean): void | null => formRef.current.setSubmitting(val);
    const resetForm = (): void | null => formRef.current.resetForm();
    const submitForm = (): Promise<void> | null => formRef.current.submitForm();
    const setFieldValue = (fieldName: string, val: FieldValue): void => formRef.current.setFieldValue(fieldName, val);
    const setFieldError = (fieldName: string, val: string): void => formRef.current.setFieldError(fieldName, val);

    // A general error in the form not related to any specific field.
    const handleMutationErrors = (err: MutationErrors): void => {
        const formErrors = { general: '' };

        if (err.length) {
            (err as MutationFormError[]).map((e: MutationFormError) => {
                if (e.field === '__all__') {
                    formErrors.general = t(`errors:${e.messages.join()}`);
                } else if (e.field) {
                    (formErrors as FormErrors)[snakeCaseToCamelCase(e.field)] = t(`errors:${e.messages.join()}`);
                } else {
                    formErrors.general = t(`errors:${e.messages.join()}`);
                }
            });
        } else {
            formErrors.general = t('validation:unexpectedError');
        }

        setSubmitting(false);
        setFormErrors(formErrors);
    };

    // Apollo error, e.g. a network error.
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
