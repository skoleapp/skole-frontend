import React, { FormEvent, useState } from 'react';
import { FeedbackType } from '../../types';
import { H1 } from '../atoms';
import { FeedbackForm, ThanksForFeedback } from '../molecules';

export const FeedbackPage: React.FC = () => {
  //const dispatch = useDispatch();

  const [rate, setRate] = useState<FeedbackType>('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSubmitted(true);
    console.log({ rate, comment });
  };

  return (
    <>
      <H1>Leave Feedback</H1>
      {!submitted ? (
        <FeedbackForm onSubmit={onSubmit} setRate={setRate} setComment={setComment} rate={rate} />
      ) : (
        <ThanksForFeedback />
      )}
    </>
  );
};
