import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-material-ui';
import React from 'react';
import { compose } from 'redux';
import * as Yup from 'yup';

import { FormLayout, FormSubmitSection } from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps } from '../../types';
import { useForm } from '../../utils';

const initialValues = {
    email: '',
    general: '',
};

export interface ResetPasswordLinkFormValues {
    email: string;
}

const ResetPasswordLinkPage: I18nPage = () => {
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

ResetPasswordLinkPage.getInitialProps = (): I18nProps => ({
    namespacesRequired: includeDefaultNamespaces(['reset-password']),
});

export default compose(withApollo, withRedux)(ResetPasswordLinkPage);
