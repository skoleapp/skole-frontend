import React from 'react';
import { Layout, UploadResourceForm } from '../../../containers';
import { withAuthSync } from '../../../utils';
import { Formik, FormikActions } from 'formik';
import { StyledCard } from '../../../components';
import { UploadResourceFormValues } from '../../../interfaces';
import * as Yup from 'yup';
import { Typography } from '@material-ui/core';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required.'),
  type: Yup.string().required('Type is required.'),
  course: Yup.string().required('Course is required.'),
  resource: Yup.string().required('Resource is required')
});

const initialValues = {
  title: '',
  type: '',
  course: '',
  resource: ''
};
//implement submit when backend works
// moi
const UploadResourcePage: React.FC = () => {
  const handleSubmit = (
    values: UploadResourceFormValues,
    actions: FormikActions<UploadResourceFormValues>
  ) => {
    console.log(values);
    actions.setSubmitting(false);
  };

  return (
    <Layout title="Upload Resource">
      <StyledCard>
        <Typography variant="h5">Upload Resource</Typography>
        <Formik
          component={UploadResourceForm}
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validationSchema={validationSchema}
        />
      </StyledCard>
    </Layout>
  );
};

export default withAuthSync(UploadResourcePage);
