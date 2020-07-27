import { FormSubmitSection, SettingsLayout } from 'components';
import { useNotificationsContext } from 'context';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { DeleteAccountMutation, useDeleteAccountMutation } from 'generated';
import { useForm } from 'hooks';
import { includeDefaultNamespaces } from 'i18n';
import { withAuthSync, withSSRAuth, withUserAgent } from 'lib';
import { useConfirm } from 'material-ui-confirm';
import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { I18nProps } from 'types';
import { redirect, urls } from 'utils';
import * as Yup from 'yup';

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
    const { toggleNotification } = useNotificationsContext();

    const onCompleted = async ({ deleteUser }: DeleteAccountMutation): Promise<void> => {
        if (!!deleteUser) {
            if (!!deleteUser.errors) {
                handleMutationErrors(deleteUser.errors);
            } else if (!!deleteUser.message) {
                resetForm();
                toggleNotification(deleteUser.message);
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

const wrappers = R.compose(withUserAgent, withSSRAuth);

export const getServerSideProps: GetServerSideProps = wrappers(async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['delete-account']),
    },
}));

export default withAuthSync(DeleteAccountPage);
