import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import * as Yup from 'yup';

import { FormLayout, FormSubmitSection } from '../../../components';
import { useTranslation } from '../../../i18n';
import { includeDefaultNamespaces } from '../../../i18n';
import { withApollo } from '../../../lib';
import { I18nPage, I18nProps } from '../../../types';
import { useForm } from '../../../utils';

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
            .required(t('validation:required')),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], t('validation:passwordsNotMatch'))
            .required(t('validation:required')),
    });

    const handleSubmit = async (values: ResetPasswordConfirmFormValues): Promise<void> => {
        const { password } = values;
        console.log('Submitted!', password);
        setSubmitting(false);
    };

    const renderCardContent = (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} ref={ref}>
            {(props): JSX.Element => (
                <Form>
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
                </Form>
            )}
        </Formik>
    );

    const layoutProps = {
        seoProps: {
            title: t('reset-password:title'),
            description: t('reset-password:description'),
        },
        topNavbarProps: {
            header: t('reset-password:header'),
            dynamicBackUrl: true,
        },
        renderCardContent: renderCardContent,
        desktopHeader: t('reset-password:header'),
    };

    return <FormLayout {...layoutProps} />;
};

ResetPasswordConfirmPage.getInitialProps = (): I18nProps => ({
    namespacesRequired: includeDefaultNamespaces(['reset-password']),
});

export default withApollo(ResetPasswordConfirmPage);
