import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import * as Yup from 'yup';

import { ContactMutation, useContactMutation } from '../../generated/graphql';
import { FormSubmitSection, SettingsLayout } from '../components';
import { useTranslation } from '../i18n';
import { includeDefaultNamespaces } from '../i18n';
import { withApollo } from '../lib';
import { I18nPage, I18nProps } from '../types';
import { useForm, useNotificationsContext } from '../utils';

const initialValues = {
    subject: '',
    name: '',
    email: '',
    message: '',
    general: '',
};

export interface ContactFormValues {
    name: string;
    subject: string;
    email: string;
    message: string;
}

const ContactPage: I18nPage = () => {
    const { toggleNotification } = useNotificationsContext();
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

    const onCompleted = ({ createMessage }: ContactMutation): void => {
        if (createMessage && createMessage.errors) {
            handleMutationErrors(createMessage.errors);
        } else if (createMessage) {
            resetForm();
            toggleNotification(t('notifications:messageSubmitted'));
        }
    };

    const [contactMutation] = useContactMutation({ onCompleted, onError });

    const handleSubmit = async (values: ContactFormValues): Promise<void> => {
        const { name, subject, email, message } = values;

        const variables = {
            name,
            subject,
            email,
            message,
        };

        await contactMutation({ variables });
        setSubmitting(false);
    };

    const renderCardContent = (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema} ref={ref}>
            {(props): JSX.Element => (
                <Form>
                    <Field
                        name="name"
                        component={TextField}
                        label={t('forms:name')}
                        placeholder={t('forms:name')}
                        variant="outlined"
                        fullWidth
                    />
                    <Field
                        name="subject"
                        component={TextField}
                        label={t('forms:messageSubject')}
                        placeholder={t('forms:messageSubject')}
                        variant="outlined"
                        fullWidth
                    />
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

    const layoutProps = {
        seoProps: {
            title: t('contact:title'),
            description: t('contact:description'),
        },
        topNavbarProps: {
            header: t('contact:header'),
            dynamicBackUrl: true,
        },
        desktopHeader: t('contact:header'),
        renderCardContent,
        formLayout: true,
    };

    return <SettingsLayout {...layoutProps} />;
};

ContactPage.getInitialProps = (): I18nProps => ({
    namespacesRequired: includeDefaultNamespaces(['contact']),
});

export default withApollo(ContactPage);
