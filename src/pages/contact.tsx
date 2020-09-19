import { FormSubmitSection, LoadingLayout, OfflineLayout, SettingsLayout } from 'components';
import { useNotificationsContext } from 'context';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { ContactMutation, useContactMutation } from 'generated';
import { useForm } from 'hooks';
import { includeDefaultNamespaces, useTranslation, withUserMe } from 'lib';
import { GetStaticProps, NextPage } from 'next';
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
            if (!!createContactMessage.errors && !!createContactMessage.errors.length) {
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

    const renderForm = (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema} ref={ref}>
            {(props): JSX.Element => (
                <Form>
                    <Field name="subject" component={TextField} label={t('forms:messageSubject')} />
                    <Field name="name" component={TextField} label={t('forms:name')} />
                    <Field name="email" component={TextField} label={t('forms:email')} />
                    <Field name="message" component={TextField} label={t('forms:message')} rows="4" multiline />
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
        header: t('contact:header'),
        dense: true,
        topNavbarProps: {
            dynamicBackUrl: true,
        },
    };

    if (authLoading) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    if (authNetworkError) {
        return <OfflineLayout seoProps={seoProps} />;
    }

    return <SettingsLayout {...layoutProps}>{renderForm}</SettingsLayout>;
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['contact']),
    },
});

export default withUserMe(ContactPage);
