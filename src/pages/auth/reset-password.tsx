import * as Yup from 'yup';

import { Field, Formik, FormikProps } from 'formik';
import { FormSubmitSection, Layout, SlimCardContent, StyledCard, StyledForm } from '../../components';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { useForm, usePublicPage } from '../../utils';
import { withApollo, withRedux } from '../../lib';

import { CardHeader } from '@material-ui/core';
import React from 'react';
import { TextField } from 'formik-material-ui';
import { compose } from 'redux';
import { includeDefaultNamespaces } from '../../i18n';
import { useTranslation } from 'react-i18next';

const initialValues = {
    password: '',
    confirmPassword: '',
    general: '',
};

export interface ResetPasswordFormValues {
    password: string;
    confirmPassword: string;
}

const ResetPasswordPage: I18nPage = () => {
    const { ref, setSubmitting } = useForm<ResetPasswordFormValues>();
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .min(6, t('validation:passwordTooShort'))
            .required(t('validation:passwordRequired')),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], t('validation:passwordsNotMatch'))
            .required(t('validation:confirmPasswordRequired')),
    });

    const handleSubmit = async (values: ResetPasswordFormValues): Promise<void> => {
        const { password } = values;
        console.log('Submitted!', password);
        setSubmitting(false);
    };

    const renderForm = (props: FormikProps<ResetPasswordFormValues>): JSX.Element => (
        <StyledForm>
            <Field
                placeholder={t('forms:password')}
                name="password"
                component={TextField}
                label={t('forms:password')}
                type="password"
                fullWidth
            />
            <Field
                placeholder={t('forms:confirmPassword')}
                name="confirmPassword"
                type="password"
                component={TextField}
                label={t('forms:confirmPassword')}
                fullWidth
            />
            <FormSubmitSection submitButtonText={t('common:save')} {...props} />
        </StyledForm>
    );

    return (
        <Layout title={t('reset-password:title')} backUrl>
            <StyledCard>
                <CardHeader title={t('reset-password:title')} />
                <SlimCardContent>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        ref={ref}
                    >
                        {renderForm}
                    </Formik>
                </SlimCardContent>
            </StyledCard>
        </Layout>
    );
};

ResetPasswordPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePublicPage(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['reset-password']) };
};

export default compose(withApollo, withRedux)(ResetPasswordPage);
