import { ChangeEvent, FormEvent, useState } from 'react';
import { Button, Card, Title } from '../atoms';
import { Textarea } from '../atoms/Textarea';
import { IntersectingWrapper } from '../molecules';

type Rate = 'bad' | 'ok' | 'good' | '';

export const Feedback = () => {
  //const dispatch = useDispatch();

  const [rate, setRate] = useState<Rate>('');
  const [comment, setComment] = useState('');
  const [submittted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSubmitted(true);
    console.log({ rate, comment });
  };

  return !submittted ? (
    <Card>
      <form onSubmit={(e): void => handleSubmit(e)}>
        <Button onClick={(): void => setRate('bad')} text="bad" />
        <Button onClick={(): void => setRate('ok')} text="ok" />
        <Button onClick={(): void => setRate('good')} text="good" />
        <Textarea
          placeholder="Tell us how we can improve our company"
          onChange={(e: ChangeEvent<HTMLTextAreaElement>): void => setComment(e.target.value)}
        />
        <Button type="submit" text="submit" />
      </form>
    </Card>
  ) : (
    <Card>
      <IntersectingWrapper time={3}>
        <Title text="Thank you for your feedback!" />
      </IntersectingWrapper>
    </Card>
  );
};
