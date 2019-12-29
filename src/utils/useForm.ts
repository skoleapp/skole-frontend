import { ApolloError } from 'apollo-client';
import { FormikActions } from 'formik';
import { MutableRefObject, useRef } from 'react';

const snakeToCamel = (str: string): string => {
    return str.replace(/([-_][a-z])/g, group =>
        group
            .toUpperCase()
            .replace('-', '')
            .replace('_', ''),
    );
};

interface MutationFormError {
    field: string;
    messages: string[];
}

interface FormErrors {
    [key: string]: string;
}

const createFormErrors = (errors: ApolloError & MutationFormError[]): FormErrors => {
    const formErrors = {
        general: '',
    };

    if (errors.networkError) {
        formErrors.general = 'Network error.';
    } else if (errors.length) {
        errors.map((e: MutationFormError) => {
            if (e.field === '__all__') {
                formErrors.general = e.messages.join();
            } else if (e.field) {
                (formErrors as any)[snakeToCamel(e.field)] = e.messages.join(); // eslint-disable-line @typescript-eslint/no-explicit-any
            } else {
                formErrors.general = e.messages.join();
            }
        });
    } else {
        formErrors.general = 'Encountered unexpected error.';
    }

    return formErrors;
};

interface UseForm {
    ref: MutableRefObject<FormikActions<{}> | undefined>;
    onError: (err: ApolloError & MutationFormError[]) => void;
    setSubmitting: (val: boolean) => void;
    resetForm: () => void;
    setFieldValue: (fieldName: string, val: string) => void;
}

export const useForm = (): UseForm => {
    const ref = useRef<FormikActions<{}>>();

    const onError = (err: ApolloError & MutationFormError[]): void => {
        const formErrors = createFormErrors(err);

        Object.keys(formErrors).forEach(
            key => ref && ref.current && ref.current.setFieldError(key, (formErrors as FormErrors)[key]),
        );
    };

    const setSubmitting = (val: boolean): void => ref && ref.current && ref.current.setSubmitting(val);

    const resetForm = (): void => ref && ref.current && ref.current.resetForm();

    const setFieldValue = (fieldName: string, val: string): void => {
        ref && ref.current && ref.current.setFieldValue(fieldName, val);
    };

    return { ref, onError, setSubmitting, resetForm, setFieldValue };
};
