import React from 'react';
import { FeedbackCard, MainLayout } from '../components';
import { withAuth } from '../lib';

const FeedbackPage: React.FC = () => (
  <MainLayout title="Leave Feedback">
    <FeedbackCard />
  </MainLayout>
);

export default withAuth(FeedbackPage);
