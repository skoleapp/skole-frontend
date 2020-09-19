import { FormSubmitSection, LoadingLayout, OfflineLayout, SettingsLayout } from 'components';
import { useNotificationsContext } from 'context';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { DeleteAccountMutation, useDeleteAccountMutation } from 'generated';
import { useForm } from 'hooks';
import { includeDefaultNamespaces, useTranslation, withAuth } from 'lib';
import { useConfirm } from 'material-ui-confirm';
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { AuthProps } from 'types';
import { redirect, urls } from 'utils';
import * as Yup from 'yup';

const initialValues = {
    password: '',
    general: '',
};

export interface DeleteAccountFormValues {
    password: string;
}

export const DeleteAccountPage: NextPage<AuthProps> = ({ authLoading, authNetworkError }) => {
    const { ref, setSubmitting, resetForm, handleMutationErrors, onError, unexpectedError } = useForm<
        DeleteAccountFormValues
    >();

    const { t } = useTranslation();
    const confirm = useConfirm();
    const { toggleNotification } = useNotificationsContext();

    const onCompleted = async ({ deleteUser }: DeleteAccountMutation): Promise<void> => {
        if (!!deleteUser) {
            if (!!deleteUser.errors && !!deleteUser.errors.length) {
                handleMutationErrors(deleteUser.errors);
            } else if (!!deleteUser.message) {
                resetForm();
                toggleNotification(deleteUser.message);
                localStorage.removeItem('user');
                redirect(urls.logout);
            } else {
                unexpectedError();
            }
        } else {
            unexpectedError();
        }
    };

    const [deleteAccountMutation] = useDeleteAccountMutation({ onCompleted, onError });

    const handleSubmit = async (values: DeleteAccountFormValues): Promise<void> => {
        setSubmitting(false);

        try {
            await confirm({
                title: t('delete-account:deleteAccountTitle'),
                description: t('delete-account:deleteAccountDescription'),
            });

            setSubmitting(true);
            await deleteAccountMutation({ variables: { password: values.password } });
            setSubmitting(false);
        } catch {
            // User cancelled.
        }
    };

    const validationSchema = Yup.object().shape({
        password: Yup.string().required(t('validation:required')),
    });

    const renderForm = (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema} ref={ref}>
            {(props): JSX.Element => (
                <Form>
                    <Field name="password" label={t('forms:password')} component={TextField} type="password" />
                    <FormSubmitSection submitButtonText={t('common:confirm')} {...props} />
                </Form>
            )}
        </Formik>
    );

    const seoProps = {
        title: t('delete-account:title'),
        description: t('delete-account:description'),
    };

    const layoutProps = {
        seoProps,
        header: t('delete-account:header'),
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
        namespacesRequired: includeDefaultNamespaces(['delete-account']),
    },
});

export default withAuth(DeleteAccountPage);
