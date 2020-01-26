import React from 'react';
import { Formik, Field } from 'formik';
import { useTranslation } from '../../i18n';
import { FormSubmitSection } from './FormSubmitSection';
import { StyledForm } from './StyledForm';
import { TextField } from 'formik-material-ui';

interface CreateCommentFormValues {
    message: string;
}

interface Props {
    label: string;
    placeholder: string;
}

export const CreateCommentForm: React.FC<Props> = ({ label, placeholder }) => {
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
                        label={label}
                        placeholder={placeholder}
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
