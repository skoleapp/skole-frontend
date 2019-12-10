import { CardHeader } from '@material-ui/core';
import { Formik } from 'formik';
import { NextPage } from 'next';
import React from 'react';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { openNotification } from '../actions';
import { ContactForm, Layout, SlimCardContent, StyledCard } from '../components';
import { ContactFormValues, SkoleContext } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync, useForm } from '../utils';
import { withTranslation } from '../i18n';

const initialValues = {
  contactType: '',
  email: '',
  message: '',
  general: ''
};

const validationSchema = Yup.object().shape({
  contactType: Yup.string().required('Contact type is required.'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required.'),
  message: Yup.string().required('Message is required.')
});

const ContactPage: NextPage = ({ t }: any) => {
  const dispatch = useDispatch();
  const { ref, resetForm } = useForm();

  // TODO: Finish this.
  const handleSubmit = (values: ContactFormValues): void => {
    console.log(values);
    resetForm();
    dispatch(openNotification('Message submitted!'));
  };

  return (
    <Layout t={t} title={t('titleContact')} backUrl="/">
      <StyledCard>
        <CardHeader title={t('headerContact')} />
        <SlimCardContent>
          <Formik
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
            component={ContactForm}
            ref={ref}
          />
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

ContactPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return { namespacesRequired: ['common'] };
};

export default compose(withRedux, withApollo, withTranslation('common'))(ContactPage);
