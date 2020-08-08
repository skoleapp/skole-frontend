import { FormSubmitSection, LoadingLayout, OfflineLayout, SettingsLayout } from 'components';
import { useNotificationsContext } from 'context';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { ContactMutation, useContactMutation } from 'generated';
import { useForm } from 'hooks';
import { useTranslation, withUserMe } from 'lib';
import { NextPage } from 'next';
import React from 'react';
import { AuthProps } from 'types';
import * as Yup from 'yup';

const initialValues = {
    subject: '',
    name: '',
    email: '',
    message: '',
    general: '',
};

interface ContactFormValues {
    subject: string;
    name: string;
    email: string;
    message: string;
}

const ContactPage: NextPage<AuthProps> = ({ authLoading, authNetworkError }) => {
    const { t } = useTranslation();
    const { toggleNotification } = useNotificationsContext();

    const { ref, setSubmitting, onError, resetForm, handleMutationErrors, unexpectedError } = useForm<
        ContactFormValues
    >();

    const validationSchema = Yup.object().shape({
        subject: Yup.string().required(t('validation:required')),
        name: Yup.string(),
        email: Yup.string()
            .email(t('validation:invalidEmail'))
            .required(t('validation:required')),
        message: Yup.string().required(t('validation:required')),
    });

    const onCompleted = ({ createContactMessage }: ContactMutation): void => {
        if (!!createContactMessage) {
            if (!!createContactMessage.errors) {
                handleMutationErrors(createContactMessage.errors);
            } else if (!!createContactMessage.message) {
                resetForm();
                toggleNotification(createContactMessage.message);
            } else {
                unexpectedError();
            }
        } else {
            unexpectedError();
        }
    };

    const [contactMutation] = useContactMutation({ onCompleted, onError });

    const handleSubmit = async (values: ContactFormValues): Promise<void> => {
        const { subject, name, email, message } = values;

        const variables = {
            subject,
            name,
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
                        name="subject"
                        component={TextField}
                        label={t('forms:messageSubject')}
                        placeholder={t('forms:messageSubject')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                    />
                    <Field
                        name="name"
                        component={TextField}
                        label={t('forms:name')}
                        placeholder={t('forms:name')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                    />
                    <Field
                        name="email"
                        component={TextField}
                        label={t('forms:email')}
                        placeholder={t('forms:email')}
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                    />
                    <Field
                        name="message"
                        component={TextField}
                        placeholder={t('forms:message')}
                        label={t('forms:message')}
                        variant="outlined"
                        rows="4"
                        fullWidth
                        multiline
                    />
                    <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
                </Form>
            )}
        </Formik>
    );

    const seoProps = {
        title: t('contact:title'),
        description: t('contact:description'),
    };

    const layoutProps = {
        seoProps,
        topNavbarProps: {
            header: t('contact:header'),
            dynamicBackUrl: true,
        },
        desktopHeader: t('contact:header'),
        renderCardContent,
        formLayout: true,
    };

    if (authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    if (authNetworkError) {
        return <OfflineLayout seoProps={seoProps} />;
    }

    return <SettingsLayout {...layoutProps} />;
};

export default withUserMe(ContactPage);
