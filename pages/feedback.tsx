import React from 'react';
import { FeedbackPage, MainLayout } from '../components';

const Feedback: React.FC = () => (
  <MainLayout title="Leave Feedback" secondary>
    <FeedbackPage />
  </MainLayout>
);

export default Feedback;
