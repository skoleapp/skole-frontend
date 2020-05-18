import { useApolloClient } from '@apollo/react-hooks';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { useConfirm } from 'material-ui-confirm';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { DeleteAccountMutation, useDeleteAccountMutation } from '../../../generated/graphql';
import { FormSubmitSection, SettingsLayout } from '../../components';
import { useAuthContext, useNotificationsContext } from '../../context';
import { includeDefaultNamespaces, Router } from '../../i18n';
import { clientLogout, withAuthSync } from '../../lib';
import { I18nProps } from '../../types';
import { useForm } from '../../utils';

const initialValues = {
    password: '',
    general: '',
};

export interface DeleteAccountFormValues {
    password: string;
}

export const DeleteAccountPage: NextPage<I18nProps> = () => {
    const { ref, setSubmitting, resetForm, handleMutationErrors, onError, unexpectedError } = useForm<
        DeleteAccountFormValues
    >();

    const { t } = useTranslation();
    const confirm = useConfirm();
    const apolloClient = useApolloClient();
    const { setUser } = useAuthContext();
    const { toggleNotification } = useNotificationsContext();

    const onCompleted = async ({ deleteUser }: DeleteAccountMutation): Promise<void> => {
        if (!!deleteUser) {
            if (!!deleteUser.errors) {
                handleMutationErrors(deleteUser.errors);
            } else if (!!deleteUser.message) {
                resetForm();
                toggleNotification(deleteUser.message);
                clientLogout();
                setUser(null);
                await apolloClient.resetStore();
                Router.push('/login');
            } else {
                unexpectedError();
            }
        } else {
            unexpectedError();
        }
    };

    const [deleteAccountMutation] = useDeleteAccountMutation({ onCompleted, onError });

    const handleSubmit = (values: DeleteAccountFormValues): void => {
        setSubmitting(false);

        confirm({ title: t('delete-account:confirmTitle'), description: t('delete-account:confirmDesc') }).then(
            async () => {
                setSubmitting(true);
                await deleteAccountMutation({ variables: { password: values.password } });
                setSubmitting(false);
            },
        );
    };

    const validationSchema = Yup.object().shape({
        password: Yup.string().required(t('validation:required')),
    });

    const renderCardContent = (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema} ref={ref}>
            {(props): JSX.Element => (
                <Form>
                    <Field
                        name="password"
                        label={t('forms:password')}
                        placeholder={t('forms:password')}
                        variant="outlined"
                        component={TextField}
                        fullWidth
                        type="password"
                        autoComplete="off"
                    />
                    <FormSubmitSection submitButtonText={t('common:confirm')} {...props} />
                </Form>
            )}
        </Formik>
    );

    const layoutProps = {
        seoProps: {
            title: t('delete-account:title'),
            description: t('delete-account:description'),
        },
        topNavbarProps: {
            header: t('delete-account:header'),
            dynamicBackUrl: true,
        },
        renderCardContent,
        desktopHeader: t('delete-account:header'),
        formLayout: true,
    };

    return <SettingsLayout {...layoutProps} />;
};

export const getServerSideProps: GetServerSideProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['delete-account']),
    },
});

export default withAuthSync(DeleteAccountPage);
