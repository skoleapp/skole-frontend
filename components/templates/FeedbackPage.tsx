import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button, Flexbox, Centered, Card, Textarea, Subtitle } from '../atoms';
import { IntersectingWrapper } from '../molecules';
import styled from 'styled-components';
import { Layout } from '.';

const FeedbackCard = styled(Card)`
  min-height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
`;

export const FeedbackPage: React.FC = () => {
  //const dispatch = useDispatch();

  const [rate, setRate] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmittted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSubmitted(true);
    console.log({ rate, comment });
  };

  return (
    <Layout title="Give feedback">
      <Centered>
        {!isSubmittted ? (
          <IntersectingWrapper time={2}>
            <FeedbackCard>
              <Flexbox justifyContent="center">
                <Button onClick={(): void => setRate('Terrible')}>Terrible</Button>
                <Button onClick={(): void => setRate('Bad')}>Bad</Button>
                <Button onClick={(): void => setRate('Fine')}>Fine</Button>
                <Button onClick={(): void => setRate('Good')}>Good</Button>
              </Flexbox>
              <Flexbox justifyContent="center">
                <Textarea
                  placeholder="Tell us how we can improve our company"
                  maxLength={41}
                  cols={30}
                  rows={15}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>): void =>
                    setComment(e.target.value)
                  }
                />
              </Flexbox>
              <form onSubmit={(e): void => handleSubmit(e)}>
                <Flexbox justifyContent="center">
                  <Button type="submit">Submit</Button>
                </Flexbox>
              </form>
            </FeedbackCard>
          </IntersectingWrapper>
        ) : (
          <Card>
            <Centered>
              <IntersectingWrapper time={3}>
                <Subtitle>Thank you for your feedback</Subtitle>
              </IntersectingWrapper>
            </Centered>
          </Card>
        )}
      </Centered>
    </Layout>
  );
};
