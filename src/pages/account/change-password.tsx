import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import * as Yup from 'yup';

import { ChangePasswordMutation, useChangePasswordMutation } from '../../../generated/graphql';
import { FormSubmitSection, SettingsLayout } from '../../components';
import { useNotificationsContext } from '../../context';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { requireAuth, withAuthSync } from '../../lib';
import { I18nProps } from '../../types';
import { useForm } from '../../utils';

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

const ChangePasswordPage: NextPage<I18nProps> = () => {
    const { ref, resetForm, setSubmitting, handleMutationErrors, onError } = useForm<ChangePasswordFormValues>();
    const { toggleNotification } = useNotificationsContext();
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        oldPassword: Yup.string().required(t('validation:required')),
        newPassword: Yup.string()
            .min(6, t('validation:passwordTooShort'))
            .required(t('validation:required')),
        confirmNewPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], t('validation:passwordsNotMatch'))
            .required(t('validation:required')),
    });

    const onCompleted = async ({ changePassword }: ChangePasswordMutation): Promise<void> => {
        if (changePassword) {
            if (changePassword.errors) {
                handleMutationErrors(changePassword.errors);
            } else {
                resetForm();
                toggleNotification(t('notifications:passwordChanged'));
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
                    />
                    <Field
                        placeholder={t('forms:newPassword')}
                        name="newPassword"
                        component={TextField}
                        label={t('forms:newPassword')}
                        variant="outlined"
                        type="password"
                        fullWidth
                    />
                    <Field
                        placeholder={t('forms:confirmNewPassword')}
                        name="confirmNewPassword"
                        component={TextField}
                        label={t('forms:confirmNewPassword')}
                        variant="outlined"
                        type="password"
                        fullWidth
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
        topNavbarProps: {
            header: t('change-password:header'),
            dynamicBackUrl: true,
        },
        renderCardContent,
        desktopHeader: t('change-password:header'),
        formLayout: true,
    };

    return <SettingsLayout {...layoutProps} />;
};

export const getServerSideProps: GetServerSideProps = requireAuth(async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['change-password']),
    },
}));

export default withAuthSync(ChangePasswordPage);
