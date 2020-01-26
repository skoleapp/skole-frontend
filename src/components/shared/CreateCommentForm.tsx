import React from 'react';
import { Formik, Field } from 'formik';
import { useTranslation } from 'react-i18next';
import { FormSubmitSection } from './FormSubmitSection';
import { StyledForm } from './StyledForm';
import { TextField } from 'formik-material-ui';

interface CreateCommentFormValues {
    message: string;
}

export const CreateCommentForm: React.FC = () => {
    const { t } = useTranslation();

    const handleSubmit = (values: CreateCommentFormValues): void => console.log(values);

    const initialValues = {
        message: '',
    };

    return (
        <Formik onSubmit={handleSubmit} initialValues={initialValues}>
            {(props): JSX.Element => (
                <StyledForm>
                    <Field
                        name="message"
                        label="New Message"
                        placeholder="New Message"
                        variant="outlined"
                        component={TextField}
                        rows="5"
                        fullWidth
                        multiline
                    />
                    <FormSubmitSection submitButtonText={t('common:send')} {...props} />
                </StyledForm>
            )}
        </Formik>
    );
};
