import React from 'react';
import { FeedbackCard, Layout } from '../components';
import { withAuth } from '../lib';

const FeedbackPage: React.FC = () => (
  <Layout title="Leave Feedback">
    <FeedbackCard />
  </Layout>
);

export default withAuth(FeedbackPage);
