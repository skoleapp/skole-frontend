import React from 'react';
import { Card, Title } from '../atoms';
import { IntersectingWrapper } from '../molecules';

export const ThanksForFeedbackCard: React.FC = () => (
  <Card>
    <IntersectingWrapper time={3}>
      <Title>Thank you for your feedback!</Title>
    </IntersectingWrapper>
  </Card>
);
