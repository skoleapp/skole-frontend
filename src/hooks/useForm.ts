import { ApolloError } from '@apollo/client';
import { Formik } from 'formik';
import { i18n } from 'lib';
import { useRef } from 'react';
import { FieldValue, MutationErrors, MutationFormError, UseForm } from 'types';

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

export const useForm = <T>(): UseForm<T> => {
    const ref = useRef<Formik<T>>(null!);

    const setFormErrors = (formErrors: FormErrors): void =>
        Object.keys(formErrors).forEach(key => ref.current.setFieldError(key, (formErrors as FormErrors)[key]));

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
            formErrors.general = i18n.t('validation:unexpectedError');
        }

        setFormErrors(formErrors);
    };

    // Apollo error e.g. a network error.
    const onError = (err: ApolloError): void => {
        const formErrors = { general: '' };

        if (err.networkError) {
            formErrors.general = i18n.t('validation:networkError');
        } else {
            formErrors.general = i18n.t('validation:unexpectedError');
        }

        setFormErrors(formErrors);
    };

    const unexpectedError = (): void => setFormErrors({ general: i18n.t('validation:unexpectedError') });
    const setSubmitting = (val: boolean): void | null => ref.current.setSubmitting(val);
    const resetForm = (): void | null => ref.current.resetForm();
    const submitForm = (): Promise<void> | null => ref.current.submitForm();
    const setFieldValue = (fieldName: string, val: FieldValue): void => ref.current.setFieldValue(fieldName, val);
    const setFieldError = (fieldName: string, val: string): void => ref.current.setFieldError(fieldName, val);

    return {
        ref,
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
