import React, { FormEvent, useState } from 'react';
import { FeedbackCard, ThanksForFeedbackCard } from '../molecules';
import { FeedbackType } from '../shared';

export const FeedbackPage: React.FC = () => {
  //const dispatch = useDispatch();

  const [rate, setRate] = useState<FeedbackType>('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSubmitted(true);
    console.log({ rate, comment });
  };

  return !submitted ? (
    <FeedbackCard
      handleSubmit={handleSubmit}
      setRate={setRate}
      setComment={setComment}
      rate={rate}
    />
  ) : (
    <ThanksForFeedbackCard />
  );
};
