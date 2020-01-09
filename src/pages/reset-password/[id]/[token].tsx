import * as Yup from 'yup';

import { CardContent, CardHeader, Grid } from '@material-ui/core';
import { Field, Formik, FormikProps } from 'formik';
import { FormSubmitSection, Layout, StyledCard, StyledForm } from '../../../components';
import { I18nPage, I18nProps, SkoleContext } from '../../../types';
import { useForm, usePublicPage } from '../../../utils';
import { withApollo, withRedux } from '../../../lib';

import React from 'react';
import { TextField } from 'formik-material-ui';
import { compose } from 'redux';
import { includeDefaultNamespaces } from '../../../i18n';
import { useTranslation } from 'react-i18next';

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

    const renderForm = (props: FormikProps<ResetPasswordConfirmFormValues>): JSX.Element => (
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
    );

    return (
        <Layout title={t('reset-password:confirm')} backUrl>
            <StyledCard>
                <Grid container justify="center">
                    <Grid item xs={12} sm={8} md={6} lg={4}>
                        <CardHeader title={t('reset-password:confirm')} />
                        <CardContent>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                                ref={ref}
                            >
                                {renderForm}
                            </Formik>
                        </CardContent>
                    </Grid>
                </Grid>
            </StyledCard>
        </Layout>
    );
};

ResetPasswordConfirmPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePublicPage(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['reset-password']) };
};

export default compose(withApollo, withRedux)(ResetPasswordConfirmPage);
