import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { I18nProps } from 'src/types';
import * as Yup from 'yup';

import { FormLayout, FormSubmitSection } from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { useForm } from '../../utils';

const initialValues = {
    email: '',
    general: '',
};

export interface ResetPasswordLinkFormValues {
    email: string;
}

const ResetPasswordLinkPage: NextPage<I18nProps> = () => {
    const { ref, setSubmitting } = useForm<ResetPasswordLinkFormValues>();
    const { t } = useTranslation();

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email(t('validation:invalidEmail'))
            .required(t('validation:required')),
    });

    const handleSubmit = async (values: ResetPasswordLinkFormValues): Promise<void> => {
        const { email } = values;
        console.log('Submitted!', email);
        setSubmitting(false);
    };

    const renderCardContent = (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} ref={ref}>
            {(props): JSX.Element => (
                <Form>
                    <Field
                        placeholder={t('forms:email')}
                        name="email"
                        component={TextField}
                        label={t('forms:email')}
                        variant="outlined"
                        helperText={t('reset-password:helpText')}
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

export default ResetPasswordLinkPage;
