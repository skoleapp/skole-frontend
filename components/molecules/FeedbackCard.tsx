import React, { ChangeEvent, Dispatch, FormEvent, SetStateAction } from 'react';
import { Button, Card, FeedbackButton, Textarea, Title } from '../atoms';
import { Row } from '../containers';
import { FeedbackType } from '../shared';

interface Props {
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  setRate: Dispatch<SetStateAction<FeedbackType>>;
  setComment: (comment: string) => void;
  rate: FeedbackType;
}

export const FeedbackCard: React.FC<Props> = ({ handleSubmit, setRate, setComment, rate }) => (
  <Card>
    <Title>Feedback</Title>
    <form onSubmit={(e): void => handleSubmit(e)}>
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
      <Row>
        <Textarea
          placeholder="Tell us how we can improve our company."
          onChange={(e: ChangeEvent<HTMLTextAreaElement>): void => setComment(e.target.value)}
        />
      </Row>
      <Row>
        <Button type="submit">submit</Button>
      </Row>
    </form>
  </Card>
);
