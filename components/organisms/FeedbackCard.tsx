import { Typography } from '@material-ui/core';
import { Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { FeedbackFormValues } from '../../interfaces';
import { FeedbackType } from '../../types';
import { FeedbackButtonSection, FeedbackForm, ThanksForFeedback } from '../molecules';
import { Card } from '../atoms';

const initialValues = {
  comment: ''
};

const validationSchema = Yup.object().shape({
  comment: Yup.string().required('Please tell us some details about your feedback.')
});

export const FeedbackCard: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [rate, setRate] = useState<FeedbackType>('');

  const onSubmit = async (values: FeedbackFormValues): Promise<void> => {
    console.log({ ...values, rate });
    setSubmitted(true);
  };

  return (
    <Card>
      <Typography variant="h5">Leave Feedback</Typography>
      {!submitted ? (
        <>
          <FeedbackButtonSection rate={rate} setRate={setRate} />
          <Formik
            onSubmit={onSubmit}
            initialValues={initialValues}
            validationSchema={validationSchema}
            component={FeedbackForm}
          />
        </>
      ) : (
        <ThanksForFeedback />
      )}
    </Card>
  );
};
