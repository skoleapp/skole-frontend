import React from 'react';
import { FeedbackCard, Layout } from '../components';
import { withAuthSync } from '../utils';

const FeedbackPage: React.FC = () => (
  <Layout title="Leave Feedback">
    <FeedbackCard />
  </Layout>
);

export default withAuthSync(FeedbackPage);
