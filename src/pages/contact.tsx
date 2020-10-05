import { FormSubmitSection, LoadingLayout, OfflineLayout, SettingsLayout, TextFormField } from 'components';
import { useNotificationsContext } from 'context';
import { Field, Form, Formik } from 'formik';
import { CreateContactMessageMutation, useCreateContactMessageMutation } from 'generated';
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
    const { formRef, onError, resetForm, handleMutationErrors, unexpectedError } = useForm<ContactFormValues>();

    const validationSchema = Yup.object().shape({
        subject: Yup.string().required(t('validation:required')),
        name: Yup.string(),
        email: Yup.string()
            .email(t('validation:invalidEmail'))
            .required(t('validation:required')),
        message: Yup.string().required(t('validation:required')),
    });

    const onCompleted = ({ createContactMessage }: CreateContactMessageMutation): void => {
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

    const [createContactMessage] = useCreateContactMessageMutation({ onCompleted, onError });

    const handleSubmit = async (values: ContactFormValues): Promise<void> => {
        const { subject, name, email, message } = values;

        const variables = {
            subject,
            name,
            email,
            message,
        };

        await createContactMessage({ variables });
    };

    const renderForm = (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema} ref={formRef}>
            {(props): JSX.Element => (
                <Form>
                    <Field name="subject" component={TextFormField} label={t('forms:messageSubject')} />
                    <Field name="name" component={TextFormField} label={t('forms:name')} />
                    <Field name="email" component={TextFormField} label={t('forms:email')} />
                    <Field name="message" component={TextFormField} label={t('forms:message')} rows="4" multiline />
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
