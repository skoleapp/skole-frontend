import * as Yup from 'yup';

import { Field, Formik } from 'formik';
import { FormLayout, FormSubmitSection, StyledForm } from '../../components';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { useForm, usePublicPage } from '../../utils';
import { withApollo, withRedux } from '../../lib';

import React from 'react';
import { TextField } from 'formik-material-ui';
import { compose } from 'redux';
import { includeDefaultNamespaces } from '../../i18n';
import { useTranslation } from 'react-i18next';

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
            .required(t('validation:emailRequired')),
    });

    const handleSubmit = async (values: ResetPasswordLinkFormValues): Promise<void> => {
        const { email } = values;
        console.log('Submitted!', email);
        setSubmitting(false);
    };

    const renderCardContent = (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} ref={ref}>
            {(props): JSX.Element => (
                <StyledForm>
                    <Field
                        placeholder={t('forms:email')}
                        name="email"
                        component={TextField}
                        label={t('forms:email')}
                        variant="outlined"
                        fullWidth
                    />
                    <FormSubmitSection submitButtonText={t('common:submit')} {...props} />
                </StyledForm>
            )}
        </Formik>
    );

    return <FormLayout title={t('reset-password:link')} renderCardContent={renderCardContent} backUrl />;
};

ResetPasswordLinkPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await usePublicPage(ctx);
    return { namespacesRequired: includeDefaultNamespaces(['reset-password']) };
};

export default compose(withApollo, withRedux)(ResetPasswordLinkPage);
