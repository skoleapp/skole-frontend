import { CardContent, CardHeader } from '@material-ui/core';
import { Formik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { openNotification } from '../actions';
import { ContactForm, Layout, StyledCard } from '../components';
import { ContactFormValues, SkoleContext } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync, useForm } from '../utils';

const initialValues = {
  contactType: '',
  message: '',
  general: ''
};

const validationSchema = Yup.object().shape({
  contactType: Yup.string().required('Contact type is required.'),
  message: Yup.string().required('Message is required.')
});

const ContactPage: NextPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { ref, resetForm } = useForm();

  // TODO: Finish this.
  const handleSubmit = async (values: ContactFormValues): Promise<void> => {
    console.log(values);
    resetForm();
    dispatch(openNotification('Message submitted!'));
    router.push('/');
  };

  return (
    <Layout heading="Feedback" title="Feedback" backUrl="/">
      <StyledCard>
        <CardHeader title="Contact" />
        <CardContent>
          <Formik
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
            component={ContactForm}
            ref={ref}
          />
        </CardContent>
      </StyledCard>
    </Layout>
  );
};

ContactPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return {};
};

export default compose(withRedux, withApollo)(ContactPage);
