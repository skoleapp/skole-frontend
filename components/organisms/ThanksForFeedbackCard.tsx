import { Card, Title } from '../atoms';
import { IntersectingWrapper } from '../molecules';

export const ThanksForFeedbackCard = () => (
  <Card>
    <IntersectingWrapper time={3}>
      <Title text="Thank you for your feedback!" />
    </IntersectingWrapper>
  </Card>
);
