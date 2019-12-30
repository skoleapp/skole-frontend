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
    email: '',
    general: '',
};

export interface ForgotPasswordFormValues {
    email: string;
}

const ForgotPasswordPage: I18nPage = () => {
    const { ref, setSubmitting } = useForm<ForgotPasswordFormValues>();
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email(t('validation:invalidEmail'))
            .required(t('validation:emailRequired')),
    });

    const handleSubmit = async (values: ForgotPasswordFormValues): Promise<void> => {
        const { email } = values;
        console.log('Submitted!', email);
        setSubmitting(false);
    };

    const renderForm = (props: FormikProps<ForgotPasswordFormValues>): JSX.Element => (
        <StyledForm>
            <Field
                placeholder={t('forms:email')}
                name="email"
                component={TextField}
                label={t('forms:email')}
                fullWidth
            />
            <FormSubmitSection submitButtonText={t('forgot-password:submitButton')} {...props} />
        </StyledForm>
    );

    return (
        <Layout title={t('forgot-password:title')} backUrl>
            <StyledCard>
                <CardHeader title={t('forgot-password:title')} />
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

ForgotPasswordPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePublicPage(ctx);

    return {
        namespacesRequired: includeDefaultNamespaces(['forgot-password']),
    };
};

export default compose(withApollo, withRedux)(ForgotPasswordPage);
