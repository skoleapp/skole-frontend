import { FormEvent, useState } from 'react';
import { FeedbackCard } from '../organisms/FeedbackCard';
import { ThanksForFeedbackCard } from '../organisms/ThanksForFeedbackCard';

export type Rate = 'bad' | 'ok' | 'good' | '';

export const Feedback: React.FC = () => {
  //const dispatch = useDispatch();

  const [rate, setRate] = useState<Rate>('');
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
