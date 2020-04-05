import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { useConfirm } from 'material-ui-confirm';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';

import { DeleteAccountMutation, useDeleteAccountMutation } from '../../../generated/graphql';
import { deAuthenticate } from '../../actions';
import { FormSubmitSection, SettingsLayout } from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { useForm, usePrivatePage } from '../../utils';

const initialValues = {
    password: '',
    general: '',
};

export interface DeleteAccountFormValues {
    password: string;
}

export const DeleteAccountPage: I18nPage = () => {
    const { ref, setSubmitting, resetForm, handleMutationErrors, onError } = useForm<DeleteAccountFormValues>();
    const dispatch = useDispatch();
    const apolloClient = useApolloClient();
    const { t } = useTranslation();
    const confirm = useConfirm();

    const onCompleted = ({ deleteUser }: DeleteAccountMutation): void => {
        if (deleteUser) {
            if (deleteUser.errors) {
                handleMutationErrors(deleteUser.errors);
            } else {
                resetForm();
                dispatch(deAuthenticate(apolloClient));
            }
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
                    />
                    <FormSubmitSection submitButtonText={t('common:confirm')} {...props} />
                </Form>
            )}
        </Formik>
    );

    return (
        <SettingsLayout
            title={t('delete-account:title')}
            heading={t('delete-account:heading')}
            renderCardContent={renderCardContent}
            dynamicBackUrl
            formLayout
        />
    );
};

DeleteAccountPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePrivatePage(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['delete-account']) };
};

export default compose(withApollo, withRedux)(DeleteAccountPage);
