import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import * as Yup from 'yup';

import { FormLayout, FormSubmitSection } from '../../../components';
import { useTranslation } from '../../../i18n';
import { includeDefaultNamespaces } from '../../../i18n';
import { I18nProps } from '../../../types';
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

const ResetPasswordConfirmPage: NextPage<I18nProps> = () => {
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

export const getServerSideProps: GetServerSideProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['reset-password']),
    },
});

export default ResetPasswordConfirmPage;
