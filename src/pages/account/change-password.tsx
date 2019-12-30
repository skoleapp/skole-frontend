import * as Yup from 'yup';

import { ChangePasswordMutation, useChangePasswordMutation } from '../../../generated/graphql';
import { Field, Formik, FormikProps } from 'formik';
import { FormSubmitSection, Layout, SlimCardContent, StyledCard, StyledForm } from '../../components';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { useForm, usePrivatePage } from '../../utils';
import { withApollo, withRedux } from '../../lib';

import { CardHeader } from '@material-ui/core';
import React from 'react';
import { TextField } from 'formik-material-ui';
import { compose } from 'redux';
import { includeDefaultNamespaces } from '../../i18n';
import { openNotification } from '../../actions';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

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

const ChangePasswordPage: I18nPage = () => {
    const { ref, resetForm, setSubmitting, handleMutationErrors, onError } = useForm<ChangePasswordFormValues>();
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        oldPassword: Yup.string().required(t('validation:oldPasswordRequired')),
        newPassword: Yup.string()
            .min(6, t('validation:passwordTooShort'))
            .required(t('validation:newPasswordRequired')),
        confirmNewPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], t('validation:passwordsNotMatch'))
            .required(t('validation:confirmPasswordRequired')),
    });

    const onCompleted = async ({ changePassword }: ChangePasswordMutation): Promise<void> => {
        if (changePassword) {
            if (changePassword.errors) {
                handleMutationErrors(changePassword.errors);
            } else {
                resetForm();
                dispatch(openNotification(t('notifications:passwordChanged')));
            }
        }
    };

    const [changePasswordMutation] = useChangePasswordMutation({ onCompleted, onError });

    const handleSubmit = async (values: ChangePasswordFormValues): Promise<void> => {
        const { oldPassword, newPassword } = values;
        await changePasswordMutation({ variables: { oldPassword, newPassword } });
        setSubmitting(false);
    };

    const renderForm = (props: FormikProps<ChangePasswordFormValues>): JSX.Element => (
        <StyledForm>
            <Field
                placeholder={t('forms:oldPassword')}
                name="oldPassword"
                component={TextField}
                label={t('forms:oldPassword')}
                type="password"
                fullWidth
            />
            <Field
                placeholder={t('forms:newPassword')}
                name="newPassword"
                component={TextField}
                label={t('forms:newPassword')}
                type="password"
                fullWidth
            />
            <Field
                placeholder={t('forms:confirmNewPassword')}
                name="confirmNewPassword"
                component={TextField}
                label={t('forms:confirmNewPassword')}
                type="password"
                fullWidth
            />
            <FormSubmitSection submitButtonText={t('common:save')} {...props} />
        </StyledForm>
    );

    return (
        <Layout title={t('change-password:title')} backUrl>
            <StyledCard>
                <CardHeader title={t('change-password:title')} />
                <SlimCardContent>
                    <Formik
                        onSubmit={handleSubmit}
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        ref={ref}
                    >
                        {renderForm}
                    </Formik>
                </SlimCardContent>
            </StyledCard>
        </Layout>
    );
};

ChangePasswordPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePrivatePage(ctx);

    return {
        namespacesRequired: includeDefaultNamespaces(['change-password']),
    };
};

export default compose(withApollo, withRedux)(ChangePasswordPage);
