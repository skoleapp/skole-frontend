import { CardContent, CardHeader } from '@material-ui/core';
import { Formik } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useDispatch } from 'react-redux';
import { compose } from 'redux';
import * as Yup from 'yup';
import { openNotification } from '../actions';
import { Layout, StyledCard } from '../components';
import { UploadResourceForm } from '../components/UploadResourceForm';
import { SkoleContext, UploadResourceFormValues } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync, useForm } from '../utils';

const validationSchema = Yup.object().shape({
  resourceTitle: Yup.string().required('Resource title is required.'),
  resourceType: Yup.string().required('Resource type is required.'),
  courseId: Yup.string().required('Course is required.'),
  resource: Yup.string().required('Resource is required.')
});

const initialValues = {
  resourceTitle: '',
  resourceType: '',
  courseId: '',
  resource: '',
  general: ''
};

const UploadResourcePage: NextPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { ref, setSubmitting, resetForm } = useForm();

  const handleSubmit = (values: UploadResourceFormValues) => {
    console.log(values);
    setSubmitting(false);
    resetForm();
    dispatch(openNotification('Resource uploaded!'));
    router.push('/');
  };

  return (
    <Layout title="Upload Resource" backUrl="/">
      <StyledCard>
        <CardHeader title="Upload Resource" />
        <CardContent>
          <Formik
            component={UploadResourceForm}
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
            ref={ref}
          />
        </CardContent>
      </StyledCard>
    </Layout>
  );
};

UploadResourcePage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return {};
};

export default compose(withApollo, withRedux)(UploadResourcePage);
