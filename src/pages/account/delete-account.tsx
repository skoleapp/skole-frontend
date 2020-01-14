import * as Yup from 'yup';

import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { DeleteAccountMutation, useDeleteAccountMutation } from '../../../generated/graphql';
import { Field, Formik } from 'formik';
import { FormSubmitSection, StyledDialog, StyledForm } from '../../components';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import React, { useState } from 'react';
import { useForm, usePrivatePage, useSettingsLayout } from '../../utils';
import { withApollo, withRedux } from '../../lib';

import { TextField } from 'formik-material-ui';
import { compose } from 'redux';
import { deAuthenticate } from '../../actions';
import { includeDefaultNamespaces } from '../../i18n';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

const initialValues = {
    password: '',
    general: '',
};

export interface DeleteAccountFormValues {
    password: string;
}

const initialDialogState = {
    password: '',
    open: false,
};

export const DeleteAccountPage: I18nPage = () => {
    const [dialog, setDialog] = useState(initialDialogState);
    const { ref, setSubmitting, resetForm, handleMutationErrors, onError } = useForm<DeleteAccountFormValues>();
    const dispatch = useDispatch();
    const apolloClient = useApolloClient();
    const { t } = useTranslation();

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
        setDialog({ password: values.password, open: true });
    };

    const handleClose = (): void => setDialog({ ...dialog, open: false });

    const handleSubmitConfirm = async (): Promise<void> => {
        handleClose();
        setSubmitting(true);
        const { password } = dialog;
        await deleteAccountMutation({ variables: { password } });
        setSubmitting(false);
    };

    const validationSchema = Yup.object().shape({
        password: Yup.string().required(t('validation:passwordRequired')),
    });

    const renderCardContent = (
        <Formik onSubmit={handleSubmit} initialValues={initialValues} validationSchema={validationSchema} ref={ref}>
            {(props): JSX.Element => (
                <StyledForm>
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
                </StyledForm>
            )}
        </Formik>
    );

    const renderDialog = (
        <StyledDialog open={dialog.open} onClose={handleClose}>
            <DialogTitle>{t('delete-account:dialogTitle')}</DialogTitle>
            <DialogContent>
                <DialogContentText>{t('delete-account:dialogContentText')}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined" color="primary">
                    {t('common:cancel')}
                </Button>
                <Button onClick={handleSubmitConfirm} variant="contained" color="primary">
                    {t('common:confirm')}
                </Button>
            </DialogActions>
        </StyledDialog>
    );

    const responsiveSettingsProps = {
        title: t('delete-account:title'),
        renderCardContent,
    };

    const renderSettingsLayout = useSettingsLayout(responsiveSettingsProps);

    return (
        <>
            {renderSettingsLayout}
            {renderDialog}
        </>
    );
};

DeleteAccountPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePrivatePage(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['delete-account']) };
};

export default compose(withApollo, withRedux)(DeleteAccountPage);
