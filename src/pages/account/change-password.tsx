import { FormSubmitSection, SettingsLayout, TextFormField } from 'components';
import { useNotificationsContext } from 'context';
import { Field, Form, Formik } from 'formik';
import { ChangePasswordMutation, useChangePasswordMutation } from 'generated';
import { useForm } from 'hooks';
import { includeDefaultNamespaces, useTranslation, withAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import * as Yup from 'yup';

const initialValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    general: '',
};

interface ChangePasswordFormValues {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

const ChangePasswordPage: NextPage = () => {
    const { formRef, resetForm, handleMutationErrors, onError, unexpectedError } = useForm<ChangePasswordFormValues>();
    const { toggleNotification } = useNotificationsContext();
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        oldPassword: Yup.string().required(t('validation:required')),
        newPassword: Yup.string()
            .min(8, t('validation:passwordTooShort'))
            .required(t('validation:required')),
        confirmNewPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], t('validation:passwordsNotMatch'))
            .required(t('validation:required')),
    });

    const onCompleted = async ({ changePassword }: ChangePasswordMutation): Promise<void> => {
        if (!!changePassword) {
            if (!!changePassword.errors && !!changePassword.errors.length) {
                handleMutationErrors(changePassword.errors);
            } else if (!!changePassword.message) {
                resetForm();
                toggleNotification(changePassword.message);
            } else {
                unexpectedError();
            }
        }
    };

    const [changePasswordMutation] = useChangePasswordMutation({ onCompleted, onError });

    const handleSubmit = async (values: ChangePasswordFormValues): Promise<void> => {
        const { oldPassword, newPassword } = values;
        await changePasswordMutation({ variables: { oldPassword, newPassword } });
    };

    const renderForm = (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema} ref={formRef}>
            {(props): JSX.Element => (
                <Form>
                    <Field
                        name="oldPassword"
                        component={TextFormField}
                        label={t('forms:oldPassword')}
                        type="password"
                    />
                    <Field
                        name="newPassword"
                        component={TextFormField}
                        label={t('forms:newPassword')}
                        type="password"
                    />
                    <Field
                        name="confirmNewPassword"
                        component={TextFormField}
                        label={t('forms:confirmNewPassword')}
                        type="password"
                    />
                    <FormSubmitSection submitButtonText={t('common:save')} {...props} />
                </Form>
            )}
        </Formik>
    );

    const layoutProps = {
        seoProps: {
            title: t('change-password:title'),
            description: t('change-password:description'),
        },
        header: t('change-password:header'),
        dense: true,
        topNavbarProps: {
            dynamicBackUrl: true,
        },
    };

    return <SettingsLayout {...layoutProps}>{renderForm}</SettingsLayout>;
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['change-password']),
    },
});

export default withAuth(ChangePasswordPage);
