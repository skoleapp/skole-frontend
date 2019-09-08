import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Layout,
  Button,
  Flexbox,
  Centered,
  Card,
  Textarea,
  IntersectingWrapper,
  Subtitle
} from '../components';
import styled from 'styled-components';

const FeedbackCard = styled(Card)`
  min-height: 100%;
  width: 100%;
`;

const Feedback: React.FC = () => {
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
                maxLength={150}
                cols={40}
                rows={10}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>): void => setComment(e.target.value)}
              />
            </Flexbox>
            <form onSubmit={(e): void => handleSubmit(e)}>
              <Flexbox justifyContent="center">
                <Button type="submit">Submit</Button>
              </Flexbox>
            </form>
          </FeedbackCard>
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

export default Feedback;
