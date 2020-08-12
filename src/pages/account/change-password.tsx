import { FormSubmitSection, LoadingLayout, OfflineLayout, SettingsLayout } from 'components';
import { useNotificationsContext } from 'context';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { ChangePasswordMutation, useChangePasswordMutation } from 'generated';
import { useForm } from 'hooks';
import { includeDefaultNamespaces, useTranslation, withAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { AuthProps } from 'types';
import * as Yup from 'yup';

const initialValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    general: '',
};

export interface ChangePasswordFormValues {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

const ChangePasswordPage: NextPage<AuthProps> = ({ authLoading, authNetworkError }) => {
    const { ref, resetForm, setSubmitting, handleMutationErrors, onError, unexpectedError } = useForm<
        ChangePasswordFormValues
    >();

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
            if (!!changePassword.errors) {
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
        setSubmitting(false);
    };

    const renderCardContent = (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema} ref={ref}>
            {(props): JSX.Element => (
                <Form>
                    <Field
                        placeholder={t('forms:oldPassword')}
                        name="oldPassword"
                        component={TextField}
                        label={t('forms:oldPassword')}
                        variant="outlined"
                        type="password"
                        fullWidth
                        autoComplete="off"
                    />
                    <Field
                        placeholder={t('forms:newPassword')}
                        name="newPassword"
                        component={TextField}
                        label={t('forms:newPassword')}
                        variant="outlined"
                        type="password"
                        fullWidth
                        autoComplete="off"
                    />
                    <Field
                        placeholder={t('forms:confirmNewPassword')}
                        name="confirmNewPassword"
                        component={TextField}
                        label={t('forms:confirmNewPassword')}
                        variant="outlined"
                        type="password"
                        fullWidth
                        autoComplete="off"
                    />
                    <FormSubmitSection submitButtonText={t('common:save')} {...props} />
                </Form>
            )}
        </Formik>
    );

    const seoProps = {
        title: t('change-password:title'),
        description: t('change-password:description'),
    };

    const layoutProps = {
        seoProps,
        topNavbarProps: {
            header: t('change-password:header'),
            dynamicBackUrl: true,
        },
        renderCardContent,
        desktopHeader: t('change-password:header'),
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

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['change-password']),
    },
});

export default withAuth(ChangePasswordPage);
