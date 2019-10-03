import { Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { FeedbackFormValues } from '../../interfaces';
import { FeedbackType } from '../../types';
import { H1 } from '../atoms';
import { FeedbackButtonSection, FeedbackForm, ThanksForFeedback } from '../molecules';

const initialValues = {
  comment: ''
};

const validationSchema = Yup.object().shape({
  comment: Yup.string().required('Please tell us some details about your feedback :)')
});

export const FeedbackPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [rate, setRate] = useState<FeedbackType>('');

  const onSubmit = async (values: FeedbackFormValues): Promise<void> => {
    console.log({ ...values, rate });
    setSubmitted(true);
  };

  return (
    <>
      <H1>Leave Feedback</H1>
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
    </>
  );
};
