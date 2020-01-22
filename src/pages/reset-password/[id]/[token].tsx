import { Field, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';
import * as Yup from 'yup';

import { FormLayout, FormSubmitSection, StyledForm } from '../../../components';
import { includeDefaultNamespaces } from '../../../i18n';
import { withApollo, withRedux } from '../../../lib';
import { I18nPage, I18nProps, SkoleContext } from '../../../types';
import { useForm, usePublicPage } from '../../../utils';

const initialValues = {
    password: '',
    confirmPassword: '',
    general: '',
};

export interface ResetPasswordConfirmFormValues {
    password: string;
    confirmPassword: string;
}

const ResetPasswordConfirmPage: I18nPage = () => {
    const { ref, setSubmitting } = useForm<ResetPasswordConfirmFormValues>();
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .min(6, t('validation:passwordTooShort'))
            .required(t('validation:passwordRequired')),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], t('validation:passwordsNotMatch'))
            .required(t('validation:confirmPasswordRequired')),
    });

    const handleSubmit = async (values: ResetPasswordConfirmFormValues): Promise<void> => {
        const { password } = values;
        console.log('Submitted!', password);
        setSubmitting(false);
    };

    const renderCardContent = (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} ref={ref}>
            {(props): JSX.Element => (
                <StyledForm>
                    <Field
                        placeholder={t('forms:password')}
                        name="password"
                        component={TextField}
                        label={t('forms:password')}
                        variant="outlined"
                        type="password"
                        fullWidth
                    />
                    <Field
                        placeholder={t('forms:confirmPassword')}
                        name="confirmPassword"
                        type="password"
                        component={TextField}
                        label={t('forms:confirmPassword')}
                        variant="outlined"
                        fullWidth
                    />
                    <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
                </StyledForm>
            )}
        </Formik>
    );

    return <FormLayout title={t('reset-password:confirm')} renderCardContent={renderCardContent} backUrl />;
};

ResetPasswordConfirmPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePublicPage(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['reset-password']) };
};

export default compose(withApollo, withRedux)(ResetPasswordConfirmPage);
