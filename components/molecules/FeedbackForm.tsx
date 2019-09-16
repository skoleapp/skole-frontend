import React, { ChangeEvent, Dispatch, FormEvent, SetStateAction } from 'react';
import { FeedbackType } from '../../types';
import { Button, FeedbackButton, Textarea } from '../atoms';
import { Row } from '../containers';

interface Props {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  setRate: Dispatch<SetStateAction<FeedbackType>>;
  setComment: (comment: string) => void;
  rate: FeedbackType;
}

export const FeedbackForm: React.FC<Props> = ({ onSubmit, setRate, setComment, rate }) => (
  <form onSubmit={onSubmit}>
    <Row>
      <FeedbackButton
        variant="good"
        onClick={(): void => setRate('good')}
        type="button"
        selected={rate === 'good'}
      >
        good
      </FeedbackButton>
      <FeedbackButton
        variant="ok"
        onClick={(): void => setRate('ok')}
        type="button"
        selected={rate === 'ok'}
      >
        ok
      </FeedbackButton>
      <FeedbackButton
        variant="bad"
        onClick={(): void => setRate('bad')}
        type="button"
        selected={rate === 'bad'}
      >
        bad
      </FeedbackButton>
    </Row>
    <Textarea
      placeholder="Tell us how we can improve our company."
      onChange={(e: ChangeEvent<HTMLTextAreaElement>): void => setComment(e.target.value)}
    />
    <Button type="submit">submit</Button>
  </form>
);
