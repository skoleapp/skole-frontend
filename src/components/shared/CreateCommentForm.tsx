import React from 'react';
import { Formik, Field, FormikActions } from 'formik';
import { useTranslation } from '../../i18n';
import { StyledForm } from './StyledForm';
import { TextField } from 'formik-material-ui';
import { useDispatch } from 'react-redux';
import { toggleNotification, toggleCommentThread } from '../../actions';

interface Props {
    label: string;
    placeholder: string;
}

export const CreateCommentForm: React.FC<Props> = ({ label, placeholder }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const handleSubmit = (values: unknown, actions: FormikActions<unknown>): void => {
        actions.setSubmitting(false);
        dispatch(toggleNotification(t('notifications:messageSubmitted')));
        dispatch(toggleCommentThread(null));
        console.log(values);
    };

    const initialValues = {
        message: '',
    };

    return (
        <Formik onSubmit={handleSubmit} initialValues={initialValues}>
            {(): JSX.Element => (
                <StyledForm>
                    <Field
                        name="message"
                        label={label}
                        placeholder={placeholder}
                        variant="outlined"
                        component={TextField}
                        fullWidth
                    />
                    <input type="submit" value="Submit" />
                </StyledForm>
            )}
        </Formik>
    );
};
