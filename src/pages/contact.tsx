<<<<<<< HEAD
import { Field, Form, Formik } from 'formik';
=======
import { Field, Formik } from 'formik';
>>>>>>> contact from updates
import { TextField } from 'formik-material-ui';
import React from 'react';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';

import { toggleNotification } from '../actions';
import { FormSubmitSection, SettingsLayout } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { I18nPage, I18nProps, SkoleContext } from '../types';
import { useAuthSync, useForm } from '../utils';

const initialValues = {
    subject: '',
    name: '',
    email: '',
    message: '',
    general: '',
};

export interface ContactFormValues {
<<<<<<< HEAD
    subject: string;
    name: string;
=======
>>>>>>> contact from updates
    email: string;
    message: string;
}

const ContactPage: I18nPage = () => {
    const dispatch = useDispatch();
    const { ref, setSubmitting, onError, resetForm, handleMutationErrors } = useForm<ContactFormValues>();
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        subject: Yup.string().required(t('validation:required')),
        name: Yup.string(),
        email: Yup.string()
            .email(t('validation:invalidEmail'))
            .required(t('validation:required')),
        message: Yup.string().required(t('validation:required')),
    });

    const [contactMutation] = usecontac({ onCompleted, onError });
    
    // TODO: Finish this.
    const handleSubmit = (values: ContactFormValues): void => {
        const {email, message} = values
        const variables = {
            email,
            message
        }
        console.log(values);
        resetForm();
        dispatch(toggleNotification(t('notifications:messageSubmitted')));
    };

    const renderCardContent = (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema} ref={ref}>
            {(props): JSX.Element => (
<<<<<<< HEAD
                <Form>
                    <Field
                        name="subject"
                        component={TextField}
                        label={t('forms:subject')}
                        placeholder={t('forms:subject')}
                        variant="outlined"
                        fullWidth
                    />
                    <Field
                        name="name"
                        component={TextField}
                        label={t('forms:name')}
                        placeholder={t('forms:name')}
                        variant="outlined"
                        fullWidth
                    />
=======
                <StyledForm>
>>>>>>> contact from updates
                    <Field
                        name="email"
                        component={TextField}
                        label={t('forms:email')}
                        placeholder={t('forms:email')}
                        variant="outlined"
                        fullWidth
                    />
                    <Field
                        name="message"
                        component={TextField}
                        placeholder={t('forms:message')}
                        label={t('forms:message')}
                        variant="outlined"
                        rows="5"
                        fullWidth
                        multiline
                    />
                    <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
                </Form>
            )}
        </Formik>
    );

    return <SettingsLayout title={t('contact:title')} renderCardContent={renderCardContent} backUrl />;
};

ContactPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['contact']) };
};

export default compose(withApollo, withRedux)(ContactPage);
