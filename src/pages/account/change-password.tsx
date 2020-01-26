import { Field, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';

import { ChangePasswordMutation, useChangePasswordMutation } from '../../../generated/graphql';
import { toggleNotification } from '../../actions';
import { FormSubmitSection, SettingsLayout, StyledForm } from '../../components';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { useForm, usePrivatePage } from '../../utils';

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
                dispatch(toggleNotification(t('notifications:passwordChanged')));
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
                <StyledForm>
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
                </StyledForm>
            )}
        </Formik>
    );

    return <SettingsLayout title={t('change-password:title')} renderCardContent={renderCardContent} backUrl />;
};

ChangePasswordPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePrivatePage(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['change-password']) };
};

export default compose(withApollo, withRedux)(ChangePasswordPage);
